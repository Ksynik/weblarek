/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 
/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

export const settings = {

};

// Карта соответствия категории и модификатора класса card__category
export const categoryMap: { [key: string]: string } = {
    'софт-скил': 'soft',
    'другое': 'other',
    'дополнительное': 'additional',
    'кнопка': 'button',
    'хард-скил': 'hard'
};

export function mapCategoryToModifier(category: string): string {
    return categoryMap[category] || 'other';
}

