import './scss/styles.scss';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { ServerService } from './components/base/ServerService';
import { Gallery } from './components/View/Gallery';
import { CatalogCard } from './components/View/cards/CatalogCard';
import { ensureElement } from './utils/utils';
import { mapCategoryToModifier } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Header } from './components/View/Header';
import { ModalView } from './components/View/Modal';
import { PreviewCard } from './components/View/cards/PreviewCard';
import { Basket } from './components/View/Basket';
import { BasketItem } from './components/View/BasketItems';
import { OrderForm } from './components/View/forms/OrderForm';
import { ContactsForm } from './components/View/forms/ContactForm';
import { Success } from './components/View/Success';
import { Cart } from './components/Models/Cart';
import { User } from './components/Models/User';
import { IProduct, TOrder } from './types';

function cloneTemplate(template: HTMLTemplateElement): HTMLElement {
    const root = template.content.firstElementChild as HTMLElement | null;
    if (!root) throw new Error('Template has no root element');
    return root.cloneNode(true) as HTMLElement;
}

// Инициализация компонентов
const templates = {
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
    cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    order: ensureElement<HTMLTemplateElement>('#order'),
    contacts: ensureElement<HTMLTemplateElement>('#contacts'),
    success: ensureElement<HTMLTemplateElement>('#success')
};

const events = new EventEmitter();
const server = new ServerService(import.meta.env.VITE_API_ORIGIN || '');
const catalog = new ProductCatalog();
const cart = new Cart();
const user = new User();

const galleryView = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(ensureElement<HTMLElement>('.header'));
const modal = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(templates.basket));
const orderForm = new OrderForm(cloneTemplate(templates.order) as HTMLFormElement);
const contactsForm = new ContactsForm(cloneTemplate(templates.contacts) as HTMLFormElement);

// Функция создания карточки превью
const createPreviewCard = (product: IProduct) => {
    const previewCard = new PreviewCard(cloneTemplate(templates.cardPreview));
    const isInCart = cart.hasItem(product.id);
    const noPrice = product.price === null;

    previewCard.image = product.image;
    previewCard.alt = product.title;
    previewCard.category = product.category;
    previewCard.categoryClass = mapCategoryToModifier(product.category);
    previewCard.title = product.title;
    previewCard.description = product.description;
    previewCard.price = product.price;

    // Правильная логика состояний кнопки
    if (isInCart) {
        previewCard.buttonText = 'Удалить из корзины';
        previewCard.buttonDisabled = false;
    } else if (noPrice) {
        previewCard.buttonText = 'Недоступно';
        previewCard.buttonDisabled = true;
    } else {
        previewCard.buttonText = 'Купить';
        previewCard.buttonDisabled = false;
    }

    previewCard.onClick = () => {
        if (isInCart) {
            cart.removeItem(product);
        } else if (!noPrice) {
            cart.addItem(product);
        }
        modal.close();
    };

    return previewCard;
};

// Функция создания элементов корзины
const createBasketItems = () => {
    const items = cart.getItems();
    if (items.length === 0) {
        basket.items = [];
        basket.total = 0;
    } else {
        const nodes = items.map((p: IProduct, idx: number) => {
            const bi = new BasketItem(cloneTemplate(templates.cardBasket));
            bi.index = idx + 1;
            bi.title = p.title;
            bi.price = p.price;
            bi.onDelete = () => {
                cart.removeItem(p);
                createBasketItems();
            };
            return bi.render();
        });
        basket.items = nodes;
        basket.total = cart.getTotalPrice();
    }
};

// Обработчики событий
catalog.on('products:changed', () => {
    const products = catalog.getProducts();
    const cardNodes = products.map((product) => {
        const card = new CatalogCard(events, cloneTemplate(templates.cardCatalog));
        card.id = product.id;
        card.category = product.category;
        card.title = product.title;
        card.image = product.image;
        card.price = product.price;
        return card.render();
    });
    galleryView.catalog = cardNodes;
});

events.on('card:select', ({ id }: { id: string }) => {
    const product = catalog.getProductById(id);
    if (product) catalog.setSelectedProduct(product);
});

catalog.on('product:selected', (product: IProduct) => {
    modal.content = createPreviewCard(product).render();
    modal.open();
});

catalog.on('preview:changed', (product: IProduct) => {
    modal.content = createPreviewCard(product).render();
    modal.open();
});

header.onBasketClick = () => {
    createBasketItems();
    basket.onOrder = () => {
        orderForm.payment = user.payment;
        orderForm.address = user.address;
        modal.content = orderForm.render();
        modal.open();
    };
    modal.content = basket.render();
    modal.open();
};

cart.on('cart:changed', () => {
    header.counter = cart.getCount();
    createBasketItems();
});

orderForm.onPaymentChange = (method) => {
    user.setData({ payment: method });
};

orderForm.onSubmit = (data) => {
    user.setData({ address: data.address, payment: data.payment });
    contactsForm.clear();
    modal.content = contactsForm.render();
    modal.open();
};

contactsForm.onSubmit = async (data) => {
    user.setData({ email: data.email, phone: data.phone });

    const order: TOrder = {
        items: cart.getItems().map((i) => i.id),
        price: cart.getTotalPrice(),
        payment: user.payment,
        address: user.address,
        email: user.email,
        phone: user.phone,
    };

    const payload = { ...order, total: cart.getTotalPrice() } as unknown as TOrder;

    try {
        await server.createOrder(payload);
        const success = new Success(cloneTemplate(templates.success));
        success.totalPrice = cart.getTotalPrice();
        success.onClose = () => modal.close();
        modal.content = success.render();
        modal.open();

        cart.clear();
        user.clear();
    } catch (err) {
        console.error('Ошибка оформления заказа:', err);
    }
};

events.on('modal:open', () => document.body.classList.add('modal-open'));
events.on('modal:close', () => document.body.classList.remove('modal-open'));

// Загрузка данных
server.getProductList()
    .then((products) => catalog.setProducts(products))
    .catch((err) => console.error('Ошибка загрузки товаров:', err));