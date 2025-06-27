import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { HallRentalInfo } from '../types';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { InputField } from './common/InputField';
import { gsap } from 'gsap';

// Data source for hall details - In a real app, this would be fetched or from a global context.
const FAKE_HALL_DATA_SOURCE: HallRentalInfo[] = [
    { 
        id: 'h1', 
        name: 'Зал "Вдохновение"', 
        capacity: 50, 
        pricePerHour: 2000, 
        amenities: ['Проектор Full HD', 'Большой экран (3м)', 'Маркерная доска', 'Флипчарт', 'Высокоскоростной Wi-Fi', 'Кофе-зона (кулер, чайник, посуда)', 'Удобные стулья с пюпитрами', 'Кондиционер'], 
        imageUrls: [
            'https://picsum.photos/seed/hall1_page_hero/1000/600', 
            'https://picsum.photos/seed/hall1_alt1/800/600',
            'https://picsum.photos/seed/hall1_alt2/800/600',
            'https://picsum.photos/seed/hall1_alt3/800/600'
        ],
        description: "Просторный и светлый зал (70 кв.м.) с высокими потолками, идеально подходит для лекций, семинаров, тренингов и презентаций.",
        detailedDescription: "Зал 'Вдохновение' – это многофункциональное пространство, созданное для комфортного проведения образовательных и деловых мероприятий. Большие окна обеспечивают отличное естественное освещение, а система кондиционирования поддерживает приятный микроклимат. \n\nМы предоставляем все необходимое оборудование: современный Full HD проектор, большой экран, маркерную доску и флипчарт. Удобные стулья с пюпитрами могут быть расставлены в различных конфигурациях (театр, класс, круглый стол) в зависимости от ваших потребностей. \n\nДля перерывов предусмотрена отдельная кофе-зона с кулером, чайником и необходимой посудой. Высокоскоростной Wi-Fi доступен для всех участников мероприятия. Наша команда всегда готова помочь с организацией и технической поддержкой."
    },
    { 
        id: 'h2', 
        name: 'Аудитория "Прогресс"', 
        capacity: 20, 
        pricePerHour: 1200, 
        amenities: ['Плазменная панель 55"', 'Столы и стулья (конфигурация класс/переговоры)', 'Wi-Fi', 'Кондиционер', 'Маркерная доска (малая)'], 
        imageUrls: [
            'https://picsum.photos/seed/hall2_page_hero/1000/600',
            'https://picsum.photos/seed/hall2_alt1/800/600',
            'https://picsum.photos/seed/hall2_alt2/800/600'
        ],
        description: "Уютная аудитория (35 кв.м.) для небольших групп, мастер-классов, совещаний или языковых курсов.",
        detailedDescription: "Аудитория 'Прогресс' представляет собой компактное и функциональное пространство, идеально подходящее для мероприятий с участием до 20 человек. Помещение оборудовано удобными столами и стульями, которые могут быть расставлены для работы в формате класса или переговорной комнаты. \n\nДля презентаций установлена плазменная панель диагональю 55 дюймов. Имеется кондиционер для поддержания комфортной температуры и маркерная доска для записей. Стабильный Wi-Fi доступен на всей территории. Это отличное решение для проведения интенсивных воркшопов, тренингов для малых групп, стратегических сессий или индивидуальных консультаций."
    },
];

