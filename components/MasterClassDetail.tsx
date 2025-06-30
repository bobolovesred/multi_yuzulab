import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { MasterClassEvent } from '../types';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { InputField } from './common/InputField';
import { gsap } from 'gsap';

// Data source - In a real app, this would be fetched or from a global context.
// For this mockup, we'll use a local copy.
const FAKE_MASTERCLASS_DATA_SOURCE: MasterClassEvent[] = [
  { 
    id: 'mc1', 
    title: 'Основы студийной съемки', 
    date: '2024-07-15', 
    time: '18:00', 
    description: 'Изучите работу со светом, композицию и взаимодействие с моделью.', 
    detailedDescription: 'Этот интенсивный мастер-класс предназначен для фотографов, желающих освоить основы работы в студии. Мы подробно разберем различные схемы освещения (рисующий, заполняющий, контровой свет), научимся использовать софтбоксы, рефлекторы и другие насадки. Практическая часть включает съемку модели с постановкой задач и анализом результатов. Вы узнаете, как создавать объемные и выразительные портреты.',
    price: 3000, 
    image: '/images/masterclasses/mc_studio_card.png', 
    imageUrls: ['/images/masterclasses/mc1_hero.png', '/images/masterclasses/mc1_gallery1.png', '/images/masterclasses/mc1_gallery2.png'],
    location: 'Лофт Студия "Атмосфера", г. Енакиево',
    instructorName: 'Алексей Светов',
    instructorBio: 'Профессиональный фотограф с 10-летним опытом в коммерческой и портретной съемке. Преподаватель фотошколы "Объектив". Работал с известными брендами и журналами. Его стиль отличается глубоким пониманием света и психологии модели.',
    instructorImage: '/images/masterclasses/instructor_alex.png',
    program: [
      { timeSlot: '18:00 - 18:30', activity: 'Введение: Типы студийного света и оборудование' },
      { timeSlot: '18:30 - 19:30', activity: 'Теория: Основные световые схемы', description: 'Разбор классических схем: Рембрандт, бабочка, боковой свет, высокий и низкий ключ.' },
      { timeSlot: '19:30 - 19:45', activity: 'Кофе-брейк' },
      { timeSlot: '19:45 - 21:15', activity: 'Практика: Съемка модели', description: 'Отработка изученных схем, работа с насадками, позирование.' },
      { timeSlot: '21:15 - 21:30', activity: 'Вопросы и ответы, разбор работ участников' },
    ]
  },
  { 
    id: 'mc2', 
    title: 'Флористика для начинающих', 
    date: '2024-07-22', 
    time: '17:00', 
    description: 'Создайте свой первый букет под руководством опытного флориста.', 
    detailedDescription: 'Мечтаете научиться создавать красивые букеты своими руками? Наш мастер-класс для начинающих флористов – идеальный старт! Вы узнаете о базовых техниках сборки букетов (спиральная, параллельная), правилах сочетания цветов и фактур, а также секретах продления жизни срезанных цветов. Каждый участник создаст свой собственный уникальный букет из сезонных цветов и заберет его с собой. Все материалы и инструменты предоставляются.',
    price: 2500, 
    image: '/images/masterclasses/mc_floristry_card.png', 
    imageUrls: ['/images/masterclasses/mc2_hero.png', '/images/masterclasses/mc2_gallery1.png'],
    location: 'Арт-пространство "Цветочный Рай", г. Кировское',
    instructorName: 'Елена Цветкова',
    instructorBio: 'Флорист-дизайнер с международным опытом и более 15 лет практики. Владелица студии флористики "Bloom". Участница и призер многочисленных флористических конкурсов.',
    instructorImage: '/images/masterclasses/instructor_elena.png',
    program: [
      { timeSlot: '17:00 - 17:30', activity: 'Знакомство с инструментами и материалами. Виды цветов.' },
      { timeSlot: '17:30 - 18:00', activity: 'Основы колористики и композиции в букете' },
      { timeSlot: '18:00 - 19:30', activity: 'Практика: Сборка спирального букета' },
      { timeSlot: '19:30 - 20:00', activity: 'Упаковка букета и советы по уходу за цветами' },
    ]
  },
   { 
    id: 'mc3', 
    title: 'Секреты создания фотокниг', 
    date: '2024-08-05', 
    time: '19:00', 
    description: 'Научитесь верстать красивые и запоминающиеся фотокниги.', 
    detailedDescription: 'Фотокнига – это современный способ сохранить ваши воспоминания. На мастер-классе вы узнаете о принципах дизайна и верстки фотокниг, выборе программного обеспечения (обзор популярных редакторов), подготовке фотографий к печати (цветокоррекция, ретушь) и работе с типографией. Мы разберем типичные ошибки и поделимся лайфхаками для создания профессионально выглядящих фотокниг, которые будут радовать вас долгие годы.',
    price: 2000, 
    image: '/images/masterclasses/mc_photobook_card.png', 
    imageUrls: ['/images/masterclasses/mc3_hero.png', '/images/masterclasses/mc3_gallery1.png', '/images/masterclasses/mc3_gallery2.png'],
    location: 'Конференц-зал "Идея", г. Шахтерск',
    instructorName: 'Иван Версткин',
    instructorBio: 'Графический дизайнер, специалист по допечатной подготовке с 8-летним стажем. Автор популярных онлайн-курсов по Adobe InDesign и Photoshop. Помог сотням людей создать свои первые фотокниги.',
    instructorImage: '/images/masterclasses/instructor_ivan.png',
    program: [
      { timeSlot: '19:00 - 19:20', activity: 'Обзор форматов, материалов и типов фотокниг' },
      { timeSlot: '19:20 - 20:00', activity: 'Принципы верстки: Сетка, композиция, типографика, работа с цветом' },
      { timeSlot: '20:00 - 20:40', activity: 'Работа в редакторе (на примере популярного онлайн-сервиса)' , description: 'Демонстрация основных инструментов, создание обложки и разворотов.'},
      { timeSlot: '20:40 - 21:00', activity: 'Подготовка к печати, выбор типографии и распространенные ошибки' },
    ]
  },
];

const MasterClassDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<MasterClassEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);
  const instructorSectionRef = useRef<HTMLDivElement>(null);
  const programSectionRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const foundEvent = FAKE_MASTERCLASS_DATA_SOURCE.find(e => e.id === eventId);
    setEvent(foundEvent || null);
    setActiveImageIndex(0); // Reset image index when event changes
  }, [eventId]);

  useEffect(() => {
    if (event && mainContentRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }});
      tl.fromTo(mainContentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(heroImageRef.current, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.7 }, "-=0.1")
        .fromTo(thumbnailsRef.current?.children || [], {opacity:0, y:10}, {opacity:1, y:0, stagger:0.05, duration:0.3}, "-=0.4")
        .fromTo([detailsSectionRef.current, instructorSectionRef.current, programSectionRef.current, ctaSectionRef.current], 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, stagger: 0.2, duration: 0.5 }, 
          "-=0.3"
        );
    }
  }, [event]);
  
   useEffect(() => {
    if (heroImageRef.current && event?.imageUrls?.[activeImageIndex]) {
        gsap.fromTo(heroImageRef.current, {opacity: 0.7, scale:0.98}, {opacity:1, scale:1, duration:0.4, ease:'power2.out'});
    }
  }, [activeImageIndex, event]);


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

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (event && name && phone) {
      setBookingMessage(`Вы успешно записались на "${event.title}"! Мы свяжемся с вами по телефону: ${phone}.`);
      setIsModalOpen(false);
      setName('');
      setPhone('');
    }
  };

  if (!event) {
    return <div className="text-center py-10 text-content-secondary">Мастер-класс не найден. <Link to="/master-classes" className="text-brand-DEFAULT hover:underline">Вернуться к списку</Link></div>;
  }
  
  const heroImageUrl = event.imageUrls && event.imageUrls.length > 0 ? event.imageUrls[activeImageIndex] : event.image;

  return (
    <div ref={mainContentRef} className="space-y-10 md:space-y-16" style={{opacity:0}}>
      <header className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-header">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-DEFAULT tracking-tight">{event.title}</h1>
                <p className="text-md sm:text-lg text-content-secondary mt-2">
                    {new Date(event.date + 'T' + event.time).toLocaleDateString('ru-RU', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} в {event.time}
                </p>
                <p className="text-sm text-content-subtle">{event.location}</p>
            </div>
            <Link to="/master-classes" className="mt-4 sm:mt-0 text-sm font-medium text-brand-DEFAULT hover:underline flex items-center self-start sm:self-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.56l2.72 2.72a.75.75 0 11-1.06 1.06l-4-4a.75.75 0 010-1.06l4-4a.75.75 0 011.06 1.06L5.56 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                Все мастер-классы
            </Link>
        </div>
      </header>

      {bookingMessage && (
        <div ref={notificationRef} className="p-4 bg-brand-light text-brand-dark rounded-xl shadow-md text-center sticky top-20 z-50" style={{opacity:0}}>
          {bookingMessage}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl shadow-xl overflow-hidden aspect-[16/10] bg-ui-border">
                <img ref={heroImageRef} src={heroImageUrl} alt={event.title} className="w-full h-full object-cover"/>
            </div>
            {event.imageUrls && event.imageUrls.length > 1 && (
                <div ref={thumbnailsRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {event.imageUrls.map((url, index) => (
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
        
        <div ref={detailsSectionRef} className="lg:col-span-1 bg-ui-surface p-6 md:p-8 rounded-2xl shadow-card space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-content-primary mb-3">О мастер-классе</h2>
            <p className="text-content-secondary whitespace-pre-line leading-relaxed">{event.detailedDescription || event.description}</p>
          </div>
        </div>
      </div>

      {event.instructorName && (
        <section ref={instructorSectionRef} className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-card">
          <h2 className="text-2xl font-semibold text-content-primary mb-6">Ведущий мастер-класса</h2>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {event.instructorImage && (
              <img src={event.instructorImage} alt={event.instructorName} className="w-32 h-32 object-cover rounded-full shadow-lg flex-shrink-0"/>
            )}
            <div>
              <h3 className="text-xl font-semibold text-brand-DEFAULT mb-1">{event.instructorName}</h3>
              {event.instructorBio && <p className="text-content-secondary whitespace-pre-line leading-relaxed">{event.instructorBio}</p>}
            </div>
          </div>
        </section>
      )}

      {event.program && event.program.length > 0 && (
        <section ref={programSectionRef} className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-card">
          <h2 className="text-2xl font-semibold text-content-primary mb-6">Программа мероприятия</h2>
          <ul className="space-y-4">
            {event.program.map((item, index) => (
              <li key={index} className="pb-4 border-b border-ui-border last:border-b-0">
                <div className="flex items-start">
                    <div className="bg-brand-light text-brand-dark font-semibold rounded-lg px-3 py-1.5 text-sm mr-4 whitespace-nowrap">{item.timeSlot}</div>
                    <div>
                        <h4 className="font-semibold text-content-primary">{item.activity}</h4>
                        {item.description && <p className="text-sm text-content-secondary mt-1">{item.description}</p>}
                    </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      
      <section ref={ctaSectionRef} className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-xl mt-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-content-primary mb-3">Готовы присоединиться?</h2>
        <p className="text-lg text-content-secondary mb-6">Стоимость участия: <strong className="text-brand-DEFAULT">{event.price.toLocaleString()} руб.</strong></p>
        <Button onClick={() => setIsModalOpen(true)} size="lg" variant="primary" className="shadow-lg hover:shadow-xl transform hover:scale-105">
            Записаться на мастер-класс
        </Button>
      </section>

      {isModalOpen && event && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSubmitBooking} className="space-y-6 p-2">
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-content-primary">Запись на "{event.title}"</h3>
                    <p className="text-content-secondary">Стоимость: {event.price.toLocaleString()} руб.</p>
                </div>
                <InputField label="Ваше имя" id="booking-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <InputField label="Телефон" id="booking-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7 (___) ___-__-__" />
                <div className="pt-2 space-y-3">
                    <Button type="submit" fullWidth variant="glass-active">Отправить заявку</Button>
                    <Button type="button" variant="glass" onClick={() => setIsModalOpen(false)} fullWidth>Отмена</Button>
                </div>
            </form>
        </Modal>
      )}
    </div>
  );
};

export default MasterClassDetail;
