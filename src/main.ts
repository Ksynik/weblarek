import './scss/styles.scss';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { ServerService } from './components/base/ServerService';
import { Api } from './components/base/Api';
import { API_URL, mapCategoryToModifier } from './utils/constants';
import { Gallery } from './components/View/Gallery';
import { CatalogCard } from './components/View/cards/CatalogCard';
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { Header } from './components/View/Header';
import { ModalView } from './components/View/Modal';
import { PreviewCard } from './components/View/cards/PreviewCard';
import { Basket } from './components/View/Basket';
import { BasketItem } from './components/View/cards/BasketItems';
import { OrderForm } from './components/View/forms/OrderForm';
import { ContactsForm } from './components/View/forms/ContactForm';
import { Success } from './components/View/Success';
import { Cart } from './components/Models/Cart';
import { User } from './components/Models/User';
import { IProduct, TOrder, TPayment } from './types';

//  Шаблоны 
const templates = {
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
    cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    order: ensureElement<HTMLTemplateElement>('#order'),
    contacts: ensureElement<HTMLTemplateElement>('#contacts'),
    success: ensureElement<HTMLTemplateElement>('#success')
};

//  События и модели 
const events = new EventEmitter();
const api = new Api(API_URL);
const server = new ServerService(api);
const catalog = new ProductCatalog();
const cart = new Cart();
const user = new User();

// Представления 
const galleryView = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const modal = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(templates.basket));
const orderForm = new OrderForm(cloneTemplate(templates.order) as HTMLFormElement, events, user);
const contactsForm = new ContactsForm(cloneTemplate(templates.contacts) as HTMLFormElement, events, user);
const success = new Success(cloneTemplate(templates.success));

//  Функция создания превью-карточки 
const createPreviewCard = (product: IProduct) => {
    const isInCart = cart.hasItem(product.id);
    const noPrice = product.price === null;

    const previewCard = new PreviewCard(cloneTemplate(templates.cardPreview), events);
    previewCard.id = product.id;
    previewCard.image = product.image;
    previewCard.title = product.title;
    previewCard.price = product.price;
    previewCard.category = product.category;
    previewCard.categoryClass = mapCategoryToModifier(product.category);
    previewCard.description = product.description;
    previewCard.buttonText = isInCart ? 'Удалить из корзины' : noPrice ? 'Недоступно' : 'Купить';
    previewCard.buttonDisabled = noPrice;

    previewCard.onClick = () => {
        if (cart.hasItem(product.id)) {
            cart.removeItem(product);
        } else if (!noPrice) {
            cart.addItem(product);
        }
        modal.close();
    };

    return previewCard.render();
};

const createBasketItems = () => {
    const items = cart.getItems();

    if (items.length === 0) {
        basket.items = [];
        basket.total = 0;
        return;
    }

    const nodes = items.map((product: IProduct, index: number) => {
        const basketItem = new BasketItem(cloneTemplate(templates.cardBasket), events);
        basketItem.id = product.id;
        basketItem.index = index + 1;
        basketItem.title = product.title;
        basketItem.price = product.price;

        return basketItem.render();
    });

    basket.items = nodes;
    basket.total = cart.getTotalPrice();
};

//  Каталог 
catalog.on('products:changed', () => {
    const products = catalog.getProducts();
    galleryView.catalog = products.map(product => {
        const card = new CatalogCard(events, cloneTemplate(templates.cardCatalog));
        return card.render(product);
    });
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

//  Корзина 
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

// OrderForm 
const updateOrderFormState = () => {
    const errors = user.validate();
    const isValid = !errors.address && !errors.payment;
    orderForm.submitButtonEnabled = isValid;
    orderForm.errors = isValid ? '' : errors.address || errors.payment || '';
};

orderForm.events.on('OrderForm:fieldChanged', (data: { field: string; value: string }) => {
    user.setData({ [data.field]: data.value });
    updateOrderFormState();
});

orderForm.events.on('OrderForm:paymentChanged', ({ method }: { method: TPayment }) => {
    user.setData({ payment: method });
    updateOrderFormState();
});

orderForm.events.on('OrderForm:submit', () => {
    contactsForm.clear();
    modal.content = contactsForm.render();
    modal.open();
    updateContactsFormState();
});

// ContactsForm
const updateContactsFormState = () => {
    const errors = user.validate();
    const isValid = !errors.email && !errors.phone;
    contactsForm.submitButtonEnabled = isValid;

    const firstError = (Object.values(errors) as (string | null)[]).find(e => e !== null) || '';
    contactsForm.errors = firstError;
};

contactsForm.events.on('ContactsForm:fieldChanged', ({ field, value }: { field: 'email' | 'phone'; value: string }) => {
    user.setData({ [field]: value });
    updateContactsFormState();
});

contactsForm.events.on('ContactsForm:submit', async () => {
    const errors = user.validate();
    const isValid = !errors.email && !errors.phone;

    if (!isValid) {
        contactsForm.errors = errors.email || errors.phone || 'Некорректные данные';
        return;
    }

    const items = cart.getItems().map(item => item.id);
    const total = cart.getTotalPrice();

    if (!items.length || !total) {
        contactsForm.errors = 'Корзина пуста или сумма заказа не указана';
        return;
    }

    const order: TOrder = {
        items,
        total,
        payment: user.payment,
        address: user.address,
        email: user.email,
        phone: user.phone
    };

    try {
        await server.createOrder(order);

        success.totalPrice = total;
        success.onClose = () => modal.close();

        modal.content = success.render();
        modal.open();

        cart.clear();
        contactsForm.clear();
        user.clear();
    } catch (err: any) {
        contactsForm.errors = err?.message || 'Ошибка оформления заказа';
        console.error('Ошибка оформления заказа:', err);
    }
});

// Загрузка товаров
server.getProductList()
    .then(products => catalog.setProducts(products))
    .catch(err => console.error('Ошибка загрузки товаров:', err));