const HallDetail: React.FC = () => {
  const { hallId } = useParams<{ hallId: string }>();
  const [hall, setHall] = useState<HallRentalInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comments, setComments] = useState('');
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);
  const amenitiesSectionRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foundHall = FAKE_HALL_DATA_SOURCE.find(h => h.id === hallId);
    setHall(foundHall || null);
    setActiveImageIndex(0); 
  }, [hallId]);

  useEffect(() => {
    if (hall && mainContentRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }});
      tl.fromTo(mainContentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(heroImageRef.current, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.7 }, "-=0.1")
        .fromTo(thumbnailsRef.current?.children || [], {opacity:0, y:10}, {opacity:1, y:0, stagger:0.05, duration:0.3}, "-=0.4")
        .fromTo([detailsSectionRef.current, amenitiesSectionRef.current, ctaSectionRef.current], 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, stagger: 0.2, duration: 0.5 }, 
          "-=0.3"
        );
    }
  }, [hall]);
  
  useEffect(() => {
    if (heroImageRef.current && hall?.imageUrls?.[activeImageIndex]) {
        gsap.fromTo(heroImageRef.current, {opacity: 0.7, scale:0.98}, {opacity:1, scale:1, duration:0.4, ease:'power2.out'});
    }
  }, [activeImageIndex, hall]);

  useEffect(() => {
    if (enquiryMessage && notificationRef.current) {
      gsap.fromTo(notificationRef.current, {opacity:0, y: -20}, {opacity:1, y:0, duration:0.4, ease: 'back.out(1.7)'});
      const timer = setTimeout(() => {
         if(notificationRef.current) {
            gsap.to(notificationRef.current, {opacity:0, y: -20, duration:0.4, ease: 'power2.in', onComplete: () => setEnquiryMessage(null)});
        } else {
            setEnquiryMessage(null);
        }
      }, 4600);
      return () => clearTimeout(timer);
    }
  }, [enquiryMessage]);

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (hall && name && phone) {
      setEnquiryMessage(`Ваша заявка на аренду зала "${hall.name}" принята! Мы свяжемся с вами по телефону: ${phone}.`);
      setIsModalOpen(false);
      setName('');
      setPhone('');
      setComments('');
    }
  };

  if (!hall) {
    return <div className="text-center py-10 text-content-secondary">Зал не найден. <Link to="/master-classes#halls-section" className="text-brand-DEFAULT hover:underline">Вернуться к списку залов</Link></div>;
  }
  
  const heroImageUrl = hall.imageUrls && hall.imageUrls.length > 0 ? hall.imageUrls[activeImageIndex] : 'https://picsum.photos/seed/default_hall/1000/600';

  return (
    <div ref={mainContentRef} className="space-y-10 md:space-y-16" style={{opacity:0}}>
      <header className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-header">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-DEFAULT tracking-tight">{hall.name}</h1>
                <p className="text-md sm:text-lg text-content-secondary mt-2">
                    Вместимость: до {hall.capacity} человек | Цена: {hall.pricePerHour.toLocaleString()} руб/час
                </p>
            </div>
            <Link to="/master-classes#halls-section" className="mt-4 sm:mt-0 text-sm font-medium text-brand-DEFAULT hover:underline flex items-center self-start sm:self-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.56l2.72 2.72a.75.75 0 11-1.06 1.06l-4-4a.75.75 0 010-1.06l4-4a.75.75 0 011.06 1.06L5.56 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                Все залы
            </Link>
        </div>
      </header>

      {enquiryMessage && (
        <div ref={notificationRef} className="p-4 bg-brand-light text-brand-dark rounded-xl shadow-md text-center sticky top-20 z-50" style={{opacity:0}}>
          {enquiryMessage}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl shadow-xl overflow-hidden aspect-[16/10] bg-ui-border">
                <img ref={heroImageRef} src={heroImageUrl} alt={hall.name} className="w-full h-full object-cover"/>
            </div>
            {hall.imageUrls && hall.imageUrls.length > 1 && (
                <div ref={thumbnailsRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {hall.imageUrls.map((url, index) => (
                        <button 
                            key={index} 
                            onClick={() => setActiveImageIndex(index)}
                            className={`rounded-lg overflow-hidden aspect-square border-2 transition-all duration-200 ease-in-out hover:opacity-100 hover:border-brand-DEFAULT focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT focus:ring-offset-2
                                        ${index === activeImageIndex ? 'border-brand-DEFAULT opacity-100 shadow-md' : 'border-transparent opacity-70'}`}
                            aria-label={`Показать изображение ${index + 1}`}
                        >
                            <img src={url} alt={`Миниатюра ${index + 1}`} className="w-full h-full object-cover"/>
                        </button>
                    ))}
                </div>
            )}
        </div>
        
        <div className="lg:col-span-1 space-y-8">
            <section ref={detailsSectionRef} className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-card">
                <h2 className="text-2xl font-semibold text-content-primary mb-3">Описание зала</h2>
                <p className="text-content-secondary whitespace-pre-line leading-relaxed">{hall.detailedDescription || hall.description}</p>
            </section>
        </div>
      </div>
      
      {hall.amenities && hall.amenities.length > 0 && (
        <section ref={amenitiesSectionRef} className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-card">
          <h2 className="text-2xl font-semibold text-content-primary mb-6">Удобства и оборудование</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
            {hall.amenities.map((item, index) => (
              <li key={index} className="flex items-center text-content-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-DEFAULT mr-2.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}
      
      <section ref={ctaSectionRef} className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-xl mt-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-content-primary mb-3">Заинтересовались?</h2>
        <p className="text-lg text-content-secondary mb-6">
            Свяжитесь с нами, чтобы обсудить детали аренды зала "{hall.name}" 
            по цене {hall.pricePerHour.toLocaleString()} руб/час.
        </p>
        <Button onClick={() => setIsModalOpen(true)} size="lg" variant="primary" className="shadow-lg hover:shadow-xl transform hover:scale-105">
            Отправить заявку на аренду
        </Button>
      </section>

      {isModalOpen && hall && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Заявка на аренду: ${hall.name}`}>
            <form onSubmit={handleSubmitEnquiry} className="space-y-5 p-1">
                <InputField label="Ваше имя" id="enquiry-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <InputField label="Телефон" id="enquiry-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7 (___) ___-__-__" />
                <div>
                  <label htmlFor="enquiry-comments" className="block text-sm font-medium text-content-primary mb-1.5">Комментарии (необязательно):</label>
                  <textarea 
                    id="enquiry-comments" 
                    rows={3} 
                    value={comments} 
                    onChange={(e) => setComments(e.target.value)}
                    className="mt-1 block w-full px-3.5 py-2.5 border border-ui-border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-ui-ring focus:border-ui-ring sm:text-sm bg-white"
                    placeholder="Предпочтительные даты, время, количество человек, особые пожелания..."
                  />
                </div>
                <div className="pt-3 space-y-3">
                    <Button type="submit" fullWidth variant="glass-active">Отправить</Button>
                    <Button type="button" variant="glass" onClick={() => setIsModalOpen(false)} fullWidth>Отмена</Button>
                </div>
                 <p className="text-xs text-content-subtle text-center mt-2">Мы свяжемся с вами для подтверждения и обсуждения деталей.</p>
            </form>
        </Modal>
      )}
    </div>
  );
};

export default HallDetail;
