import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PhotoBookFormat } from '../types';
import { Button } from './common/Button';
import { InputField } from './common/InputField';
import { gsap } from 'gsap';

// Swiper.js imports
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperCore } from 'swiper';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';

const formatsData: PhotoBookFormat[] = [
  { 
    id: 'pb1', 
    name: 'Классик 20x20 см', 
    price: 2500, 
    description: 'Идеально для семейных архивов и инстаграм-подборок.',
    imageUrl: 'https://storage.googleapis.com/proudcity_images/yuzulab/photobook_classic_sq.jpg',
    features: ['Твердая фотообложка', '20-40 страниц', 'Матовая бумага 170г/м²'],
    detailedFeatures: ['Высококачественная печать', 'Лайфлет-разворот (без разрыва посередине)', 'Индивидуальный дизайн обложки', 'Возможность добавления текста'],
    bestSuitedFor: ['Семейный альбом', 'Instagram-подборка', 'Подарок'],
    exampleGalleryImages: [
      'https://picsum.photos/seed/classic_ex1/300/200',
      'https://picsum.photos/seed/classic_ex2/300/200',
      'https://picsum.photos/seed/classic_ex3/300/200',
    ]
  },
  { 
    id: 'pb2', 
    name: 'Премиум 30x30 см', 
    price: 4500, 
    description: 'Роскошный вариант для свадеб и особых событий.',
    imageUrl: 'https://storage.googleapis.com/proudcity_images/yuzulab/photobook_premium_sq.jpg',
    features: ['Твердая обложка с тиснением', '30-80 страниц', 'Шелковая бумага 250г/м²'],
    detailedFeatures: ['Элегантное тиснение на выбор (золото, серебро)', 'Панорамный разворот на 180°', 'Усиленный книжный блок', 'Плотные страницы с шелковистой текстурой'],
    bestSuitedFor: ['Свадьба', 'Юбилей', 'Портфолио'],
    exampleGalleryImages: [
      'https://picsum.photos/seed/premium_ex1/300/200',
      'https://picsum.photos/seed/premium_ex2/300/200',
    ]
  },
  { 
    id: 'pb3', 
    name: 'Лайт 15x20 см (альбом)', 
    price: 1800, 
    description: 'Компактный и доступный, отлично для подарков.',
    imageUrl: 'https://storage.googleapis.com/proudcity_images/yuzulab/photobook_lite_rect.jpg',
    features: ['Мягкая фотообложка', '16-32 страницы', 'Глянцевая бумага 150г/м²'],
    detailedFeatures: ['Гибкая, но прочная обложка', 'Яркая печать на глянцевой бумаге', 'Легкий и удобный для переноски', 'Отличный вариант для детских фото'],
    bestSuitedFor: ['Подарок', 'Путешествие', 'Детский альбом'],
    exampleGalleryImages: [
      'https://picsum.photos/seed/lite_ex1/300/200',
      'https://picsum.photos/seed/lite_ex2/300/200',
      'https://picsum.photos/seed/lite_ex3/300/200',
      'https://picsum.photos/seed/lite_ex4/300/200',
    ]
  },
   { 
    id: 'pb4', 
    name: 'Инстабук 15x15 см', 
    price: 1500, 
    description: 'Соберите лучшие моменты из соцсетей.',
    imageUrl: 'https://storage.googleapis.com/proudcity_images/yuzulab/photobook_insta_sq.jpg',
    features: ['Твердая обложка', '24 страницы', 'Плотная матовая бумага'],
    detailedFeatures: ['Квадратный формат, идеальный для Instagram фото', 'Автоматическое или ручное размещение фото', 'Современный минималистичный дизайн'],
    bestSuitedFor: ['Instagram', 'Повседневные моменты', 'Мини-подарок'],
    exampleGalleryImages: [
      'https://picsum.photos/seed/insta_ex1/300/200',
    ]
  },
];

const benefitsData = [
  {
    iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Премиум-качество печати",
    description: "Яркие цвета, четкие детали и долговечные материалы – ваши воспоминания заслуживают лучшего воплощения."
  },
  {
    iconPath: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125",
    title: "Индивидуальный дизайн",
    description: "Полная свобода творчества – от выбора обложки до расположения фотографий. Создайте книгу, которая уникальна, как и вы."
  },
  {
    iconPath: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
    title: "Сохраните лучшие моменты",
    description: "Превратите ваши цифровые фотографии в красивую историю, которую можно держать в руках и перелистывать с теплом."
  }
];

const BenefitIcon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-10 h-10 text-brand-DEFAULT" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const HowItWorksStep: React.FC<{ stepNumber: number; title: string; description: string; iconPath: string; className?: string; }> = ({ stepNumber, title, description, iconPath, className }) => (
    <div className={`how-it-works-step-hook group flex flex-col items-center text-center p-6 bg-ui-surface rounded-2xl shadow-card hover:shadow-card-hover transform hover:-translate-y-1 transition-all duration-300 ${className}`} style={{opacity:0}}>
        <div className="relative mb-6">
            <div className="absolute -inset-2 bg-brand-light rounded-full opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative w-20 h-20 bg-brand-light rounded-full flex items-center justify-center text-brand-DEFAULT shadow-inner group-hover:scale-105 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                </svg>
            </div>
            <span className="absolute -top-2 -right-2 bg-brand-DEFAULT text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-ui-surface shadow-md">{stepNumber}</span>
        </div>
        <h4 className="text-xl font-semibold text-content-primary mb-2">{title}</h4>
        <p className="text-sm text-content-secondary">{description}</p>
    </div>
);

export const PhotoBooks: React.FC = () => {
  const [selectedFormatId, setSelectedFormatId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);
  const [comments, setComments] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const benefitsSectionRef = useRef<HTMLDivElement>(null); 
  const howItWorksRef = useRef<HTMLDivElement>(null);
  
  const formatsSectionRef = useRef<HTMLDivElement>(null);
  const orderFormSectionRef = useRef<HTMLFormElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const galleryAnimationWrapperRef = useRef<HTMLDivElement>(null);
  const galleryAnimationTweenRef = useRef<gsap.core.Tween | null>(null);

  const selectedFormat = formatsData.find(f => f.id === selectedFormatId);

  // --- NEW GSAP ANIMATION LOGIC FOR SLIDER ---
  const animateSlideContent = useCallback((slideEl: HTMLElement | null, direction: 'in' | 'out' = 'in') => {
      if (!slideEl) return;
  
      const imageRevealWrapper = slideEl.querySelector('.photobook-image-reveal');
      const image = slideEl.querySelector('.photobook-image');
      const title = slideEl.querySelector('.photobook-title');
      const description = slideEl.querySelector('.photobook-description');
      const features = slideEl.querySelectorAll('.photobook-feature');
      const tags = slideEl.querySelector('.photobook-tags');
      const price = slideEl.querySelector('.photobook-price');
      const buttonWrapper = slideEl.querySelector('.photobook-button');
  
      const elementsToStagger = [title, description, ...Array.from(features), tags, price, buttonWrapper].filter(Boolean);
  
      gsap.killTweensOf([imageRevealWrapper, image, ...elementsToStagger]);
  
      if (direction === 'in') {
        // Reset styles before animating in
        gsap.set(elementsToStagger, { opacity: 0, y: 20 });
        gsap.set(imageRevealWrapper, { clipPath: 'inset(0% 100% 0% 0%)' });
        gsap.set(image, { scale: 1.1 });
  
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(imageRevealWrapper, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' })
          .to(image, { scale: 1, duration: 1.2, ease: 'power2.out' }, '<')
          .to(elementsToStagger, {
              y: 0,
              opacity: 1,
              stagger: 0.06,
              duration: 0.7,
          }, '-=0.8');
      } else { // 'out' animation
        const tl = gsap.timeline({ defaults: { ease: 'power3.in' } });
        tl.to(elementsToStagger, {
            y: -20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.4,
        });
      }
  }, []);

  const handleSlideChangeStart = useCallback((swiper: SwiperCore) => {
      const prevSlide = swiper.slides[swiper.previousIndex];
      if (prevSlide) {
          animateSlideContent(prevSlide as HTMLElement, 'out');
      }
  }, [animateSlideContent]);

  const handleSlideChangeEnd = useCallback((swiper: SwiperCore) => {
      const activeSlide = swiper.slides[swiper.activeIndex];
      if (activeSlide) {
          animateSlideContent(activeSlide as HTMLElement, 'in');
      }
  }, [animateSlideContent]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } });

    const animateSection = (ref: React.RefObject<HTMLElement>, childrenSelector?: string, stagger: number = 0.15) => {
        if (ref.current) {
            const elements = childrenSelector ? Array.from(ref.current.querySelectorAll(childrenSelector)) : [ref.current];
            if (elements.length > 0) {
                 tl.fromTo(elements, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger, delay: 0.1 }, "+=0.1");
            }
        }
    };
    
    animateSection(heroRef, '.hero-item');
    
    if (benefitsSectionRef.current) { 
      const benefitsTitle = benefitsSectionRef.current.querySelector('h3');
      const benefitItems = benefitsSectionRef.current.querySelectorAll('.benefit-item-hook');
      if (benefitsTitle) tl.fromTo(benefitsTitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "+=0.1");
      if (benefitItems.length > 0) tl.fromTo(benefitItems, { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.5 }, "-=0.2");
    }
    
    if (howItWorksRef.current) {
        const title = howItWorksRef.current.querySelector('h3');
        if (title) tl.fromTo(title, {opacity:0, y:20}, {opacity:1, y:0, duration:0.5}, "+=0.1" );
        animateSection(howItWorksRef, '.how-it-works-step-hook', 0.15);
    }
    
    if (formatsSectionRef.current) {
        const title = formatsSectionRef.current.querySelector('h3');
        const slider = formatsSectionRef.current.querySelector('.photobook-slider-wrapper');
        if (title) tl.fromTo(title, {opacity:0, y:20}, {opacity:1, y:0, duration: 0.5}, "+=0.1");
        if (slider) tl.fromTo(slider, {opacity:0, y:30}, {opacity:1, y:0, duration:0.6}, "-=0.3");
    }
    
    if (orderFormSectionRef.current) {
        gsap.set(orderFormSectionRef.current, { opacity: 0, y: 50, pointerEvents: 'none' });
    }

    return () => { 
        tl.kill(); 
        if (galleryAnimationTweenRef.current) galleryAnimationTweenRef.current.kill();
    };
  }, []);

  useEffect(() => {
    if (orderFormSectionRef.current) {
        if (selectedFormatId && selectedFormat) {
            gsap.timeline()
                .to(orderFormSectionRef.current, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.6, ease: 'power3.out', delay: 0.1 })
                .call(() => orderFormSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), undefined, "+=0.1");
        } else {
            gsap.to(orderFormSectionRef.current, { opacity: 0, y: 50, pointerEvents: 'none', duration: 0.4 });
        }
    }
  }, [selectedFormatId, selectedFormat]);

  useEffect(() => {
    if (galleryAnimationTweenRef.current) {
      galleryAnimationTweenRef.current.kill();
      galleryAnimationTweenRef.current = null;
    }
    if (galleryAnimationWrapperRef.current) {
      gsap.set(galleryAnimationWrapperRef.current, { y: 0 }); // Reset position before starting
      while (galleryAnimationWrapperRef.current.firstChild) {
        galleryAnimationWrapperRef.current.removeChild(galleryAnimationWrapperRef.current.firstChild);
      }
    }

    if (selectedFormat && selectedFormat.exampleGalleryImages && selectedFormat.exampleGalleryImages.length > 0 && galleryAnimationWrapperRef.current) {
      const galleryWrapper = galleryAnimationWrapperRef.current;
      const imagesToDisplay = [...selectedFormat.exampleGalleryImages, ...selectedFormat.exampleGalleryImages];
      
      imagesToDisplay.forEach((imgUrl, index) => {
        const div = document.createElement('div');
        div.className = "mb-4 last:mb-0";
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `Пример фотокниги ${selectedFormat.name} ${(index % selectedFormat.exampleGalleryImages.length) + 1}`;
        img.className = "w-full h-auto object-cover rounded-lg shadow-md aspect-[3/2]";
        div.appendChild(img);
        galleryWrapper.appendChild(div);
      });
      
      const numOriginalImages = selectedFormat.exampleGalleryImages.length;

      const startAnimation = () => {
        if (galleryWrapper.children.length >= numOriginalImages * 2 && galleryWrapper.children[numOriginalImages]) {
          const firstRepeatedItem = galleryWrapper.children[numOriginalImages] as HTMLElement;
          const totalScrollHeightVal = firstRepeatedItem.offsetTop; 

          if (totalScrollHeightVal > 0) { 
            const scrollSpeedPxPerSec = 20; 
            const calculatedAnimationDuration = totalScrollHeightVal / scrollSpeedPxPerSec;

            galleryAnimationTweenRef.current = gsap.fromTo(
              galleryWrapper,
              { y: 0 },
              {
                y: -totalScrollHeightVal,
                duration: calculatedAnimationDuration,
                ease: 'none',
                repeat: -1,
              }
            );
          }
        }
      };
      gsap.delayedCall(0.3, startAnimation);
    }
  }, [selectedFormat]);


  useEffect(() => {
    if (submissionMessage && notificationRef.current) {
      gsap.fromTo(notificationRef.current, {opacity:0, y: -20, scale: 0.95}, {opacity:1, y:0, scale: 1, duration:0.4, ease: 'back.out(1.7)'});
      const timer = setTimeout(() => {
        if(notificationRef.current) {
            gsap.to(notificationRef.current, {opacity:0, y: -20, scale:0.95, duration:0.4, ease: 'power2.in', onComplete: () => setSubmissionMessage(null)});
        } else {
            setSubmissionMessage(null);
        }
      }, 6600);
      return () => clearTimeout(timer);
    }
  }, [submissionMessage]);

  const handleFormatSelect = (formatId: string) => {
    setSelectedFormatId(prevId => prevId === formatId ? null : formatId);
  };
  
  const handleChangeFormat = () => {
    setSelectedFormatId(null);
    formatsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start'});
  };

  const scrollToFormats = () => {
    formatsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFormat) {
        setSubmissionMessage("Пожалуйста, сначала выберите формат фотокниги.");
        formatsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    setSubmissionMessage(`Заявка на фотокнигу "${selectedFormat?.name}" (${selectedFormat?.price.toLocaleString()} руб.) успешно отправлена! Мы свяжемся с вами.`);
    setName(''); setEmail(''); setPhone(''); setPhotoFiles(null); setComments(''); setSelectedFormatId(null);
    if(orderFormSectionRef.current) orderFormSectionRef.current.reset();
  };
  
  const howItWorksSteps = [
    { title: "Выберите формат", description: "Подберите идеальный размер и тип обложки для вашей истории.", iconPath: "M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" },
    { title: "Загрузите фото", description: "Легко загрузите ваши лучшие снимки через форму заказа.", iconPath: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" },
    { title: "Мы создаем макет", description: "Наши дизайнеры сверстают красивый макет и согласуют его с вами.", iconPath: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" },
    { title: "Получите книгу", description: "Качественная печать и бережная доставка вашей уникальной фотокниги.", iconPath: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0c-.566.057-.987.538-.987 1.106v.958m12.026 0H4.474" },
  ];

  return (
    <div className="space-y-16 md:space-y-20">
      <header 
        ref={heroRef} 
        className="bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 p-12 sm:p-16 md:p-20 lg:p-24 rounded-3xl shadow-xl text-center overflow-hidden"
      >
        <h2 className="hero-item text-4xl sm:text-5xl md:text-6xl font-bold text-content-primary mb-6 tracking-tight" style={{opacity:0}}>
          Ваши моменты, достойные книги
        </h2>
        <p className="hero-item text-lg sm:text-xl text-content-secondary max-w-2xl mx-auto mb-10" style={{opacity:0}}>
          Создайте уникальную фотокнигу, которая сохранит ваши самые яркие воспоминания на долгие годы.
        </p>
        <div className="hero-item" style={{opacity:0}}>
            <Button 
                onClick={scrollToFormats} 
                size="lg" 
                variant="primary" 
                className="rounded-full px-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
            >
            Начать создание
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
            </Button>
        </div>
      </header>

      <section 
        ref={benefitsSectionRef} 
        className="py-12 md:py-16 bg-ui-surface/80 backdrop-blur-lg rounded-3xl shadow-xl"
      >
        <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-content-primary mb-12 text-center" style={{opacity:0}}>Почему наши фотокниги?</h3>
            <div className="grid md:grid-cols-3 gap-8">
                {benefitsData.map((benefit, index) => (
                <div key={index} className="benefit-item-hook bg-ui-surface p-6 md:p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col items-center text-center" style={{opacity:0}}>
                    <div className="p-4 bg-brand-light rounded-full mb-6 inline-block transform group-hover:scale-110 transition-transform duration-300">
                        <BenefitIcon path={benefit.iconPath} />
                    </div>
                    <h4 className="text-xl font-semibold text-content-primary mb-3">{benefit.title}</h4>
                    <p className="text-sm text-content-secondary flex-grow">{benefit.description}</p>
                </div>
                ))}
            </div>
        </div>
      </section>

      <section 
        ref={howItWorksRef} 
        className="py-12 md:py-16 bg-ui-surface/80 backdrop-blur-lg rounded-3xl shadow-xl px-6 md:px-8 lg:px-12"
      >
        <h3 className="text-3xl font-bold text-content-primary mb-12 text-center" style={{opacity:0}}>Как это работает? Просто и удобно!</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
                <HowItWorksStep 
                    key={index} 
                    stepNumber={index + 1} 
                    title={step.title} 
                    description={step.description}
                    iconPath={step.iconPath}
                />
            ))}
        </div>
      </section>

      <section ref={formatsSectionRef} id="formats-section" className="scroll-mt-20 px-4 md:px-0">
        <h3 className="text-3xl font-bold text-content-primary mb-12 text-center" style={{opacity:0}}>Шаг 1: Выберите формат вашей фотокниги</h3>
        <div className="photobook-slider-wrapper relative" style={{opacity:0}}>
            <Swiper
                modules={[Navigation, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={true}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{
                    el: '.swiper-pagination-custom',
                    clickable: true,
                }}
                className="pb-16" // Padding bottom for pagination
                onInit={(swiper) => {
                    setTimeout(() => {
                        const firstSlide = swiper.slides[swiper.activeIndex];
                        if (firstSlide) {
                            animateSlideContent(firstSlide as HTMLElement, 'in');
                        }
                    }, 100);
                }}
                onSlideChangeTransitionStart={handleSlideChangeStart}
                onSlideChangeTransitionEnd={handleSlideChangeEnd}
            >
                {formatsData.map((format) => (
                    <SwiperSlide key={format.id} className="p-1">
                        <div className="bg-ui-surface rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                                {/* Left Column: Image */}
                                <div className="md:col-span-2 bg-slate-100 photobook-image-reveal">
                                    <img 
                                        src={format.imageUrl || 'https://picsum.photos/seed/photobook_default_new/600/600'} 
                                        alt={format.name} 
                                        className="photobook-image w-full h-full object-cover min-h-[300px] md:min-h-0 aspect-[1/1] md:aspect-auto"
                                    />
                                </div>
                                {/* Right Column: Details */}
                                <div className="md:col-span-3 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                                    <h4 className="photobook-title photobook-item-animate text-3xl lg:text-4xl font-bold text-content-primary mb-4">{format.name}</h4>
                                    <p className="photobook-description photobook-item-animate text-base text-content-secondary mb-6">{format.description}</p>
                                    
                                    <ul className="space-y-3 mb-6">
                                        {format.features?.map(feature => (
                                            <li key={feature} className="photobook-feature photobook-item-animate flex items-center text-content-primary">
                                                <CheckIcon className="w-5 h-5 text-brand-DEFAULT mr-3 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {format.bestSuitedFor && (
                                        <div className="photobook-tags photobook-item-animate flex flex-wrap gap-2 mb-8">
                                            {format.bestSuitedFor.map(tag => (
                                                <span key={tag} className="inline-block bg-brand-light text-brand-dark text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <p className="photobook-price photobook-item-animate text-4xl font-bold text-brand-DEFAULT">{format.price.toLocaleString()}&nbsp;руб.</p>
                                        <div className="photobook-button photobook-item-animate w-full sm:w-auto flex-shrink-0">
                                            <Button 
                                                variant={selectedFormatId === format.id ? 'primary' : 'glass-active'} 
                                                size="lg" 
                                                onClick={() => handleFormatSelect(format.id)}
                                                className="w-full !rounded-full px-8 shadow-lg transform hover:scale-105"
                                            >
                                                {selectedFormatId === format.id ? 'Выбрано!' : 'Выбрать этот формат'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation */}
            <div className="absolute top-1/2 -translate-y-[calc(50%+2rem)] z-10 hidden md:flex justify-between w-[calc(100%+5rem)] lg:w-[calc(100%+8rem)] left-1/2 -translate-x-1/2 pointer-events-none">
                <button className="swiper-button-prev-custom pointer-events-auto bg-white/70 backdrop-blur-sm text-content-primary rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                </button>
                <button className="swiper-button-next-custom pointer-events-auto bg-white/70 backdrop-blur-sm text-content-primary rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </button>
            </div>
            
            {/* Custom Pagination */}
            <div className="swiper-pagination-custom absolute bottom-4 left-1/2 -translate-x-1/2 w-auto flex space-x-2"></div>
        </div>
      </section>
      
      {submissionMessage && (
        <div ref={notificationRef} className="p-4 bg-brand-light text-brand-dark rounded-xl shadow-md text-center sticky top-20 z-50" style={{opacity:0}}>
          {submissionMessage}
        </div>
      )}
      
      <form 
        ref={orderFormSectionRef} 
        onSubmit={handleSubmit} 
        className="bg-ui-surface p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl" 
      >
        <div className="md:grid md:grid-cols-3 md:gap-x-8 lg:gap-x-12">
          {/* Left Column: Form Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-content-primary">Шаг 2: Детали вашего заказа</h3>
                {selectedFormatId && (
                  <Button onClick={handleChangeFormat} variant="outline" size="sm" className="ml-4">
                      Изменить формат
                  </Button>
                )}
            </div>

            {selectedFormat && (
                <div className="p-6 bg-brand-light/40 border-2 border-brand-DEFAULT/30 rounded-2xl text-left space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <img src={selectedFormat.imageUrl} alt={selectedFormat.name} className="w-32 h-24 sm:w-40 sm:h-32 object-cover rounded-lg shadow-md flex-shrink-0" />
                        <div>
                            <p className="text-xl font-semibold text-brand-dark">{selectedFormat.name}</p>
                            <p className="text-sm text-brand-dark/80 mt-1">{selectedFormat.description}</p>
                        </div>
                    </div>
                    {selectedFormat.features && selectedFormat.features.length > 0 && (
                        <div>
                            <h5 className="text-sm font-semibold text-brand-dark mb-1">Ключевые особенности:</h5>
                            <ul className="text-xs text-brand-dark/90 space-y-0.5 list-disc list-inside pl-1">
                                {selectedFormat.features.map(feature => <li key={feature}>{feature}</li>)}
                            </ul>
                        </div>
                    )}
                    {selectedFormat.bestSuitedFor && selectedFormat.bestSuitedFor.length > 0 && (
                        <div>
                            <h5 className="text-sm font-semibold text-brand-dark mb-1">Рекомендуется для:</h5>
                            <div className="flex flex-wrap gap-1.5">
                            {selectedFormat.bestSuitedFor.map(tag => (
                                <span key={tag} className="bg-brand-DEFAULT/20 text-brand-dark text-xs font-medium px-2 py-0.5 rounded-full">{tag}</span>
                            ))}
                            </div>
                        </div>
                    )}
                    <p className="text-lg font-bold text-brand-dark text-right pt-2 border-t border-brand-DEFAULT/20 mt-3">Стоимость: {selectedFormat.price.toLocaleString()} руб.</p>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <InputField label="Ваше имя" type="text" id="pb-name" value={name} onChange={(e) => setName(e.target.value)} required />
                <InputField label="Ваш Email" type="email" id="pb-email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@mail.com" />
            </div>
            <InputField label="Ваш телефон" type="tel" id="pb-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7 (___) ___-__-__" />
            
            <div>
              <label htmlFor="pb-photos" className="block text-sm font-medium text-content-primary mb-1">Загрузите фотографии (макет):</label>
              <input 
                type="file" 
                id="pb-photos" 
                multiple 
                accept="image/*,.zip,.rar"
                onChange={(e) => setPhotoFiles(e.target.files)} 
                className="block w-full text-sm text-content-secondary file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-DEFAULT hover:file:bg-brand-DEFAULT hover:file:text-content-inverted cursor-pointer border border-ui-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ui-ring focus:border-ui-ring"
              />
              {photoFiles && <p className="text-sm text-content-secondary mt-2">Выбрано файлов: {photoFiles.length}</p>}
               <p className="text-xs text-content-subtle mt-1">В реальном приложении здесь будет полноценная загрузка файлов на сервер.</p>
            </div>

            <div>
              <label htmlFor="pb-comments" className="block text-sm font-medium text-content-primary mb-1">Комментарии к заказу (необязательно):</label>
              <textarea 
                id="pb-comments" 
                rows={4} 
                value={comments} 
                onChange={(e) => setComments(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-ui-border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-ui-ring focus:border-ui-ring sm:text-sm bg-white"
                placeholder="Особые пожелания, порядок фотографий, текст для обложки и т.д."
              />
            </div>
            
            <div className="pt-4">
              <Button type="submit" fullWidth size="lg" variant="glass-active">Отправить заявку</Button>
            </div>
            <p className="text-sm text-content-secondary text-center">После отправки заявки мы рассчитаем точную стоимость и свяжемся с вами для согласования макета.</p>
          </div>

          {/* Right Column: Example Gallery */}
          <div className="md:col-span-1 mt-10 md:mt-0 pt-0 md:pt-[72px] flex flex-col">
            {selectedFormat ? (
              <>
                <h4 className="text-xl font-semibold text-content-primary mb-6">
                  Примеры работ в формате "{selectedFormat.name}"
                </h4>
                {selectedFormat.exampleGalleryImages && selectedFormat.exampleGalleryImages.length > 0 ? (
                  <div className="overflow-hidden relative h-[480px]"> {/* Fixed height for scroll area */}
                    <div ref={galleryAnimationWrapperRef} className="absolute top-0 left-0 w-full">
                      {/* Images are now added dynamically in useEffect */}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-content-subtle py-8 h-full">
                    Для этого формата пока нет примеров галереи.
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center text-content-subtle py-8 h-full bg-ui-background rounded-2xl border border-dashed border-ui-border">
                <p className="p-4 text-center">Выберите формат, чтобы увидеть примеры работ и галерею.</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};