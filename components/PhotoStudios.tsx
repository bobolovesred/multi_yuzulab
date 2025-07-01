import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Studio } from '../types';
import { City } from '../types';
import { Button } from './common/Button';
import { gsap } from 'gsap';

const studiosData: Studio[] = [
  { 
    id: 's1', 
    name: 'Лофт Студия "Атмосфера"', 
    city: City.ENAKIEVO, 
    description: 'Просторная студия с естественным светом и разнообразными фонами для самых смелых идей.', 
    detailedDescription: 'Лофт Студия "Атмосфера" – это 120 кв.м. творческого пространства с высокими потолками (4.5м) и большими окнами, обеспечивающими превосходное естественное освещение. Несколько фактурных стен (кирпич, бетон, дерево), бумажные и тканевые фоны. Идеально для портретной, семейной и коммерческой съемки.',
    hourlyRate: 1500, 
    imageUrls: ['/images/photostudio/enakievo/1.webp'],
    amenities: ['Естественный свет', 'Профессиональные вспышки', 'Бумажные фоны', 'Тканевые фоны', 'Гримерка', 'Wi-Fi', 'Чай/кофе']
  },
  { 
    id: 's2', 
    name: 'Арт-пространство "Креатив"', 
    city: City.KIROVSKOE, 
    description: 'Современное оборудование, белоснежная циклорама и цветные фильтры для фэшн-съемок.', 
    detailedDescription: 'Арт-пространство "Креатив" предлагает белую циклораму (5x4м), комплект импульсного света Godox, разнообразные насадки и цветные гелевые фильтры. Подходит для фэшн-съемок, каталогов, видео и творческих проектов. Есть отдельная зона для макияжа и переодевания.',
    hourlyRate: 1200, 
    imageUrls: ['/images/photostudio/kirovskoe/1.webp'],
    amenities: ['Циклорама', 'Импульсный свет', 'Софтбоксы/Октобоксы', 'Цветные фильтры', 'Кондиционер', 'Музыкальная система']
  },
  { 
    id: 's3', 
    name: 'Фотостудия "Уют"', 
    city: City.SHAKHTERSK, 
    description: 'Создана для самых теплых и душевных семейных и детских фотосессий.', 
    detailedDescription: 'Фотостудия "Уют" создана для самых теплых и душевных съемок. Мягкий свет, разнообразный реквизит для детей (игрушки, пледы, корзинки), несколько уютных фотозон с диванчиками и креслами. Комфортная атмосфера для малышей и их родителей.',
    hourlyRate: 1000, 
    imageUrls: ['/images/photostudio/shahtersk/1.webp'],
    amenities: ['Детский реквизит', 'Мягкие игрушки', 'Несколько фотозон', 'Теплый пол', 'Пеленальный столик']
  },
  { 
    id: 's4', 
    name: 'Студия "Панорама"', 
    city: City.ENAKIEVO, 
    description: 'Большие окна, панорамный вид на город и профессиональный постоянный свет.', 
    detailedDescription: 'Студия "Панорама" впечатляет своими огромными окнами от пола до потолка, открывающими захватывающий вид на город. Обилие естественного света дополняется профессиональным студийным оборудованием. Отличное место для имиджевых съемок и мероприятий.',
    hourlyRate: 1800, 
    imageUrls: ['/images/photostudio/enakievo/2.webp'],
    amenities: ['Панорамные окна', 'Вид на город', 'Постоянный свет', 'Отражатели', 'Вентилятор', 'Просторная гримерка']
  },
];

