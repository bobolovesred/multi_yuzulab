import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Studio, BookingSlot } from '../types';
import { City } from '../types'; // Assuming City enum is needed
// Data source - similar to FlowerDetail, this would be fetched or from context.
// For mockup, redefine or ensure it's available.
const FAKE_STUDIO_DATA_SOURCE: Studio[] = [
 { id: 's1', name: 'Лофт Студия "Атмосфера"', city: City.ENAKIEVO, description: 'Просторная студия с естественным светом и разнообразными фонами.', detailedDescription: 'Лофт Студия "Атмосфера" – это 120 кв.м. творческого пространства с высокими потолками (4.5м) и большими окнами, обеспечивающими превосходное естественное освещение. Несколько фактурных стен (кирпич, бетон, дерево), бумажные и тканевые фоны. Идеально для портретной, семейной и коммерческой съемки.', hourlyRate: 1500, imageUrls: ['/images/photostudio/enakievo/1.png'], amenities: ['Естественный свет', 'Профессиональные вспышки (2 шт.)', 'Бумажные фоны', 'Тканевые фоны', 'Гримерка', 'Wi-Fi', 'Чай/кофе']},
 { id: 's2', name: 'Арт-пространство "Креатив"', city: City.KIROVSKOE, description: 'Современное оборудование, циклорама, цветные фильтры.', detailedDescription: 'Арт-пространство "Креатив" предлагает белую циклораму (5x4м), комплект импульсного света Godox, разнообразные насадки и цветные гелевые фильтры. Подходит для фэшн-съемок, каталогов, видео и творческих проектов. Есть отдельная зона для макияжа и переодевания.', hourlyRate: 1200, imageUrls: ['/images/photostudio/kirovskoe/1.png'], amenities: ['Циклорама', 'Импульсный свет (3 шт.)', 'Софтбоксы/Октобоксы', 'Цветные фильтры', 'Кондиционер', 'Музыкальная система']},
 { id: 's3', name: 'Фотостудия "Уют"', city: City.SHAKHTERSK, description: 'Уютная студия для семейных и детских фотосессий.', detailedDescription: 'Фотостудия "Уют" создана для самых теплых и душевных съемок. Мягкий свет, разнообразный реквизит для детей (игрушки, пледы, корзинки), несколько уютных фотозон с диванчиками и креслами. Комфортная атмосфера для малышей и их родителей.', hourlyRate: 1000, imageUrls: ['/images/photostudio/shahtersk/1.png'], amenities: ['Детский реквизит', 'Мягкие игрушки', 'Несколько фотозон', 'Теплый пол', 'Пеленальный столик']},
 { id: 's4', name: 'Студия "Панорама"', city: City.ENAKIEVO, description: 'Большие окна, панорамный вид, профессиональный свет.', detailedDescription: 'Студия "Панорама" впечатляет своими огромными окнами от пола до потолка, открывающими захватывающий вид на город. Обилие естественного света дополняется профессиональным студийным оборудованием. Отличное место для имиджевых съемок и мероприятий.', hourlyRate: 1800, imageUrls: ['/images/photostudio/enakievo/2.png'], amenities: ['Панорамные окна', 'Вид на город', 'Постоянный свет (2 шт.)', 'Отражатели', 'Вентилятор', 'Просторная гримерка']},
];

import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { InputField } from './common/InputField';
import { gsap } from 'gsap';

// CalendarView and BookingForm components are similar to those in PhotoStudios.tsx
// They are adapted here for use within StudioDetail.

// Хук для определения мобильного режима
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

const generateSlotsForMonth = (studioId: string, year: number, month: number): BookingSlot[] => {
  const slots: BookingSlot[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const times = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  
  for (let day = 1; day <= daysInMonth; day++) {
    for (const time of times) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      slots.push({
        date,
        time,
        studioId,
        isBooked: Math.random() > 0.8 // Simulate fewer booked slots for detail page
      });
    }
  }
  return slots;
};

