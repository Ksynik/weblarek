import './scss/styles.scss';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { User } from './components/Models/User';
import { ServerService } from './components/base/ServerService';
import { IProduct, IUser } from './types';

// Создание экземпляров классов
const catalog = new ProductCatalog();
const cart = new Cart();
const user = new User();
const baseUrl = import.meta.env.VITE_API_URL || '';
const server = new ServerService(baseUrl);

// Тестовые данные
const testProduct: IProduct = {
	id: '1',
	description: 'Тестовый товар',
	image: 'test.jpg',
	title: 'Тест',
	category: 'test',
	price: 1000
};

const testUser: IUser = {
	payment: 'card',
	email: 'test@example.com',
	phone: '+79999999999',
	address: 'Тестовый адрес'
};

// Тестирование методов моделей
catalog.setProducts([testProduct]);
console.log('Каталог товаров:', catalog.getProducts());
console.log('Товар по id:', catalog.getProductById('1'));
catalog.setSelectedProduct(testProduct);
console.log('Выбранный товар:', catalog.getSelectedProduct());

cart.addItem(testProduct);
console.log('Корзина:', cart.getItems());
console.log('Сумма корзины:', cart.getTotalPrice());
console.log('Количество товаров:', cart.getCount());
console.log('Есть ли товар в корзине:', cart.hasItem('1'));
cart.removeItem(testProduct);
console.log('Корзина после удаления:', cart.getItems());
cart.clear();
console.log('Корзина после очистки:', cart.getItems());

user.setData(testUser);
console.log('Данные пользователя:', user.getData());
console.log('Валидность данных пользователя:', user.validate());
user.clear();
console.log('Данные пользователя после очистки:', user.getData());

// Запрос к серверу за массивом товаров
server.getProducts()
	.then(products => {
		catalog.setProducts(products);
		console.log('Товары с сервера:', catalog.getProducts());
	})
	.catch(err => {
		console.error('Ошибка получения товаров:', err);
	});