const StudioListItem: React.FC<{ studio: Studio }> = ({ studio }) => {
  const rootRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    // Isolate GSAP animations to this component instance
    const ctx = gsap.context(() => {
      const imageWrapper = rootEl.querySelector('.g-image-wrapper');
      const image = rootEl.querySelector('.g-image');
      const textElements = rootEl.querySelectorAll('.g-text-reveal');
      
      gsap.set(rootEl, { autoAlpha: 0 }); // Hide initially, use autoAlpha for performance
      gsap.set(imageWrapper, { clipPath: 'inset(0% 100% 0% 0%)' }); // Reveal from left
      gsap.set(image, { scale: 1.1 });
      gsap.set(textElements, { autoAlpha: 0, y: 20 });
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const tl = gsap.timeline({ defaults: { duration: 0.9, ease: 'power3.out' } });
              tl.to(rootEl, { autoAlpha: 1, duration: 0.3 })
                .to(imageWrapper, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }, 0)
                .to(image, { scale: 1, duration: 1.4, ease: 'power2.out' }, 0)
                .to(textElements, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.7 }, 0.4);
              observer.unobserve(rootEl);
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(rootEl);

      // Hover animation
      const arrowIcon = rootEl.querySelector('.g-arrow-icon');
      const onMouseEnter = () => {
        gsap.to(image, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
        if (arrowIcon) gsap.to(arrowIcon, { x: 4, duration: 0.3, ease: 'power2.out' });
      };
      const onMouseLeave = () => {
        gsap.to(image, { scale: 1, duration: 0.4, ease: 'power2.out' });
        if (arrowIcon) gsap.to(arrowIcon, { x: 0, duration: 0.3, ease: 'power2.out' });
      };
      rootEl.addEventListener('mouseenter', onMouseEnter);
      rootEl.addEventListener('mouseleave', onMouseLeave);

    }, rootRef); // Scoping to the root element

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  const featureTags = [studio.city, ...studio.amenities.slice(0, 2)];

  return (
    <Link 
      ref={rootRef}
      to={`/photo-studios/${studio.id}`} 
      className="studio-list-item group block"
      style={{ opacity: 0 }} // Initially hidden for GSAP
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
        <div className="md:col-span-7 g-image-wrapper rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] shadow-lg">
          <img src={studio.imageUrls[0]} alt={studio.name} className="g-image w-full h-full object-cover"/>
        </div>
        <div className="md:col-span-5 flex flex-col justify-center py-4">
          <div className="g-text-reveal flex flex-wrap gap-2 mb-4">
            {featureTags.map(tag => (
              <span key={tag} className="text-xs font-semibold bg-brand-light text-brand-dark px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <h3 className="g-text-reveal text-4xl xl:text-5xl font-bold text-content-primary leading-tight mb-4 tracking-tighter">{studio.name}</h3>
          <p className="g-text-reveal text-base text-content-secondary mb-8 line-clamp-3">{studio.description}</p>
          <div className="g-text-reveal flex justify-between items-center mt-auto">
            <p className="text-3xl font-semibold text-content-primary">{studio.hourlyRate} <span className="text-lg text-content-secondary font-medium">руб/час</span></p>
            <div className="text-base font-semibold text-brand-DEFAULT inline-flex items-center group-hover:underline">
              Подробнее
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="g-arrow-icon w-5 h-5 ml-1.5 transition-transform duration-300">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};


export const PhotoStudios: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City | ''>('');
  const [displayedStudios, setDisplayedStudios] = useState<Studio[]>(studiosData);
  const [isHiding, setIsHiding] = useState(false);
  const [pendingCity, setPendingCity] = useState<City | ''>('');

  const listRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Animate header and filters on initial load
  useEffect(() => {
    const headerEl = headerRef.current;
    const filtersEl = filtersRef.current;
    if (headerEl && filtersEl) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(headerEl, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(filtersEl.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, "-=0.3");
    }
  }, []);

  // Новый useEffect для анимации скрытия карточек при смене фильтра
  useEffect(() => {
    if (pendingCity === ('' as City | '')) return;
    if (isInitialMount.current) return;
    const listEl = listRef.current;
    if (!listEl) return;
    const cards = Array.from(listEl.children);
    if (cards.length > 0) {
      setIsHiding(true);
      gsap.to(cards, {
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayedStudios((pendingCity as string) === '' ? studiosData : studiosData.filter(s => s.city === pendingCity));
          setSelectedCity(pendingCity);
          setPendingCity('');
          setIsHiding(false);
        },
      });
    } else {
      setDisplayedStudios((pendingCity as string) === '' ? studiosData : studiosData.filter(s => s.city === pendingCity));
      setSelectedCity(pendingCity);
      setPendingCity('');
      setIsHiding(false);
    }
  }, [pendingCity]);

  // Анимация появления новых карточек после смены фильтра
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isHiding) return;
    const listEl = listRef.current;
    if (!listEl) return;
    const cards = Array.from(listEl.children);
    if (cards.length > 0) {
      gsap.fromTo(cards, {
        opacity: 0,
        y: 20,
        scale: 0.98,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });
    }
  }, [displayedStudios, isHiding]);
  
  const cityOptions = [
    { value: '', label: 'Все города' },
    { value: City.ENAKIEVO, label: City.ENAKIEVO },
    { value: City.KIROVSKOE, label: City.KIROVSKOE },
    { value: City.SHAKHTERSK, label: City.SHAKHTERSK },
  ];

  return (
    <div className="space-y-10 md:space-y-16">
      <header ref={headerRef} className="text-center" style={{ opacity: 0 }}>
        <h2 className="text-4xl sm:text-5xl font-bold text-brand-DEFAULT mb-3 tracking-tight">Наши Фотостудии</h2>
        <p className="text-lg text-content-secondary max-w-xl mx-auto">Выберите пространство для воплощения ваших творческих замыслов.</p>
      </header>
      
      <div ref={filtersRef} className="flex justify-center flex-wrap gap-3">
        {cityOptions.map(option => (
          <Button 
            key={option.value} 
            onClick={() => {
              if (option.value === selectedCity || isHiding || pendingCity) return;
              setPendingCity(option.value as City | '');
            }} 
            variant={selectedCity === option.value ? 'primary' : 'glass'}
            className="!rounded-full"
            size="md"
          >
            {option.label}
          </Button>
        ))}
      </div>
      
      <div ref={listRef} className="space-y-16 md:space-y-24">
        {displayedStudios.length > 0 ? (
          displayedStudios.map(studio => (
            <StudioListItem key={studio.id} studio={studio} />
          ))
        ) : (
          <div className="text-center text-content-secondary py-16">
            <h3 className="text-2xl font-semibold text-content-primary mb-2">Ничего не найдено</h3>
            <p>К сожалению, у нас нет студий в выбранном городе. Пожалуйста, выберите другой.</p>
          </div>
        )}
      </div>
    </div>
  );
};