const CalendarView: React.FC<{ studio: Studio, slots: BookingSlot[], onBookSlot: (slot: BookingSlot) => void }> = ({ studio, slots, onBookSlot }) => {
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // Для мобильного выбора дня
  const calendarRef = useRef<HTMLDivElement>(null);
  const today = new Date(); today.setHours(0,0,0,0);
  const currentYear = currentDisplayDate.getFullYear();
  const currentMonth = currentDisplayDate.getMonth();
  const isMobile = useIsMobile();

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const dayCells: (number | null)[] = [];
  const startDay = (firstDayOfMonth(currentYear, currentMonth) + 6) % 7;
  for (let i = 0; i < startDay; i++) dayCells.push(null);
  for (let i = 1; i <= daysInMonth(currentYear, currentMonth); i++) dayCells.push(i);

  const availableTimesForDay = (day: number): BookingSlot[] => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return slots.filter(slot => slot.date === dateStr && slot.studioId === studio.id && !slot.isBooked);
  };
  
  const handleMonthChange = (offset: number) => {
    if (calendarRef.current) gsap.fromTo(calendarRef.current, {opacity: 0.5}, {opacity: 1, duration: 0.3});
    setCurrentDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    setSelectedDay(null); // Сброс выбора дня при смене месяца
  };

  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  useEffect(() => {
    if (calendarRef.current) gsap.fromTo(calendarRef.current, {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'});
  }, [studio, isMobile]);

  // --- Мобильная версия ---
  if (isMobile) {
    const renderTimeSection = () => {
      if (selectedDay == null) return null;
      const slotsForDay = availableTimesForDay(selectedDay);
      const currentDate = new Date(currentYear, currentMonth, selectedDay);
      const isPast = currentDate < today;
      return (
        <div className="mt-4 bg-ui-surface rounded-2xl shadow-modal p-4 border border-ui-border animate-fadeIn">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-semibold text-content-primary">Выберите время: {selectedDay} {currentDisplayDate.toLocaleString('default', { month: 'long' })}</span>
            <button onClick={() => setSelectedDay(null)} className="text-2xl text-content-subtle hover:text-content-primary px-2 py-1 rounded-full hover:bg-ui-background" aria-label="Закрыть">&times;</button>
          </div>
          {isPast && <div className="text-content-subtle text-center py-6">Этот день уже прошёл</div>}
          {!isPast && slotsForDay.length === 0 && <div className="text-content-subtle text-center py-6">Нет свободных слотов</div>}
          {!isPast && slotsForDay.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center py-2">
              {slotsForDay.map(slot => (
                <Button key={slot.time} onClick={() => { onBookSlot(slot); setSelectedDay(null); }} variant="glass" size="md" className="text-base px-4 py-2 !rounded-lg min-w-[80px]">{slot.time}</Button>
              ))}
            </div>
          )}
        </div>
      );
    };
    return (
      <div ref={calendarRef} className="mt-6 p-3 bg-ui-background rounded-2xl shadow-inner border border-ui-border" style={{ opacity: 0 }}>
        <h4 className="text-lg font-semibold mb-3 text-content-primary">Календарь бронирования</h4>
        <div className="flex justify-between items-center mb-3">
          <Button onClick={() => handleMonthChange(-1)} variant="outline" size="sm">&lt;</Button>
          <h5 className="text-base font-medium text-content-primary">
            {currentDisplayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h5>
          <Button onClick={() => handleMonthChange(1)} variant="outline" size="sm">&gt;</Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-content-secondary mb-2">
          {weekdays.map(wd => <div key={wd}>{wd}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dayCells.map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} className="border border-ui-border rounded-lg p-1 aspect-square"></div>;
            const currentDate = new Date(currentYear, currentMonth, day);
            const isPast = currentDate < today;
            const isToday = currentDate.getTime() === today.getTime();
            const hasSlots = availableTimesForDay(day).length > 0;
            return (
              <button
                key={day}
                className={`border rounded-lg aspect-square flex flex-col items-center justify-center focus:outline-none transition-all duration-100
                  ${isPast ? 'bg-slate-100 text-content-subtle cursor-not-allowed' : hasSlots ? 'bg-white hover:bg-brand-light/30 cursor-pointer' : 'bg-slate-50 text-content-subtle cursor-not-allowed'}
                  ${isToday ? 'border-brand-DEFAULT ring-1 ring-brand-DEFAULT' : 'border-ui-border'}
                  ${selectedDay === day ? 'ring-2 ring-brand-DEFAULT border-brand-DEFAULT' : ''}`}
                disabled={isPast || !hasSlots}
                onClick={() => setSelectedDay(day)}
                style={{ minHeight: 44 }}
              >
                <span className={`font-medium text-xs ${isToday ? 'text-brand-DEFAULT' : 'text-content-primary'}`}>{day}</span>
              </button>
            );
          })}
        </div>
        {renderTimeSection()}
      </div>
    );
  }

  // --- Десктопная версия ---
  return (
    <div ref={calendarRef} className="mt-6 p-4 sm:p-6 bg-ui-background rounded-2xl shadow-inner border border-ui-border" style={{ opacity: 0 }}>
      <h4 className="text-xl font-semibold mb-4 text-content-primary">Календарь бронирования</h4>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => handleMonthChange(-1)} variant="outline" size="sm">&lt;</Button>
        <h5 className="text-lg font-medium text-content-primary">
          {currentDisplayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h5>
        <Button onClick={() => handleMonthChange(1)} variant="outline" size="sm">&gt;</Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-content-secondary mb-2">
        {weekdays.map(wd => <div key={wd}>{wd}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dayCells.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} className="border border-ui-border rounded-lg p-1 aspect-square"></div>;
          const currentDate = new Date(currentYear, currentMonth, day);
          const daySlots = availableTimesForDay(day);
          const isPast = currentDate < today;
          const isToday = currentDate.getTime() === today.getTime();
          return (
            <div key={day} className={`border rounded-lg p-1.5 aspect-square flex flex-col items-center justify-start ${isPast ? 'bg-slate-100 text-content-subtle cursor-not-allowed' : 'bg-white hover:bg-brand-light/20'} ${isToday ? 'border-brand-DEFAULT ring-1 ring-brand-DEFAULT' : 'border-ui-border'}`}>
              <span className={`font-medium text-xs ${isToday ? 'text-brand-DEFAULT' : 'text-content-primary'}`}>{day}</span>
              {!isPast && daySlots.length > 0 && (
                <div className="mt-1 space-y-0.5 w-full flex flex-col items-center">
                  {daySlots.slice(0, 2).map(slot => (
                    <Button key={slot.time} onClick={() => onBookSlot(slot)} variant="glass" size="sm" className="text-[10px] !p-0.5 w-full truncate leading-tight !rounded-md">{slot.time}</Button>
                  ))}
                  {daySlots.length > 2 && <span className="text-[9px] text-brand-DEFAULT cursor-pointer" onClick={() => onBookSlot(daySlots[0])}>еще...</span>}
                </div>
              )}
              {!isPast && daySlots.length === 0 && <div className="text-[9px] text-content-subtle mt-1 text-center leading-tight">Нет слотов</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BookingForm: React.FC<{ studio: Studio, slot: BookingSlot, onClose: () => void, onSubmit: (details: {name: string, phone: string, email: string}) => void }> = ({ studio, slot, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (name && phone && email) onSubmit({name, phone, email}); };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-content-primary">Бронирование "{studio.name}"</h3>
        <p className="text-content-secondary">Дата: {new Date(slot.date + 'T00:00:00').toLocaleDateString()}, Время: {slot.time}</p>
      </div>
      <InputField label="Ваше имя" id="booking-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <InputField label="Телефон" id="booking-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7 (___) ___-__-__" />
      <InputField label="Email" id="booking-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <div className="pt-2 space-y-3">
        <Button type="submit" fullWidth variant="glass-active">{`Забронировать (${studio.hourlyRate} руб.)`}</Button>
        <Button type="button" variant="glass" onClick={onClose} fullWidth>Отмена</Button>
      </div>
      <p className="text-xs text-content-subtle text-center mt-2">Оплата будет произведена на месте или по ссылке (симуляция).</p>
    </form>
  );
};


const StudioDetail: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const calendarSectionRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foundStudio = FAKE_STUDIO_DATA_SOURCE.find(s => s.id === studioId);
    setStudio(foundStudio || null);
    if (foundStudio) {
      const now = new Date();
      setBookingSlots(generateSlotsForMonth(foundStudio.id, now.getFullYear(), now.getMonth()));
    }
  }, [studioId]);

  useEffect(() => {
    if (studio && mainContentRef.current && imagesRef.current && detailsRef.current && calendarSectionRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }});
      tl.fromTo(mainContentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(imagesRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.1")
        .fromTo(detailsRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.5")
        .fromTo(calendarSectionRef.current, { opacity:0, y:30}, {opacity:1, y:0, duration:0.5}, "-=0.3");

      const imageElements = imagesRef.current.querySelectorAll('img');
      if (imageElements.length > 1) {
        gsap.fromTo(imageElements, {opacity:0, y:20}, {opacity:1, y:0, stagger:0.15, duration:0.4, delay:0.5, ease:'power2.out'});
      }
    }
  }, [studio]);

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

  const handleBookSlot = (slot: BookingSlot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (details: {name: string, phone: string, email: string}) => {
    if (selectedSlot && studio) {
      setBookingSlots(prevSlots => 
        prevSlots.map(s => s.date === selectedSlot.date && s.time === selectedSlot.time ? { ...s, isBooked: true } : s)
      );
      setBookingMessage(`Студия "${studio.name}" успешно забронирована на ${new Date(selectedSlot.date + 'T00:00:00').toLocaleDateString()} в ${selectedSlot.time} для ${details.name}!`);
    }
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  if (!studio) {
    return <div className="text-center py-10 text-content-secondary">Студия не найдена. <Link to="/photo-studios" className="text-brand-DEFAULT hover:underline">Вернуться к списку студий</Link></div>;
  }

  return (
    <div ref={mainContentRef} className="space-y-10 md:space-y-12" style={{opacity:0}}>
      <header className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-header">
         <div className="flex items-center justify-between">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-DEFAULT tracking-tight">{studio.name}</h2>
            <Link to="/photo-studios" className="text-sm font-medium text-brand-DEFAULT hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.56l2.72 2.72a.75.75 0 11-1.06 1.06l-4-4a.75.75 0 010-1.06l4-4a.75.75 0 011.06 1.06L5.56 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                Все студии
            </Link>
        </div>
        <p className="text-lg text-content-secondary mt-1">{studio.city} - {studio.hourlyRate.toLocaleString()} руб/час</p>
      </header>

      {bookingMessage && (
        <div ref={notificationRef} className="p-4 bg-brand-light text-brand-dark rounded-xl shadow-md text-center sticky top-20 z-50" style={{opacity:0}}>
          {bookingMessage}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div ref={imagesRef} className="space-y-4" style={{opacity:0}}>
          {studio.imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`${studio.name} - ${index + 1}`} className="w-full h-auto object-cover rounded-xl shadow-lg aspect-video md:aspect-[4/3]" />
          ))}
          {studio.imageUrls.length === 0 && <div className="w-full h-auto bg-ui-border rounded-xl aspect-video flex items-center justify-center text-content-subtle">Нет изображений</div>}
        </div>

        <div ref={detailsRef} className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-card space-y-6" style={{opacity:0}}>
          <div>
            <h3 className="text-xl font-semibold text-content-primary mb-2">Описание студии</h3>
            <p className="text-content-secondary whitespace-pre-line leading-relaxed">{studio.detailedDescription || studio.description}</p>
          </div>
          
          {studio.amenities && studio.amenities.length > 0 && (
            <div className="border-t border-ui-border pt-6">
              <h3 className="text-xl font-semibold text-content-primary mb-3">Удобства</h3>
              <ul className="list-disc list-inside space-y-1 text-content-secondary pl-1">
                {studio.amenities.map(amenity => <li key={amenity}>{amenity}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div ref={calendarSectionRef} className="bg-ui-surface p-6 md:p-8 rounded-2xl shadow-card" style={{opacity:0}}>
         <CalendarView studio={studio} slots={bookingSlots} onBookSlot={handleBookSlot} />
      </div>

      {isModalOpen && selectedSlot && studio && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <BookingForm 
            studio={studio} 
            slot={selectedSlot} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleBookingSubmit}
          />
        </Modal>
      )}
    </div>
  );
};

export default StudioDetail;
