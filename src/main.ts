import './scss/styles.scss';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { ServerService } from './components/base/ServerService';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { Gallery } from './components/View/Gallery';
import { CatalogCard } from './components/View/cards/CatalogCard';
import { ensureElement, cloneTemplate } from './utils/utils';
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
import { IProduct, TOrder, TPayment } from './types';

// Шаблоны
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
const api = new Api(API_URL);
const server = new ServerService(api);
const catalog = new ProductCatalog();
const cart = new Cart();
const user = new User();

// View
const galleryView = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const modal = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(templates.basket));
const orderForm = new OrderForm(cloneTemplate(templates.order) as HTMLFormElement);
const contactsForm = new ContactsForm(cloneTemplate(templates.contacts) as HTMLFormElement);
const success = new Success(cloneTemplate(templates.success));

// Функция создания карточки превью
const createPreviewCard = (product: IProduct) => {
    const previewCard = new PreviewCard(cloneTemplate(templates.cardPreview));
    const isInCart = cart.hasItem(product.id);
    const noPrice = product.price === null;

    let buttonText: string;
    let buttonDisabled: boolean;

    if (isInCart) {
        buttonText = 'Удалить из корзины';
        buttonDisabled = false;
    } else if (noPrice) {
        buttonText = 'Недоступно';
        buttonDisabled = true;
    } else {
        buttonText = 'Купить';
        buttonDisabled = false;
    }

    previewCard.addClickHandler(() => {
        if (isInCart) {
            cart.removeItem(product);
        } else if (!noPrice) {
            cart.addItem(product);
        }
        modal.close();
    });

    return previewCard.render({
        image: product.image,
        alt: product.title,
        category: product.category,
        categoryClass: mapCategoryToModifier(product.category),
        title: product.title,
        description: product.description,
        price: product.price,
        buttonText,
        buttonDisabled
    });
};

// Функция создания элементов корзины
const createBasketItems = () => {
    const items = cart.getItems();
    if (items.length === 0) {
        basket.items = [];
        basket.total = 0;
    } else {
        const nodes = items.map((product: IProduct, index: number) => {
            const basketItem = new BasketItem(events, cloneTemplate(templates.cardBasket));
            basketItem.index = index + 1;
            basketItem.title = product.title;
            basketItem.price = product.price;
            basketItem.addDeleteHandler(() => {
                cart.removeItem(product);
            });
            return basketItem.render();
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
        return card.render(product);
    });
    galleryView.catalog = cardNodes;
});

events.on('card:select', ({ id }: { id: string }) => {
    const product = catalog.getProductById(id);
    if (product) catalog.setSelectedProduct(product);
});

catalog.on('product:selected', (product: IProduct) => {
    modal.content = createPreviewCard(product);
    modal.open();
});

catalog.on('preview:changed', (product: IProduct) => {
    modal.content = createPreviewCard(product);
    modal.open();
});

events.on('header:basketClick', () => {
    createBasketItems();
    basket.events.on('basket:order', () => {
        orderForm.payment = user.payment;
        orderForm.address = user.address;
        modal.content = orderForm.render();
        modal.open();
    });
    modal.content = basket.render();
    modal.open();
});

cart.on('cart:changed', () => {
    header.counter = cart.getCount();
    createBasketItems();
});

// --- OrderForm ---
orderForm.events.on('payment:changed', ({ method }: { method: TPayment }) => {
    user.setData({ payment: method });

    const errors = user.getOrderErrors();
    const isValid = Object.keys(errors).length === 0;

    orderForm.updateSubmitButtonState(isValid);
    orderForm.updateErrors(isValid ? '' : Object.values(errors)[0]);
});

orderForm.events.on('field:changed', (data: { field: string; value: string }) => {
    user.setData({ [data.field]: data.value });

    const errors = user.getOrderErrors();
    const isValid = Object.keys(errors).length === 0;

    orderForm.updateSubmitButtonState(isValid);
    orderForm.updateErrors(isValid ? '' : Object.values(errors)[0]);
});

orderForm.events.on('submit', () => {
    const errors = user.getOrderErrors();
    if (Object.keys(errors).length > 0) {
        orderForm.updateErrors(Object.values(errors)[0]);
        return;
    }

    contactsForm.clear();
    modal.content = contactsForm.render();
    modal.open();
});

// --- ContactsForm ---
contactsForm.events.on('field:changed', (data: { field: string; value: string }) => {
    user.setData({ [data.field]: data.value });

    const errors = user.getContactsErrors();
    const isValid = Object.keys(errors).length === 0;

    contactsForm.updateSubmitButtonState(isValid);
    contactsForm.updateErrors(isValid ? '' : Object.values(errors)[0]);
});

contactsForm.events.on('submit', async () => {
    const errors = user.getContactsErrors();
    if (Object.keys(errors).length > 0) {
        contactsForm.updateErrors(Object.values(errors)[0]);
        return;
    }

    // финальная проверка всех полей
    const finalErrors = user.getFieldErrors();
    if (Object.keys(finalErrors).length > 0) {
        console.error('Ошибка: не все поля заполнены', finalErrors);
        return;
    }

    const order: TOrder = {
        items: cart.getItems().map((item) => item.id),
        total: cart.getTotalPrice(),
        payment: user.payment,
        address: user.address,
        email: user.email,
        phone: user.phone,
    };

    try {
        await server.createOrder(order);
        success.totalPrice = cart.getTotalPrice();
        success.onClose = () => modal.close();
        modal.content = success.render();
        modal.open();

        cart.clear();
        user.clear();
    } catch (err) {
        console.error('Ошибка оформления заказа:', err);
    }
});

// Загрузка данных
server.getProductList()
    .then((products) => catalog.setProducts(products))
    .catch((error) => console.error('Ошибка загрузки товаров:', error));

