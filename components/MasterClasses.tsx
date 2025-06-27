
import React, { useState, useEffect, useRef } from 'react';
import type { MasterClassEvent, HallRentalInfo } from '../types';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { InputField } from './common/InputField';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


// --- SVG ICONS FOR AMENITIES ---
const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-4.67c.12-.318.239-.636.354-.954M15 19.128l-2.472-1.247A3.375 3.375 0 0 0 12 15.128c-1.26 0-2.433.64-3.12 1.666M12 15.128c-1.113 0-2.16-.285-3.07-.786A5.991 5.991 0 0 0 7.028 12c0-1.26.64-2.433 1.666-3.12A5.991 5.991 0 0 0 12 7.028c1.26 0 2.433.64 3.12 1.666A5.991 5.991 0 0 0 16.972 12c0 .409-.053.816-.149 1.207M12 7.028c-1.113 0-2.16.285-3.07.786A5.991 5.991 0 0 0 7.028 12c0 1.26.64 2.433 1.666-3.12A5.991 5.991 0 0 0 12 16.972c.409 0 .816-.053 1.207-.149M12 16.972c1.113 0 2.16-.285 3.07-.786A5.991 5.991 0 0 0 16.972 12c0-1.26-.64-2.433-1.666-3.12A5.991 5.991 0 0 0 12 7.028" /></svg>
);
const PresentationChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h.009v.008h-.009v-.008Zm17.25 0h-.009v.008h.009v-.008Zm-17.25 0H3.12v.008h.255v-.008Zm17.25 0h.255v.008h-.255v-.008ZM12 4.5l-3 3m0 0l-3 3m3-3l3 3m-3-3l3-3m0 6v12m-3-12v12m6-12v12" /></svg>
);
const WifiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.136 11.886c3.87-3.87 10.154-3.87 14.024 0M19.78 8.732a15.75 15.75 0 0 0-15.56 0M12 18.375a.375.375 0 1 0 0-.75.375.375 0 0 0 0 .75Z" /></svg>
);
const PencilSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 19.07a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125M12 15v5.25m0 0h5.25m-5.25 0L12 15m0 0 .354-.354m-3.75 3.75h.008v.008h-.008v-.008Zm0 0h.008v.008h-.008v-.008Z" /></svg>
);
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
);

// --- DATA ---
const masterClassesData: MasterClassEvent[] = [
  { id: 'mc1', title: 'Основы студийной съемки', date: '2024-07-15', time: '18:00', description: 'Изучите работу со светом, композицию и взаимодействие с моделью.', price: 3000, image: 'https://storage.googleapis.com/proudcity_images/yuzulab/mc_studio_photography.jpg', location: 'Лофт Студия "Атмосфера"'},
  { id: 'mc2', title: 'Флористика для начинающих', date: '2024-07-22', time: '17:00', description: 'Создайте свой первый букет под руководством опытного флориста.', price: 2500, image: 'https://storage.googleapis.com/proudcity_images/yuzulab/mc_floristics.jpg', location: 'Арт-пространство "Цветочный Рай"'},
  { id: 'mc3', title: 'Секреты создания фотокниг', date: '2024-08-05', time: '19:00', description: 'Научитесь верстать красивые и запоминающиеся фотокниги.', price: 2000, image: 'https://storage.googleapis.com/proudcity_images/yuzulab/mc_photobooks.jpg', location: 'Конференц-зал "Идея"'},
];

const hallRentalData: HallRentalInfo[] = [
    { id: 'h1', name: 'Зал "Вдохновение"', capacity: 50, pricePerHour: 2000, amenities: ['Проектор', 'Маркерная доска', 'Wi-Fi', 'Кофе-зона'], imageUrls: ['https://storage.googleapis.com/proudcity_images/yuzulab/hall_inspiration.jpg'], description: "Просторный и светлый зал, идеально подходит для лекций, семинаров и тренингов."},
    { id: 'h2', name: 'Аудитория "Прогресс"', capacity: 20, pricePerHour: 1200, amenities: ['Плазменная панель 55"', 'Wi-Fi', 'Кондиционер'], imageUrls: ['https://storage.googleapis.com/proudcity_images/yuzulab/hall_progress.jpg'], description: "Уютная аудитория для небольших групп, мастер-классов и совещаний."},
];

const amenityToIconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'вместимость': UsersIcon,
    'проектор': PresentationChartBarIcon,
    'экран': PresentationChartBarIcon,
    'плазменная панель': PresentationChartBarIcon,
    'wi-fi': WifiIcon,
    'маркерная доска': PencilSquareIcon,
    'флипчарт': PencilSquareIcon,
    'кофе-зона': SparklesIcon,
    'кулер': SparklesIcon,
    'кондиционер': SparklesIcon
};

// --- NEW REDESIGNED COMPONENTS ---

