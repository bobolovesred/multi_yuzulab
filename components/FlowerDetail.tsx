import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { FlowerProduct } from '../types';
// This data would ideally come from a context or props, or fetched.
// For now, co-locating a copy or filtering from a global source.
// We'll simulate fetching by filtering from the full list.
// To avoid direct import from Flowers.tsx to prevent circular deps if Flowers.tsx imports this,
// let's define the data here or make it available via a shared service/context in a real app.
// For this mockup, we'll redefine a small data set or assume it's passed.
// For simplicity, let's just use a placeholder if data is not directly available.

// Placeholder data - in a real app, this would be fetched or from context
const FAKE_FLOWER_DATA_SOURCE: FlowerProduct[] = [
  { id: 'f1', name: 'Букет "Пионы 11 штук в крафте"', price: 4290, originalPrice: 5363, imageUrls: ['https://picsum.photos/seed/pionies_craft/800/600', 'https://picsum.photos/seed/pionies_craft_alt1/800/600'], description: 'Роскошные пионы в стильной крафтовой упаковке.', detailedDescription: '11 отборных пионов в крафтовой бумаге. Сезонный товар, уточняйте наличие.', category: 'Пионы', rating: 4.89, reviewsCount: 3540, flowerTypesIncluded: ['Пионы'], occasionTags: ['Любимой девушке', 'Маме'] },
  { id: 'f2', name: 'Букет "Воздушные Пионы"', price: 2990, originalPrice: 3738, imageUrls: ['https://picsum.photos/seed/air_pionies/800/600'], description: 'Нежные и ароматные пионы.', detailedDescription: 'Легкий и воздушный букет из свежих пионов.', category: 'Пионы', rating: 4.89, reviewsCount: 3540, flowerTypesIncluded: ['Пионы'], occasionTags: ['На день рождения'] },
  { id: 'f3', name: 'Пионы 11 штук', price: 4900, imageUrls: ['https://picsum.photos/seed/pionies_11/800/600', 'https://picsum.photos/seed/pionies_11_alt1/800/600'], description: 'Классический букет из 11 пионов.', detailedDescription: '11 крупных пионов, классический выбор.', category: 'Пионы', rating: 4.79, reviewsCount: 5100, flowerTypesIncluded: ['Пионы'], isPopular: true },
  { id: 'f7', name: 'Гортензия с пионовидными розами', price: 3496, originalPrice: 4600, imageUrls: ['https://picsum.photos/seed/hydrangea_roses/800/600'], description: 'Элегантное сочетание гортензии и роз.', detailedDescription: 'Гортензия и пионовидные розы в гармоничной композиции.', category: 'Смешанные букеты', rating: 4.90, reviewsCount: 2500, flowerTypesIncluded: ['Гортензия', 'Розы'], deliveryTime: 60, occasionTags: ['Маме'] },
  { id: 'f8', name: 'Пионы 9 штук', price: 3900, imageUrls: ['https://picsum.photos/seed/pionies_9/800/600'], description: 'Компактный букет из 9 пионов.', detailedDescription: '9 отборных пионов, прекрасный подарок.', category: 'Пионы', rating: 4.88, reviewsCount: 3200, flowerTypesIncluded: ['Пионы'], isReadyMade: true},
  { id: 'f9', name: 'Букет "Нежные летние альстромерии"', price: 2793, originalPrice: 3990, imageUrls: ['https://picsum.photos/seed/alstroemeria/800/600'], description: 'Яркие и стойкие альстромерии.', detailedDescription: 'Букет из альстромерий различных оттенков.', category: 'Альстромерии', rating: 4.81, reviewsCount: 2800, flowerTypesIncluded: ['Альстромерии'], deliveryTime: 90 },
  { id: 'f10', name: 'Букет из 5 эустом в крафте', price: 2999, originalPrice: 3588, imageUrls: ['https://picsum.photos/seed/eustoma_5/800/600'], description: 'Нежные эустомы в крафте.', detailedDescription: '5 веток эустомы в крафтовой упаковке.', category: 'Эустомы', rating: 4.85, reviewsCount: 2200, flowerTypesIncluded: ['Эустома'], occasionTags: ['Любимой девушке'] },
  { id: 'f11', name: 'Лавандовые сны', price: 3960, originalPrice: 4800, imageUrls: ['https://picsum.photos/seed/lavender_dreams/800/600'], description: 'Ароматный букет с лавандой.', detailedDescription: 'Букет с лавандой, розами и другими ароматными цветами.', category: 'Смешанные букеты', rating: 4.83, reviewsCount: 4400, flowerTypesIncluded: ['Лаванда', 'Розы'], isPopular: true },
  { id: 'f12', name: 'Букет с пионовидными розами', price: 3467, originalPrice: 4280, imageUrls: ['https://picsum.photos/seed/peony_roses_mix/800/600'], description: 'Роскошные пионовидные розы.', detailedDescription: 'Букет из пионовидных роз различных сортов.', category: 'Розы', rating: 4.83, reviewsCount: 5000, flowerTypesIncluded: ['Розы пионовидные'], occasionTags: ['Маме', 'Любимой девушке'] },
  { id: 'f13', name: 'Букет Лидия', price: 2490, originalPrice: 3113, imageUrls: ['https://picsum.photos/seed/lidia_bouquet/800/600'], description: 'Яркий и жизнерадостный букет.', detailedDescription: 'Яркий букет из гербер, хризантем и зелени.', category: 'Смешанные букеты', rating: 4.89, reviewsCount: 3540, flowerTypesIncluded: ['Герберы', 'Хризантемы'], isReadyMade: true, deliveryTime: 75 },
  { id: 'f14', name: 'Пионы Сара Бернар с эвкалиптом 11шт', price: 3480, originalPrice: 5800, imageUrls: ['https://picsum.photos/seed/sarah_bernardt/800/600'], description: 'Знаменитые пионы Сара Бернар.', detailedDescription: '11 пионов сорта Сара Бернар с ветками эвкалипта.', category: 'Пионы', rating: 4.93, reviewsCount: 9470, flowerTypesIncluded: ['Пионы', 'Эвкалипт'], isPopular: true, occasionTags: ['Любимой девушке', 'На день рождения'] },
  { id: 'f15', name: 'Букет французские розы и ромашка', price: 2996, originalPrice: 4280, imageUrls: ['https://picsum.photos/seed/french_roses_chamomile/800/600'], description: 'Классическое сочетание роз и ромашек.', detailedDescription: 'Букет из французских роз и полевых ромашек.', category: 'Смешанные букеты', rating: 4.97, reviewsCount: 2000, flowerTypesIncluded: ['Розы', 'Ромашки'], deliveryTime: 90 },
];


