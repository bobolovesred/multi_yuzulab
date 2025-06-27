

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { FlowerProduct, CartItem, Store } from '../types';
import { City } from '../types';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { InputField } from './common/InputField';
import { gsap } from 'gsap';

// --- ICONS ---
const HeartIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);
const StarIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${className}`}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
  </svg>
);
const FilterIcon: React.FC<{className?: string}> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 12h9.75m-9.75 6h9.75M3.75 6h1.5M3.75 12h1.5M3.75 18h1.5" />
</svg>
);
const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-3 h-3 ${className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>
);
const SortIcon: React.FC<{className?: string}> = ({className}) => ( // Used for Desktop sort
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
</svg>
);
const StoreIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0 0 11.25 11.25H4.5A2.25 2.25 0 0 0 2.25 13.5V21M3 7.5h18M5.25 7.5h13.5m-13.5 0V3.75c0-.621.504-1.125 1.125-1.125h10.5c.621 0 1.125.504 1.125 1.125V7.5m-13.5 0h13.5M3.75 21h16.5M4.5 11.25h6.75a2.25 2.25 0 0 0 2.25-2.25V3.75M16.5 11.25h.008v.008H16.5V11.25Zm0 0h.008v.008H16.5V11.25Z" />
  </svg>
);
const MapPinIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);
// Mobile Filter Icons
const ListBulletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);
const AdjustmentsHorizontalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3.75 6h1.5M3.75 12h1.5M3.75 18h1.5" />
</svg>
);
const TagIcon: React.FC<{ className?: string }> = ({ className }) => ( // For Price
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
);
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => ( // For Composition
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L21 5.25l-.813 2.846a4.5 4.5 0 0 0-3.09 3.09L14.25 12l2.846.813a4.5 4.5 0 0 0 3.09 3.09L21 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L14.25 12Z" />
    </svg>
);


const storesData: Store[] = [
    { id: 's_en', name: 'Цветочный Дворик (Енакиево)', city: City.ENAKIEVO, address: 'ул. Ленина, 52', operatingHours: "8:00 - 20:00", imageUrl: 'https://picsum.photos/seed/store_enakievo/600/400' },
    { id: 's_kir', name: 'Арт Флора (Кировское)', city: City.KIROVSKOE, address: 'пр. Мира, 15А', operatingHours: "9:00 - 19:00", imageUrl: 'https://picsum.photos/seed/store_kirovskoe/600/400' },
];

const flowerProductsData: FlowerProduct[] = [
  // Existing products with storeIds
  { id: 'f1', name: 'Букет "Пионы 11 штук в крафте"', price: 4290, originalPrice: 5363, imageUrls: ['https://picsum.photos/seed/pionies_craft/600/400'], description: 'Роскошные пионы в стильной крафтовой упаковке.', category: 'Монобукеты', rating: 4.89, reviewsCount: 3540, flowerTypesIncluded: ['Пионы'], occasionTags: ['Любимой девушке', 'Маме'], storeIds: ['s_en', 's_kir'] },
  { id: 'f2', name: 'Букет "Воздушные Пионы"', price: 2990, originalPrice: 3738, imageUrls: ['https://picsum.photos/seed/air_pionies/600/400'], description: 'Нежные и ароматные пионы.', category: 'Монобукеты', rating: 4.89, reviewsCount: 3540, flowerTypesIncluded: ['Пионы'], occasionTags: ['На день рождения'], storeIds: ['s_en'] },
  { id: 'f3', name: 'Пионы 11 штук', price: 4900, imageUrls: ['https://picsum.photos/seed/pionies_11/600/400'], description: 'Классический букет из 11 пионов.', category: 'Монобукеты', rating: 4.79, reviewsCount: 5100, flowerTypesIncluded: ['Пионы'], isPopular: true, storeIds: ['s_kir'] },
  { id: 'f7', name: 'Гортензия с пионовидными розами', price: 3496, originalPrice: 4600, imageUrls: ['https://picsum.photos/seed/hydrangea_roses/600/400'], description: 'Элегантное сочетание гортензии и роз.', category: 'Авторские букеты', rating: 4.90, reviewsCount: 2500, flowerTypesIncluded: ['Гортензия', 'Розы'], deliveryTime: 60, occasionTags: ['Маме'], storeIds: ['s_en', 's_kir'] },
  { id: 'f8', name: 'Пионы 9 штук', price: 3900, imageUrls: ['https://picsum.photos/seed/pionies_9/600/400'], description: 'Компактный букет из 9 пионов.', category: 'Монобукеты', rating: 4.88, reviewsCount: 3200, flowerTypesIncluded: ['Пионы'], isReadyMade: true, storeIds: ['s_en'] },
  { id: 'f9', name: 'Букет "Нежные летние альстромерии"', price: 2793, originalPrice: 3990, imageUrls: ['https://picsum.photos/seed/alstroemeria/600/400'], description: 'Яркие и стойкие альстромерии.', category: 'Монобукеты', rating: 4.81, reviewsCount: 2800, flowerTypesIncluded: ['Альстромерии'], deliveryTime: 90, storeIds: ['s_kir'] },
  { id: 'f10', name: 'Букет из 5 эустом в крафте', price: 2999, originalPrice: 3588, imageUrls: ['https://picsum.photos/seed/eustoma_5/600/400'], description: 'Нежные эустомы в крафте.', category: 'Монобукеты', rating: 4.85, reviewsCount: 2200, flowerTypesIncluded: ['Эустома'], occasionTags: ['Любимой девушке'], storeIds: ['s_en'] },
  { id: 'f11', name: 'Лавандовые сны', price: 3960, originalPrice: 4800, imageUrls: ['https://picsum.photos/seed/lavender_dreams/600/400'], description: 'Ароматный букет с лавандой.', category: 'Авторские букеты', rating: 4.83, reviewsCount: 4400, flowerTypesIncluded: ['Лаванда', 'Розы'], isPopular: true, storeIds: ['s_kir', 's_en'] },
  { id: 'f12', name: 'Букет с пионовидными розами', price: 3467, originalPrice: 4280, imageUrls: ['https://picsum.photos/seed/peony_roses_mix/600/400'], description: 'Роскошные пионовидные розы.', category: 'Монобукеты', rating: 4.83, reviewsCount: 5000, flowerTypesIncluded: ['Розы пионовидные'], occasionTags: ['Маме', 'Любимой девушке'], storeIds: ['s_en'] },
  { id: 'f13', name: 'Букет Лидия', price: 2490, originalPrice: 3113, imageUrls: ['https://picsum.photos/seed/lidia_bouquet/600/400'], description: 'Яркий и жизнерадостный букет.', category: 'Авторские букеты', rating: 4.89, reviewsCount: 3540, flowerTypesIncluded: ['Герберы', 'Хризантемы'], isReadyMade: true, deliveryTime: 75, storeIds: ['s_kir'] },
  { id: 'f14', name: 'Пионы Сара Бернар с эвкалиптом 11шт', price: 3480, originalPrice: 5800, imageUrls: ['https://picsum.photos/seed/sarah_bernardt/600/400'], description: 'Знаменитые пионы Сара Бернар.', category: 'Монобукеты', rating: 4.93, reviewsCount: 9470, flowerTypesIncluded: ['Пионы', 'Эвкалипт'], isPopular: true, occasionTags: ['Любимой девушке', 'На день рождения'], storeIds: ['s_en', 's_kir'] },
  { id: 'f15', name: 'Букет французские розы и ромашка', price: 2996, originalPrice: 4280, imageUrls: ['https://picsum.photos/seed/french_roses_chamomile/600/400'], description: 'Классическое сочетание роз и ромашек.', category: 'Авторские букеты', rating: 4.97, reviewsCount: 2000, flowerTypesIncluded: ['Розы', 'Ромашки'], deliveryTime: 90, storeIds: ['s_en'] },
  
  // New products to fill categories
  { id: 'f16', name: 'Розы в элегантной коробке', price: 3800, imageUrls: ['https://picsum.photos/seed/roses_box/600/400'], description: 'Красные розы в стильной шляпной коробке.', category: 'Цветы в коробке', rating: 4.9, reviewsCount: 1500, flowerTypesIncluded: ['Розы'], storeIds: ['s_en', 's_kir'] },
  { id: 'f17', name: 'Весенняя корзина с тюльпанами', price: 3200, imageUrls: ['https://picsum.photos/seed/tulips_basket/600/400'], description: 'Яркие тюльпаны в плетеной корзине.', category: 'Цветы в корзине', rating: 4.8, reviewsCount: 980, flowerTypesIncluded: ['Тюльпаны'], storeIds: ['s_kir'] },
  { id: 'f18', name: 'Роза красная поштучно', price: 250, imageUrls: ['https://picsum.photos/seed/rose_single/600/400'], description: 'Одна великолепная красная роза.', category: 'Цветы поштучно', storeIds: ['s_en'] },
  { id: 'f19', name: 'Букет из лаванды и хлопка (сухоцветы)', price: 2800, imageUrls: ['https://picsum.photos/seed/lavender_cotton_dry/600/400'], description: 'Долговечный букет из сухоцветов.', category: 'Букеты из сухоцветов', rating: 4.7, reviewsCount: 750, flowerTypesIncluded: ['Лаванда', 'Хлопок'], storeIds: ['s_en', 's_kir'] },
  { id: 'f20', name: 'Подарочный набор "Сладкоежка"', price: 4500, imageUrls: ['https://picsum.photos/seed/giftset_sweet/600/400'], description: 'Букет роз и коробка конфет.', category: 'Подарочные наборы', flowerTypesIncluded: ['Розы'], storeIds: ['s_en'] },
  { id: 'f21', name: 'Милый плюшевый мишка', price: 1500, imageUrls: ['https://picsum.photos/seed/teddy_bear/600/400'], description: 'Мягкий и очаровательный мишка.', category: 'Мягкие игрушки', storeIds: ['s_kir', 's_en'] },
  { id: 'f22', name: 'Открытка "С Днем Рождения!"', price: 150, imageUrls: ['https://picsum.photos/seed/birthday_card/600/400'], description: 'Красивая поздравительная открытка.', category: 'Открытки', storeIds: ['s_en', 's_kir'] },
  { id: 'f23', name: 'Фруктовый букет "Витаминный взрыв"', price: 3900, imageUrls: ['https://picsum.photos/seed/fruit_bouquet/600/400'], description: 'Яркий и полезный букет из свежих фруктов.', category: 'Съедобные букеты', rating: 4.9, reviewsCount: 1200, storeIds: ['s_en'] },
  { id: 'f24', name: 'Воздушные шары "Ассорти" (10 шт)', price: 1200, imageUrls: ['https://picsum.photos/seed/balloons_assorted/600/400'], description: 'Набор из 10 разноцветных гелиевых шаров.', category: 'Воздушные шары', storeIds: ['s_kir'] },
  { id: 'f25', name: 'Комнатное растение "Фикус Бенджамина"', price: 2200, imageUrls: ['https://picsum.photos/seed/ficus_plant/600/400'], description: 'Вечнозеленое растение для уюта в доме.', category: 'Комнатные растения', storeIds: ['s_en', 's_kir'] },
  { id: 'f26', name: 'Композиция "Орхидея в кашпо"', price: 3500, imageUrls: ['https://picsum.photos/seed/orchid_pot/600/400'], description: 'Изящная орхидея в керамическом кашпо.', category: 'Комнатные растения', isPopular: true, storeIds: ['s_en'] },
  { id: 'f27', name: 'Свадебный букет "Нежность"', price: 5500, imageUrls: ['https://picsum.photos/seed/wedding_tenderness/600/400'], description: 'Классический свадебный букет из белых роз и эустом.', category: 'Авторские букеты', occasionTags: ['Свадьба'], flowerTypesIncluded: ['Розы', 'Эустома'], storeIds: ['s_en', 's_kir'] },
  { id: 'f28', name: 'Цветы в коробке "Радуга"', price: 4200, imageUrls: ['https://picsum.photos/seed/box_rainbow/600/400'], description: 'Яркие разноцветные герберы в шляпной коробке.', category: 'Цветы в коробке', flowerTypesIncluded: ['Герберы'], storeIds: ['s_kir'] },
];


const giftOccasions = [
  { label: "До 2000 Р", icon: "🎁", filterValue: "price_under_2000" },
  { label: "Маме", icon: "👩‍👧", filterValue: "Маме" },
  { label: "Любимой девушке", icon: "❤️", filterValue: "Любимой девушке" },
  { label: "На день рождения", icon: "🎂", filterValue: "На день рождения" },
  { label: "Папе", icon: "👨‍👧", filterValue: "Папе" },
  { label: "Бабушке", icon: "👵", filterValue: "Бабушке" },
  { label: "Мужчине", icon: "👨", filterValue: "Мужчине" },
  { label: "Друзьям", icon: "🎉", filterValue: "Друзьям" },
  { label: "Свадьба", icon: "💍", filterValue: "Свадьба" },
];

const mainFiltersData = [ // Renamed from mainFilters to avoid conflict
  { label: "Цветы", options: ["Все", "Розы", "Пионы", "Тюльпаны", "Альстромерии", "Эустомы", "Авторские букеты", "Герберы", "Хризантемы"] },
  { label: "Цена", options: ["Любая", "до 2000 Р", "2000-4000 Р", "от 4000 Р"] },
  { label: "Цветы в составе", options: ["Любые", "Розы", "Пионы", "Эвкалипт", "Гортензия", "Альстромерии", "Ромашки", "Лаванда", "Тюльпаны", "Герберы", "Хризантемы", "Хлопок"] },
];

const staticFiltersData = [ // Renamed from staticFilters
    {label: "Уже собран", filterKey: "isReadyMade"},
    {label: "★ Рейтинг 4.5+", filterKey: "rating"}, 
    {label: "Доставка до 90 минут", filterKey: "fastDelivery"}
];

const sortOptions = [
  { label: "Популярные", value: "popular" },
  { label: "Сначала дешевле", value: "price_asc" },
  { label: "Сначала дороже", value: "price_desc" },
  { label: "По рейтингу", value: "rating_desc"}
];

const subCategories = [
    { name: "Монобукеты", icon: "https://picsum.photos/seed/cat_mono/80/80", filterValue: "Монобукеты" },
    { name: "Авторские", icon: "https://picsum.photos/seed/cat_author/80/80", filterValue: "Авторские букеты" },
    { name: "В коробке", icon: "https://picsum.photos/seed/cat_box/80/80", filterValue: "Цветы в коробке" },
    { name: "В корзине", icon: "https://picsum.photos/seed/cat_basket/80/80", filterValue: "Цветы в корзине" },
    { name: "Поштучно", icon: "https://picsum.photos/seed/cat_single_flower/80/80", filterValue: "Цветы поштучно" },
    { name: "Сухоцветы", icon: "https://picsum.photos/seed/cat_dry/80/80", filterValue: "Букеты из сухоцветов" },
    { name: "Наборы", icon: "https://picsum.photos/seed/cat_giftset/80/80", filterValue: "Подарочные наборы" },
    // These were in 'otherSubCategories', merging for mobile scrollable list
    { name: "Игрушки", icon: "https://picsum.photos/seed/cat_toys_sidebar/80/80", filterValue: "Мягкие игрушки" },
    { name: "Открытки", icon: "https://picsum.photos/seed/cat_cards_sidebar/80/80", filterValue: "Открытки" },
    { name: "Съедобные", icon: "https://picsum.photos/seed/cat_edible/80/80", filterValue: "Съедобные букеты" },
    { name: "Шары", icon: "https://picsum.photos/seed/cat_balloons_sidebar/80/80", filterValue: "Воздушные шары" },
    { name: "Растения", icon: "https://picsum.photos/seed/cat_plants_sidebar/80/80", filterValue: "Комнатные растения" },
];
// Desktop specific category lists
const desktopSubCategories = subCategories.slice(0,7);
const desktopOtherSubCategories = subCategories.slice(7);


interface ProductCardProps {
  product: FlowerProduct;
  addToCart: (product: FlowerProduct, quantity?: number) => void;
  setNotification: (message: string | null) => void;
  className?: string; // Prop for GSAP hook
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, setNotification, className }) => {
  // Animation logic is now removed from here and controlled by the parent component.
  const [isBuyButtonHoveredDesktop, setIsBuyButtonHoveredDesktop] = useState(false);
  
  const reviewsText = product.reviewsCount ? 
    (product.reviewsCount >= 1000 ? `${(product.reviewsCount / 1000).toFixed(1)} тыс.` : product.reviewsCount.toString()) 
    : '';

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product, 1);
    setNotification(`${product.name} добавлен в корзину!`);
  };

  return (
    <div className={`bg-ui-surface rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col group relative overflow-hidden ${className}`}>
      <Link to={`/flowers/${product.id}`} className="block">
        <div className="aspect-square md:aspect-[4/3] overflow-hidden relative">
          <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
          <button 
            className="absolute top-2 right-2 p-1.5 bg-white/70 backdrop-blur-sm rounded-full text-red-500 hover:text-red-600 hover:bg-white transition-colors duration-200 z-10"
            aria-label="Добавить в избранное"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* Implement like action */ }}
          >
            <HeartIcon className="w-5 h-5"/>
          </button>
        </div>
      </Link>
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <h3 className="text-xs md:text-sm font-medium text-content-primary mb-1 md:mb-1.5 line-clamp-2 leading-tight h-8 md:h-10">
          <Link to={`/flowers/${product.id}`} className="hover:text-brand-DEFAULT transition-colors">{product.name}</Link>
        </h3>
        
        <div className="flex items-center text-[10px] md:text-xs text-content-secondary mt-auto mb-1 md:mb-1.5">
            {product.rating && (
              <>
                <StarIcon className="text-amber-400 mr-0.5 md:mr-1 w-3 h-3 md:w-4 md:h-4"/> 
                <span className="font-medium">{product.rating.toFixed(1)}</span>
                {reviewsText && <span className="mx-1">• {reviewsText}</span>}
              </>
            )}
        </div>
        
        {/* Desktop Price & Button */}
        <div className="hidden md:flex items-center justify-between mt-auto">
          <div>
             <p className="text-lg font-semibold text-content-primary">{product.price.toLocaleString()}&nbsp;Р</p>
            {product.originalPrice && (
                <span className="text-xs text-content-subtle line-through">{product.originalPrice.toLocaleString()}&nbsp;Р</span>
            )}
          </div>
          <button
            onClick={handleBuyClick}
            onMouseEnter={() => setIsBuyButtonHoveredDesktop(true)}
            onMouseLeave={() => setIsBuyButtonHoveredDesktop(false)}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out min-w-[90px] text-center
                        ${isBuyButtonHoveredDesktop ? 'bg-content-primary text-white shadow-md' : 'bg-slate-100 text-content-primary hover:bg-slate-200'}`}
            aria-label={isBuyButtonHoveredDesktop ? `Купить ${product.name}` : `Купить ${product.name} за ${product.price.toLocaleString()} рублей`}
          >
            {isBuyButtonHoveredDesktop ? 'Купить' : `${product.price.toLocaleString()} Р`}
          </button>
        </div>

        {/* Mobile Price & Button */}
        <div className="md:hidden mt-auto">
            <div className="flex items-baseline mb-2">
                <p className="text-sm font-semibold text-content-primary">{product.price.toLocaleString()}&nbsp;Р</p>
                {product.originalPrice && (
                    <p className="text-[10px] text-content-subtle line-through ml-1.5">{product.originalPrice.toLocaleString()}&nbsp;Р</p>
                )}
            </div>
            <Button
                onClick={handleBuyClick}
                variant="secondary" 
                size="sm"
                fullWidth
                className="!text-sm !font-semibold !py-2 !bg-slate-100 hover:!bg-slate-200 !text-content-primary"
                aria-label={`Купить ${product.name} за ${product.price.toLocaleString()} рублей`}
            >
                {product.price.toLocaleString()}&nbsp;Р
            </Button>
        </div>
      </div>
    </div>
  );
};

const StoreCard: React.FC<{ store: Store; onSelectStore: (storeId: string) => void; isSelected?: boolean; }> = ({ store, onSelectStore, isSelected }) => {
    // Animation logic is now removed from here.
    return (
        <div 
          className={`store-card-hook bg-ui-surface rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col group ${isSelected ? 'ring-2 ring-brand-DEFAULT shadow-card-hover' : ''}`}
        >
            <img src={store.imageUrl || 'https://picsum.photos/seed/default_store/600/400'} alt={store.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"/>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-content-primary mb-1 group-hover:text-brand-DEFAULT transition-colors">{store.name}</h3>
                <p className="text-xs text-content-secondary">{store.city}</p>
                <p className="text-xs text-content-secondary mb-2">{store.address}</p>
                {store.operatingHours && <p className="text-xs text-content-subtle mb-3">Часы работы: {store.operatingHours}</p>}
                <Button 
                    onClick={() => onSelectStore(store.id)} 
                    variant={isSelected ? "glass-active" : "glass"} 
                    size="sm" 
                    fullWidth 
                    className="mt-auto"
                >
                    {isSelected ? 'Товары этого магазина' : 'Смотреть товары'}
                </Button>
            </div>
        </div>
    );
};


// Main Flowers Component
export const Flowers: React.FC = () => {
  const { addToCart } = useShoppingCart();
  const [notification, setNotification] = useState<string | null>(null);
  
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null); // For desktop "Ищу Подарок"
  const [activeMainFilters, setActiveMainFilters] = useState<{[key:string]: string}>({});
  const [activeStaticFilters, setActiveStaticFilters] = useState<{[key:string]: boolean}>({});
  const [currentSortBy, setCurrentSortBy] = useState<string>("popular");
  const [currentSubCategory, setCurrentSubCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'shops'>('all'); // For desktop sidebar
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const [mobileFilterModalOpen, setMobileFilterModalOpen] = useState(false);
  const [currentMobileFilterType, setCurrentMobileFilterType] = useState<'sort' | 'price' | 'composition' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const mapPlaceholderRef = useRef<HTMLDivElement>(null); 
  const mobileFiltersRef = useRef<HTMLDivElement>(null);
  const giftSectionRef = useRef<HTMLElement>(null);
  const mainFiltersRef = useRef<HTMLElement>(null);
  const desktopSidebarRef = useRef<HTMLDivElement>(null);

  const selectedStore = useMemo(() => storesData.find(s => s.id === selectedStoreId), [selectedStoreId]);

  const filteredProducts = useMemo(() => {
    let products = [...flowerProductsData];

    if (selectedStoreId) {
        products = products.filter(p => p.storeIds?.includes(selectedStoreId));
    }

    if (selectedOccasion && selectedOccasion !== "price_under_2000") { // Desktop "Ищу Подарок"
        products = products.filter(p => p.occasionTags?.includes(selectedOccasion));
    } else if (selectedOccasion === "price_under_2000") {
        products = products.filter(p => p.price < 2000);
    }
    
    if(activeMainFilters["Цветы"] && activeMainFilters["Цветы"] !== "Все") {
        const filterValue = activeMainFilters["Цветы"];
        products = products.filter(p => p.category === filterValue || p.flowerTypesIncluded?.includes(filterValue) || p.name.includes(filterValue));
    }
    if(activeMainFilters["Цена"] && activeMainFilters["Цена"] !== "Любая") {
        if(activeMainFilters["Цена"] === "до 2000 Р") products = products.filter(p => p.price < 2000);
        else if(activeMainFilters["Цена"] === "2000-4000 Р") products = products.filter(p => p.price >= 2000 && p.price <= 4000);
        else if(activeMainFilters["Цена"] === "от 4000 Р") products = products.filter(p => p.price > 4000);
    }
     if(activeMainFilters["Цветы в составе"] && activeMainFilters["Цветы в составе"] !== "Любые") {
        products = products.filter(p => p.flowerTypesIncluded?.includes(activeMainFilters["Цветы в составе"]));
    }

    if(activeStaticFilters["isReadyMade"]) products = products.filter(p => p.isReadyMade);
    if(activeStaticFilters["fastDelivery"]) products = products.filter(p => p.deliveryTime && p.deliveryTime <= 90);
    if(activeStaticFilters["rating"]) products = products.filter(p => p.rating && p.rating >= 4.5); // Adjusted to match label

    if(currentSubCategory) {
      products = products.filter(p => p.category === currentSubCategory);
    }
    
    // Sorting
    if(currentSortBy === "price_asc") products.sort((a,b) => a.price - b.price);
    else if(currentSortBy === "price_desc") products.sort((a,b) => b.price - a.price);
    else if(currentSortBy === "rating_desc") products.sort((a,b) => (b.rating || 0) - (a.rating || 0));
    else if(currentSortBy === "popular") products.sort((a,b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || (b.reviewsCount || 0) - (a.reviewsCount || 0));

    return products;
  }, [selectedOccasion, activeMainFilters, activeStaticFilters, currentSortBy, currentSubCategory, selectedStoreId]);

  // Centralized animation logic
  useEffect(() => {
    const context = gsap.context(() => {
        const header = headerRef.current;
        const giftSection = giftSectionRef.current;
        const mainFilters = mainFiltersRef.current;
        const desktopSidebar = desktopSidebarRef.current;
        const mobileFilters = mobileFiltersRef.current;

        const tl = gsap.timeline({
            defaults: { ease: 'power3.out', duration: 0.6 },
            delay: 0.1
        });
        
        gsap.set([header, giftSection, mainFilters, desktopSidebar, mobileFilters], { autoAlpha: 0, y: 20 });
        
        if(header) tl.to(header, { autoAlpha: 1, y: 0 });
        
        // Animate desktop OR mobile elements based on initial visibility
        if (window.innerWidth >= 768) { // md breakpoint
            if (giftSection && mainFilters && desktopSidebar) {
                tl.to([giftSection, mainFilters, desktopSidebar], { autoAlpha: 1, y: 0, stagger: 0.1 }, "-=0.4");
            }
        } else {
            if (mobileFilters) {
                tl.to(mobileFilters, { autoAlpha: 1, y: 0 }, "-=0.4");
            }
        }

    }, containerRef);

    return () => context.revert();
  }, []);

  // Grid animation (on initial load and filter changes)
  useEffect(() => {
    const grid = productGridRef.current;
    if (grid && activeTab === 'all') {
      const cards = gsap.utils.toArray('.product-card-hook', grid);
      gsap.fromTo(cards, 
        { autoAlpha: 0, y: 30, scale: 0.98 },
        { 
          autoAlpha: 1, y: 0, scale: 1,
          stagger: 0.08, duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        }
      );
    }
  }, [filteredProducts, activeTab]);

  // Store cards animation (when switching to shops tab)
  useEffect(() => {
      const sidebar = desktopSidebarRef.current;
      if (sidebar && activeTab === 'shops') {
          const cards = gsap.utils.toArray('.store-card-hook', sidebar);
           gsap.fromTo(cards, 
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out'}
            );
      }
  }, [activeTab]);


  useEffect(() => {
    if (notification && notificationRef.current) {
      gsap.fromTo(notificationRef.current, {opacity:0, y: -20, scale: 0.95}, {opacity:1, y:0, scale:1, duration:0.4, ease: 'back.out(1.7)'});
      const timer = setTimeout(() => {
        if(notificationRef.current) {
            gsap.to(notificationRef.current, {opacity:0, y: -20, scale:0.95, duration:0.4, ease: 'power2.in', onComplete: () => setNotification(null)});
        } else {
            setNotification(null);
        }
      }, 3600);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  const handleMainFilterChange = (filterLabel: string, value: string) => {
    setActiveMainFilters(prev => ({...prev, [filterLabel]: value}));
    setMobileFilterModalOpen(false); // Close modal on selection
  }

  const handleStaticFilterToggle = (filterKey: string) => {
    setActiveStaticFilters(prev => ({...prev, [filterKey]: !prev[filterKey]}));
    // No modal close here as it's part of sort modal or toggled directly on desktop
  }
  
  const handleSortChange = (value: string) => {
    setCurrentSortBy(value);
    setMobileFilterModalOpen(false); // Close modal on selection
  }

  const handleStoreSelect = (storeId: string) => { // For desktop sidebar
    setSelectedStoreId(storeId);
    setActiveTab('all'); 
  };

  const resetStoreFilter = () => {
    setSelectedStoreId(null);
  };
  
  useEffect(() => {
    if (activeTab === 'shops' && !selectedStoreId && mapPlaceholderRef.current) {
        gsap.fromTo(mapPlaceholderRef.current, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
        );
    }
  }, [activeTab, selectedStoreId]);

  const openMobileFilterModal = (type: 'sort' | 'price' | 'composition') => {
    setCurrentMobileFilterType(type);
    setMobileFilterModalOpen(true);
  };

  const getMobileFilterModalTitle = () => {
    if (currentMobileFilterType === 'sort') return "Сортировка и фильтры";
    if (currentMobileFilterType === 'price') return "Фильтр по цене";
    if (currentMobileFilterType === 'composition') return "Цветы в составе";
    return "Фильтры";
  };

  const renderMobileFilterModalContent = () => {
    if (currentMobileFilterType === 'sort') {
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-content-primary mb-2">Сортировать по:</h4>
          {sortOptions.map(opt => (
            <button key={opt.value} onClick={() => handleSortChange(opt.value)} 
                    className={`w-full text-left p-2.5 rounded-lg text-sm transition-colors ${currentSortBy === opt.value ? 'bg-brand-light text-brand-dark' : 'hover:bg-ui-background'}`}>
              {opt.label}
            </button>
          ))}
          <h4 className="text-sm font-semibold text-content-primary pt-3 mt-3 border-t border-ui-border mb-2">Дополнительно:</h4>
          {staticFiltersData.map(sFilter => (
             <label key={sFilter.filterKey} className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-ui-background cursor-pointer">
                <input type="checkbox" checked={!!activeStaticFilters[sFilter.filterKey]} onChange={() => handleStaticFilterToggle(sFilter.filterKey)} className="h-4 w-4 text-brand-DEFAULT rounded border-gray-300 focus:ring-brand-DEFAULT"/>
                <span className="text-sm text-content-primary">{sFilter.label.includes("Рейтинг") && <StarIcon className="inline w-4 h-4 mr-1 text-amber-400"/>}{sFilter.label}</span>
             </label>
          ))}
        </div>
      );
    }
    if (currentMobileFilterType === 'price') {
      return mainFiltersData.find(f => f.label === "Цена")?.options.map(opt => (
        <button key={opt} onClick={() => handleMainFilterChange("Цена", opt)}
                className={`w-full text-left p-2.5 rounded-lg text-sm transition-colors ${activeMainFilters["Цена"] === opt || (!activeMainFilters["Цена"] && opt === "Любая") ? 'bg-brand-light text-brand-dark' : 'hover:bg-ui-background'}`}>
          {opt}
        </button>
      ));
    }
    if (currentMobileFilterType === 'composition') {
      return mainFiltersData.find(f => f.label === "Цветы в составе")?.options.map(opt => (
        <button key={opt} onClick={() => handleMainFilterChange("Цветы в составе", opt)}
                className={`w-full text-left p-2.5 rounded-lg text-sm transition-colors ${activeMainFilters["Цветы в составе"] === opt || (!activeMainFilters["Цветы в составе"] && opt === "Любые") ? 'bg-brand-light text-brand-dark' : 'hover:bg-ui-background'}`}>
          {opt}
        </button>
      ));
    }
    return null;
  };


  return (
    <div ref={containerRef} className="space-y-6 md:space-y-8">
      <header ref={headerRef} className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-brand-DEFAULT mb-2 tracking-tight">Магазин Цветов</h2>
        <p className="text-lg text-content-secondary max-w-xl mx-auto">Изысканные букеты и композиции для любого повода.</p>
      </header>

      {notification && (
        <div ref={notificationRef} className={`p-4 rounded-xl shadow-md text-center sticky top-20 z-30 ${notification.includes('успешно') || notification.includes('добавлен') ? 'bg-brand-light text-brand-dark' : 'bg-red-100 text-red-700'}`} style={{opacity:0}}>
          {notification}
        </div>
      )}
      
      {/* --- START MOBILE FILTERS --- */}
      <div ref={mobileFiltersRef} className="md:hidden space-y-3 sticky top-[60px] md:top-[68px] bg-ui-background py-2 z-20 -mx-4 px-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
            <button onClick={() => openMobileFilterModal('sort')} className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 text-xs font-medium text-content-secondary hover:text-brand-DEFAULT bg-white rounded-lg border border-ui-border shadow-sm">
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                <span>Фильтры</span>
                <ChevronDownIcon className="w-3 h-3"/>
            </button>
            <button onClick={() => openMobileFilterModal('price')} className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 text-xs font-medium text-content-secondary hover:text-brand-DEFAULT bg-white rounded-lg border border-ui-border shadow-sm">
                <TagIcon className="w-4 h-4" />
                <span>Цена</span>
                <ChevronDownIcon className="w-3 h-3"/>
            </button>
            <button onClick={() => openMobileFilterModal('composition')} className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 text-xs font-medium text-content-secondary hover:text-brand-DEFAULT bg-white rounded-lg border border-ui-border shadow-sm">
                <SparklesIcon className="w-4 h-4" />
                <span>Состав</span>
                <ChevronDownIcon className="w-3 h-3"/>
            </button>
        </div>
        <div className="flex overflow-x-auto gap-3 py-2 scrollbar-hide">
          {subCategories.map(cat => (
            <button 
                key={cat.filterValue}
                onClick={() => setCurrentSubCategory(currentSubCategory === cat.filterValue ? null : cat.filterValue)}
                className={`flex flex-col items-center w-[70px] flex-shrink-0 group pb-1 transition-all duration-200
                            ${currentSubCategory === cat.filterValue ? 'border-b-2 border-brand-DEFAULT' : 'hover:opacity-80'}`}
                aria-pressed={currentSubCategory === cat.filterValue}
            >
                <img src={cat.icon} alt={cat.name} className={`w-12 h-12 rounded-full object-cover border-2 transition-all duration-200 ${currentSubCategory === cat.filterValue ? 'border-brand-DEFAULT shadow-md' : 'border-ui-border group-hover:border-brand-light'}`}/>
                <span className={`text-[10px] mt-1.5 font-medium leading-tight text-center ${currentSubCategory === cat.filterValue ? 'text-brand-DEFAULT' : 'text-content-primary group-hover:text-brand-DEFAULT'}`}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* --- END MOBILE FILTERS --- */}

      {/* "Ищу подарок" Section - Desktop Only */}
      <section ref={giftSectionRef} className="hidden md:block bg-ui-surface p-4 sm:p-6 rounded-2xl shadow-card">
        <h3 className="text-lg font-semibold text-content-primary mb-4">Ищу подарок</h3>
        <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
          <div className="flex space-x-3 py-1">
            {giftOccasions.map(occasion => (
              <button
                key={occasion.label}
                onClick={() => setSelectedOccasion(selectedOccasion === occasion.filterValue ? null : occasion.filterValue)}
                className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-full flex items-center transition-all duration-200 ease-in-out border
                            ${selectedOccasion === occasion.filterValue
                                ? 'bg-ui-surface border-content-primary shadow-sm'
                                : 'bg-slate-100 border-transparent hover:border-slate-300'
                            }`}
              >
                <span className="mr-2 text-base">{occasion.icon}</span>
                <span className="whitespace-nowrap">{occasion.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Filters Row - Desktop Only */}
      <section ref={mainFiltersRef} className="hidden md:flex bg-ui-surface p-4 sm:p-6 rounded-2xl shadow-card">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            {mainFiltersData.map(filter => (
                <div key={filter.label} className="relative">
                    <select 
                        onChange={(e) => handleMainFilterChange(filter.label, e.target.value)}
                        value={activeMainFilters[filter.label] || ""}
                        className="appearance-none bg-ui-background hover:bg-brand-light/50 border border-ui-border hover:border-brand-DEFAULT/50 text-content-primary text-sm font-medium rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-DEFAULT transition-colors duration-150"
                    >
                        <option value="" disabled hidden>{filter.label}</option>
                        {filter.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-content-subtle"/>
                </div>
            ))}
            {staticFiltersData.map(sFilter => (
                 <Button 
                    key={sFilter.label}
                    onClick={() => handleStaticFilterToggle(sFilter.filterKey)}
                    variant={activeStaticFilters[sFilter.filterKey] ? 'glass-active' : 'glass'}
                    size="sm"
                    className="!px-3 !py-2 text-sm"
                 >
                    {sFilter.label.includes("Рейтинг") && <StarIcon className="mr-1.5 text-amber-400"/>}
                    {sFilter.label}
                 </Button>
            ))}
            <div className="relative ml-auto">
                 <select 
                    onChange={(e) => setCurrentSortBy(e.target.value)}
                    value={currentSortBy}
                    className="appearance-none bg-ui-background hover:bg-brand-light/50 border border-ui-border hover:border-brand-DEFAULT/50 text-content-primary text-sm font-medium rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-DEFAULT transition-colors duration-150"
                >
                    {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <SortIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-content-subtle"/>
            </div>
        </div>
      </section>

      {selectedStoreId && activeTab === 'all' && (
        <div className="bg-brand-light text-brand-dark p-3 rounded-xl shadow-sm flex items-center justify-between">
            <p className="text-sm font-medium">
                Вы смотрите товары из магазина: <strong className="underline">{selectedStore?.name}</strong> ({selectedStore?.city})
            </p>
            <Button onClick={resetStoreFilter} variant="ghost" size="sm" className="!text-brand-dark hover:!bg-brand-DEFAULT/20 !px-2 !py-1">
                Сбросить фильтр магазина
            </Button>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Left Sidebar for Sub-categories and Stores - Desktop Only */}
        <aside ref={desktopSidebarRef} className="hidden md:block w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="bg-ui-surface p-4 sm:p-5 rounded-2xl shadow-card space-y-3">
                <div className="flex border-b border-ui-border mb-3">
                    {([['all', 'Все товары'], ['shops', 'Магазины']] as const).map(([tabKey, tabLabel]) => (
                         <button 
                            key={tabKey}
                            onClick={() => {
                                setActiveTab(tabKey);
                                if (tabKey === 'shops') { setSelectedStoreId(null); }
                            }}
                            className={`flex-1 py-2.5 text-sm font-medium transition-colors duration-200
                                        ${activeTab === tabKey ? 'border-b-2 border-brand-DEFAULT text-brand-DEFAULT' : 'text-content-secondary hover:text-content-primary'}`}
                         >
                            {tabLabel}
                         </button>
                    ))}
                </div>
                {activeTab === 'all' && (
                    <>
                        {desktopSubCategories.map(cat => (
                            <button 
                                key={cat.name}
                                onClick={() => setCurrentSubCategory(currentSubCategory === cat.filterValue ? null : cat.filterValue)}
                                className={`w-full flex items-center p-2.5 rounded-lg text-sm transition-all duration-200 ease-in-out group
                                            ${currentSubCategory === cat.filterValue ? 'bg-brand-light text-brand-dark shadow-sm' : 'hover:bg-ui-background hover:shadow-sm'}`}
                            >
                                <img src={cat.icon} alt="" className="w-6 h-6 rounded-md mr-3 object-cover"/>
                                <span className="font-medium group-hover:text-brand-DEFAULT">{cat.name}</span>
                            </button>
                        ))}
                        <h4 className="text-xs font-semibold text-content-subtle pt-3 border-t border-ui-border mt-3">ДРУГИЕ КАТЕГОРИИ</h4>
                        {desktopOtherSubCategories.map(cat => (
                             <button 
                                key={cat.name}
                                onClick={() => setCurrentSubCategory(currentSubCategory === cat.filterValue ? null : cat.filterValue)}
                                className={`w-full flex items-center p-2.5 rounded-lg text-sm transition-all duration-200 ease-in-out group
                                            ${currentSubCategory === cat.filterValue ? 'bg-brand-light text-brand-dark shadow-sm' : 'hover:bg-ui-background hover:shadow-sm'}`}
                            >
                                <img src={cat.icon} alt="" className="w-6 h-6 rounded-md mr-3 object-cover"/>
                                <span className="font-medium group-hover:text-brand-DEFAULT">{cat.name}</span>
                            </button>
                        ))}
                    </>
                )}
                {activeTab === 'shops' && (
                    <div className="space-y-4">
                        <p className="text-sm text-content-secondary px-1 pb-1 border-b border-ui-border">Выберите магазин, чтобы посмотреть его ассортимент.</p>
                        {storesData.map(store => (
                            <StoreCard 
                                key={store.id} 
                                store={store} 
                                onSelectStore={handleStoreSelect} 
                                isSelected={false} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </aside>

        <main className="flex-1 min-w-0">
          {activeTab === 'all' && filteredProducts.length > 0 && (
              <div ref={productGridRef} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-5">
              {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    addToCart={addToCart}
                    setNotification={setNotification}
                    className="product-card-hook"
                  />
              ))}
              </div>
          )}
          {activeTab === 'all' && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 bg-ui-surface rounded-2xl shadow-card p-8 text-center">
                  <FilterIcon className="w-16 h-16 text-content-subtle mb-4"/>
                  <p className="text-xl font-semibold text-content-primary">Товары не найдены</p>
                  <p className="text-content-secondary mt-1">Попробуйте изменить критерии фильтрации {selectedStoreId ? "или выберите другой магазин" : ""}.</p>
                   {selectedStoreId && 
                    <Button onClick={resetStoreFilter} variant="outline" size="sm" className="mt-4">
                        Показать товары всех магазинов
                    </Button>
                   }
              </div>
          )}
          {activeTab === 'shops' && !selectedStoreId && ( // Desktop "Shops" tab view
            <div ref={mapPlaceholderRef} className="flex flex-col items-center justify-center h-96 bg-ui-surface rounded-2xl shadow-card p-8 text-center">
                <MapPinIcon className="w-20 h-20 text-brand-DEFAULT mb-6 opacity-70" />
                <h3 className="text-2xl font-semibold text-content-primary mb-2">Карта магазинов</h3>
                <p className="text-content-secondary max-w-xs mx-auto">
                    Скоро здесь появится интерактивная карта с расположением наших цветочных магазинов. Вы сможете легко найти ближайший к вам!
                </p>
            </div>
          )}
        </main>
      </div>

      {mobileFilterModalOpen && (
        <Modal isOpen={mobileFilterModalOpen} onClose={() => setMobileFilterModalOpen(false)} title={getMobileFilterModalTitle()}>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto p-1">
                {renderMobileFilterModalContent()}
            </div>
             <Button onClick={() => setMobileFilterModalOpen(false)} variant="glass" fullWidth className="mt-4">Закрыть</Button>
        </Modal>
      )}

    </div>
  );
};