const EventListItem: React.FC<{ event: MasterClassEvent; align: 'left' | 'right' }> = ({ event, align }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const item = itemRef.current;
        if (!item) return;

        const imageWrapper = item.querySelector('.g-image-wrapper');
        const textWrapper = item.querySelector('.g-text-wrapper');
        const dateBlock = item.querySelector('.g-date-block');
        
        gsap.set(item, { autoAlpha: 0 });

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });
                    tl.to(item, { autoAlpha: 1 })
                      .fromTo(imageWrapper, { clipPath: 'inset(0% 50% 0% 50%)', scale: 1.1 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.2, ease: 'expo.inOut' }, 0)
                      .fromTo(textWrapper, { x: align === 'left' ? 40 : -40, opacity: 0 }, { x: 0, opacity: 1 }, 0.2)
                      .fromTo(dateBlock, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, 0.4);
                    observer.unobserve(item);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(item);

        return () => observer.disconnect();
    }, [align]);

    const date = new Date(event.date);
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'short' }).toUpperCase().replace('.', '');

    return (
        <div ref={itemRef} className="group relative">
            <Link to={`/master-classes/${event.id}`} className="block">
                <div className={`flex flex-col md:flex-row items-stretch gap-8 md:gap-0 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
                    {/* Image Block */}
                    <div className="md:w-1/2 relative overflow-hidden rounded-2xl shadow-lg">
                        <div className="g-image-wrapper">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500 ease-in-out" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                        {/* Date Block */}
                        <div className={`g-date-block absolute top-4 ${align === 'left' ? 'right-4' : 'left-4'} bg-white/90 backdrop-blur-sm p-3 text-center rounded-xl shadow-lg`}>
                            <span className="block text-4xl font-bold text-brand-DEFAULT leading-none tracking-tighter">{day}</span>
                            <span className="block text-sm font-semibold text-content-primary leading-none mt-1">{month}</span>
                        </div>
                    </div>

                    {/* Text Block */}
                    <div className="md:w-1/2 flex items-center">
                        <div className={`g-text-wrapper w-full p-4 md:p-8 lg:p-12`}>
                            <p className="text-sm font-medium text-brand-dark mb-2">{event.location}</p>
                            <h3 className="text-3xl lg:text-4xl font-bold text-content-primary mb-4 tracking-tight group-hover:text-brand-DEFAULT transition-colors duration-300">{event.title}</h3>
                            <p className="text-base text-content-secondary mb-6">{event.description}</p>
                            <div className="flex justify-between items-center">
                                <p className="text-2xl font-semibold text-content-primary">{event.price.toLocaleString()} <span className="text-base text-content-secondary font-medium">руб.</span></p>
                                <Button variant="primary" className="!rounded-full group-hover:scale-105 transition-transform">Записаться</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

const HallListItem: React.FC<{ hall: HallRentalInfo }> = ({ hall }) => {
    const itemRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const item = itemRef.current;
        if (!item) return;

        const image = item.querySelector('.g-image');
        const textElements = item.querySelectorAll('.g-text-reveal');

        gsap.set(item, { autoAlpha: 0 });
        gsap.set(image, { scale: 1.1 });
        gsap.set(textElements, { autoAlpha: 0, y: 20 });
        
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    const tl = gsap.timeline({ defaults: { duration: 0.9, ease: 'power3.out' } });
                    tl.to(item, { autoAlpha: 1 })
                      .to(image, { scale: 1, duration: 1.4, ease: 'power2.out' }, 0)
                      .to(textElements, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.7 }, 0.2);
                    observer.unobserve(item);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(item);

        const arrowIcon = item.querySelector('.g-arrow-icon');
        const onMouseEnter = () => {
            if(image) gsap.to(image, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
            if (arrowIcon) gsap.to(arrowIcon, { x: 4, duration: 0.3, ease: 'power2.out' });
        };
        const onMouseLeave = () => {
            if(image) gsap.to(image, { scale: 1, duration: 0.4, ease: 'power2.out' });
            if (arrowIcon) gsap.to(arrowIcon, { x: 0, duration: 0.3, ease: 'power2.out' });
        };
        item.addEventListener('mouseenter', onMouseEnter);
        item.addEventListener('mouseleave', onMouseLeave);

        return () => {
            observer.disconnect();
            item.removeEventListener('mouseenter', onMouseEnter);
            item.removeEventListener('mouseleave', onMouseLeave);
        }
    }, []);

    const amenitiesWithIcons = [
        { Icon: UsersIcon, text: `до ${hall.capacity} чел.` },
        ...hall.amenities.map(amenity => {
            const key = Object.keys(amenityToIconMap).find(k => amenity.toLowerCase().includes(k));
            return key ? { Icon: amenityToIconMap[key], text: amenity } : null;
        }).filter((a): a is { Icon: React.FC<{ className?: string }>, text: string } => a !== null)
    ].slice(0, 5); // Show capacity + up to 4 other amenities

    return (
        <Link ref={itemRef} to={`/master-classes/halls/${hall.id}`} className="group block bg-ui-surface rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                <div className="md:col-span-7 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
                    <img src={hall.imageUrls[0]} alt={hall.name} className="g-image w-full h-full object-cover aspect-[4/3]"/>
                </div>
                <div className="md:col-span-5 flex flex-col p-6 lg:p-8">
                    <h3 className="g-text-reveal text-3xl font-bold text-content-primary mb-3 tracking-tighter">{hall.name}</h3>
                    <p className="g-text-reveal text-base text-content-secondary mb-6">{hall.description}</p>
                    
                    <div className="g-text-reveal grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
                        {amenitiesWithIcons.map(({ Icon, text }) => (
                            <div key={text} className="flex items-center">
                                <Icon className="w-5 h-5 text-brand-DEFAULT mr-2.5 flex-shrink-0" />
                                <span className="text-sm text-content-secondary">{text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="g-text-reveal flex justify-between items-center mt-auto pt-4 border-t border-ui-border">
                        <p className="text-2xl font-semibold text-content-primary">{hall.pricePerHour} <span className="text-base text-content-secondary font-medium">руб/час</span></p>
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


export const MasterClasses: React.FC = () => {
    const [bookingMessage, setBookingMessage] = useState<string | null>(null);

    const mainContainerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const eventsSectionRef = useRef<HTMLElement>(null);
    const hallsSectionRef = useRef<HTMLElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const heroTitle = heroRef.current?.querySelector('h2');
            const heroSubtitle = heroRef.current?.querySelector('p');
            const heroButtons = heroRef.current?.querySelector('.g-buttons');
            
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' }});
            tl.fromTo(heroRef.current, {autoAlpha:0}, {autoAlpha:1, duration:0.4})
              .fromTo([heroTitle, heroSubtitle].filter(Boolean), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger:0.2, duration: 0.6 }, "-=0.2")
              .fromTo(heroButtons, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5}, "-=0.3");

            const animateSectionTitle = (selector: string) => {
                gsap.fromTo(selector, { autoAlpha: 0, y: 20 }, {
                    autoAlpha: 1, y: 0, duration: 0.6,
                    scrollTrigger: {
                        trigger: selector,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                });
            };
            
            animateSectionTitle("#events-title");
            animateSectionTitle("#halls-title");

        }, mainContainerRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (bookingMessage && notificationRef.current) {
          gsap.fromTo(notificationRef.current, {opacity:0, y: -20}, {opacity:1, y:0, duration:0.4, ease: 'back.out(1.7)'});
          const timer = setTimeout(() => {
             if(notificationRef.current) {
                gsap.to(notificationRef.current, {opacity:0, y: -20, duration:0.4, ease: 'power2.in', onComplete: () => setBookingMessage(null)});
            } else {
                setBookingMessage(null);
            }
          }, 4600); 
          return () => clearTimeout(timer);
        }
    }, [bookingMessage]);

    const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div ref={mainContainerRef} className="space-y-20 md:space-y-28">
            <header ref={heroRef} className="bg-ui-surface p-12 sm:p-16 md:p-20 lg:p-24 rounded-3xl shadow-xl text-center overflow-hidden" style={{opacity:0}}>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-content-primary mb-6 tracking-tight">Откройте новые таланты и пространства</h2>
                <p className="text-lg md:text-xl text-content-secondary max-w-2xl mx-auto mb-10">
                    Участвуйте в увлекательных мастер-классах или арендуйте идеальный зал для ваших мероприятий.
                </p>
                <div className="g-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button onClick={() => scrollToSection(eventsSectionRef)} size="lg" variant="primary" className="!rounded-full px-8 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Смотреть мастер-классы
                    </Button>
                    <Button onClick={() => scrollToSection(hallsSectionRef)} size="lg" variant="glass" className="!rounded-full px-8 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Найти зал для аренды
                    </Button>
                </div>
            </header>

            {bookingMessage && (
                <div ref={notificationRef} className="p-4 bg-brand-light text-brand-dark rounded-xl shadow-md text-center sticky top-20 z-50" style={{opacity:0}}>
                    {bookingMessage}
                </div>
            )}

            <section ref={eventsSectionRef} id="events-section" className="scroll-mt-20 space-y-16 md:space-y-24">
                <h3 id="events-title" className="text-3xl sm:text-4xl font-bold text-content-primary text-center tracking-tight">Афиша мероприятий</h3>
                <div className="space-y-12 md:space-y-16">
                    {masterClassesData.map((event, index) => (
                        <EventListItem key={event.id} event={event} align={index % 2 === 0 ? 'left' : 'right'} />
                    ))}
                </div>
                {masterClassesData.length === 0 && (
                     <p className="text-content-secondary text-center py-4">В ближайшее время мероприятий не запланировано. Следите за обновлениями!</p>
                )}
            </section>

            <section ref={hallsSectionRef} id="halls-section" className="scroll-mt-20 space-y-16 md:space-y-24">
                <h3 id="halls-title" className="text-3xl sm:text-4xl font-bold text-content-primary text-center tracking-tight">Аренда залов</h3>
                <div className="space-y-12">
                    {hallRentalData.map((hall) => (
                        <HallListItem key={hall.id} hall={hall} />
                    ))}
                </div>
                {hallRentalData.length === 0 && (
                    <p className="text-content-secondary text-center py-4">Информация об аренде залов будет доступна позже.</p>
                )}
            </section>
        </div>
    );
};