import { Button } from './common/Button';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { gsap } from 'gsap';

const FlowerDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useShoppingCart();
  const [product, setProduct] = useState<FlowerProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState<string | null>(null);
  
  const mainContentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Simulate fetching product details
    const foundProduct = FAKE_FLOWER_DATA_SOURCE.find(p => p.id === productId);
    setProduct(foundProduct || null);
  }, [productId]);

  useEffect(() => {
    if (product && mainContentRef.current && imagesRef.current && detailsRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }});
      tl.fromTo(mainContentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(imagesRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.1")
        .fromTo(detailsRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.5");
      
      // Animate images if multiple
      const imageElements = imagesRef.current.querySelectorAll('img');
      if (imageElements.length > 1) {
        gsap.fromTo(imageElements, 
            {opacity:0, y:20}, 
            {opacity:1, y:0, stagger:0.15, duration:0.4, delay:0.5, ease:'power2.out'}
        );
      }
    }
  }, [product]);

  useEffect(() => {
    if (notification && notificationRef.current) {
      gsap.fromTo(notificationRef.current, {opacity:0, y: -20}, {opacity:1, y:0, duration:0.4, ease: 'back.out(1.7)'});
      const timer = setTimeout(() => {
        if(notificationRef.current) {
            gsap.to(notificationRef.current, {opacity:0, y: -20, duration:0.4, ease: 'power2.in', onComplete: () => setNotification(null)});
        } else {
            setNotification(null);
        }
      }, 3600);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!product) {
    return <div className="text-center py-10 text-content-secondary">Товар не найден. Возможно, он был удален или ссылка неверна. <Link to="/flowers" className="text-brand-DEFAULT hover:underline">Вернуться в магазин</Link></div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setNotification(`${product.name} (x${quantity}) добавлен в корзину!`);
  };

  return (
    <div ref={mainContentRef} className="space-y-10 md:space-y-12" style={{opacity:0}}>
      <header className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-header">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-DEFAULT tracking-tight">{product.name}</h2>
            <Link to="/flowers" className="text-sm font-medium text-brand-DEFAULT hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.56l2.72 2.72a.75.75 0 11-1.06 1.06l-4-4a.75.75 0 010-1.06l4-4a.75.75 0 011.06 1.06L5.56 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                Все цветы
            </Link>
        </div>
        <p className="text-lg text-content-secondary mt-1">{product.category}</p>
      </header>

      {notification && (
        <div ref={notificationRef} className="p-4 bg-brand-light text-brand-dark rounded-xl shadow-md text-center sticky top-20 z-50" style={{opacity:0}}>
          {notification}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div ref={imagesRef} className="space-y-4" style={{opacity:0}}>
          {/* Basic image display, to be replaced by carousel */}
          {product.imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`${product.name} - изображение ${index + 1}`} className="w-full h-auto object-cover rounded-xl shadow-lg aspect-square md:aspect-[4/3]" />
          ))}
           {product.imageUrls.length === 0 && <div className="w-full h-auto bg-ui-border rounded-xl aspect-square flex items-center justify-center text-content-subtle">Нет изображений</div>}
        </div>

        <div ref={detailsRef} className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-card space-y-6" style={{opacity:0}}>
          <div>
            <h3 className="text-xl font-semibold text-content-primary mb-2">Описание</h3>
            <p className="text-content-secondary whitespace-pre-line leading-relaxed">{product.detailedDescription || product.description}</p>
          </div>
          
          <div className="border-t border-ui-border pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-brand-DEFAULT">{product.price.toLocaleString()} руб.</span>
                {product.originalPrice && (
                    <span className="ml-2 text-md text-content-subtle line-through">{product.originalPrice.toLocaleString()} руб.</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="quantity" className="text-sm font-medium text-content-primary">Кол-во:</label>
                <input 
                  type="number" 
                  id="quantity" 
                  value={quantity} 
                  min="1" 
                  max="10"
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))} 
                  className="w-16 p-2 border border-ui-border rounded-md text-center focus:ring-1 focus:ring-ui-ring focus:border-ui-ring"
                />
              </div>
            </div>
            <Button onClick={handleAddToCart} size="lg" fullWidth variant="glass-active">Добавить в корзину</Button>
          </div>

          <div className="border-t border-ui-border pt-6 space-y-3 text-sm">
            <h4 className="text-md font-semibold text-content-primary mb-1">Информация:</h4>
            {product.deliveryTime && <p><strong className="text-content-secondary">Доставка:</strong> В течение {product.deliveryTime} минут (симуляция).</p>}
            {!product.deliveryTime && <p><strong className="text-content-secondary">Доставка:</strong> Стандартная, 2-3 часа (симуляция).</p>}
            <p><strong className="text-content-secondary">Уход:</strong> Регулярно меняйте воду и подрезайте стебли (симуляция).</p>
            {product.flowerTypesIncluded && product.flowerTypesIncluded.length > 0 && 
                <p><strong className="text-content-secondary">Состав:</strong> {product.flowerTypesIncluded.join(', ')}.</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowerDetail;