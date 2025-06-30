import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from './common/Button';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';

// Mock data
const user = {
    name: 'Тест Тестович',
    email: 'test.user@example.com',
    phone: '+7 (999) 123-45-67',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
};

const ProfileSectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string; action?: React.ReactNode }> = ({ title, children, className = '', action }) => (
    <div className={`profile-card bg-ui-surface p-6 rounded-2xl shadow-card flex flex-col ${className}`} style={{ opacity: 0 }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-content-primary">{title}</h2>
        {action}
      </div>
      <div className="flex-grow space-y-3">
        {children}
      </div>
    </div>
);


export const ProfilePage: React.FC = () => {
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const page = pageRef.current;
        if (page) {
            const header = page.querySelector('.profile-header');
            const cards = gsap.utils.toArray('.profile-card');
            
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            if (header) {
                tl.fromTo(header, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 });
            }
            if (cards.length > 0) {
                tl.fromTo(cards, 
                    { opacity: 0, y: 30 }, 
                    { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, 
                    "-=0.4"
                );
            }
        }
    }, []);

    return (
        <div ref={pageRef} className="max-w-7xl mx-auto space-y-8 md:space-y-10">
            {/* Header Section */}
            <header className="profile-header bg-ui-surface p-6 sm:p-8 rounded-2xl shadow-card flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6" style={{ opacity: 0 }}>
                <img src={user.avatarUrl} alt="User Avatar" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md border-4 border-white" />
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-content-primary text-center sm:text-left">{user.name}</h1>
                    <p className="text-content-secondary text-center sm:text-left">{user.email}</p>
                </div>
            </header>

            {/* Main Content Grid - Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                
                <ProfileSectionCard title="Мои Заказы" className="md:col-span-2">
                    <p className="text-sm text-content-secondary">Здесь будет отображаться история ваших заказов.</p>
                     {/* Mock order items */}
                    <div className="p-3 border border-ui-border rounded-lg bg-ui-background hover:border-brand-DEFAULT/50 transition-colors cursor-pointer">
                        <p className="font-semibold text-content-primary text-sm">Заказ #2024-A58B</p>
                        <p className="text-xs">от 15 июля 2024 - <span className="text-green-600 font-medium">Доставлен</span></p>
                    </div>
                    <div className="p-3 border border-ui-border rounded-lg bg-ui-background hover:border-brand-DEFAULT/50 transition-colors cursor-pointer">
                        <p className="font-semibold text-content-primary text-sm">Заказ #2024-A47C</p>
                        <p className="text-xs">от 11 июля 2024 - <span className="text-green-600 font-medium">Доставлен</span></p>
                    </div>
                </ProfileSectionCard>

                <ProfileSectionCard title="Личные данные">
                    <div className="space-y-1 text-sm">
                        <p><strong className="font-medium text-content-secondary">Имя:</strong> {user.name}</p>
                        <p><strong className="font-medium text-content-secondary">Email:</strong> {user.email}</p>
                        <p><strong className="font-medium text-content-secondary">Телефон:</strong> {user.phone}</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full sm:w-auto">Редактировать</Button>
                </ProfileSectionCard>

                <ProfileSectionCard title="Адреса доставки">
                     <p className="text-sm text-content-secondary">Сохраненные адреса для быстрой доставки.</p>
                    <div className="p-3 border border-ui-border rounded-lg bg-ui-background">
                        <p className="font-semibold text-content-primary text-sm">Основной</p>
                        <p className="text-xs">г. Енакиево, ул. Ленина, д. 10, кв. 5</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full sm:w-auto">Добавить новый адрес</Button>
                </ProfileSectionCard>
                
                <ProfileSectionCard title="Настройки" className="md:col-span-2">
                    <div className="space-y-4">
                        <a href="#" className="block text-brand-DEFAULT hover:underline font-medium">Уведомления</a>
                        <a href="#" className="block text-brand-DEFAULT hover:underline font-medium">Сменить пароль</a>
                         <div className="!mt-6 pt-4 border-t border-ui-border">
                            <Button 
                                variant="outline" 
                                className="w-full sm:w-auto !border-red-500/50 !text-red-600 hover:!bg-red-500/10 hover:!text-red-700"
                            >
                                <HiOutlineArrowRightOnRectangle className="w-5 h-5 mr-2" />
                                Выйти из аккаунта
                            </Button>
                        </div>
                    </div>
                </ProfileSectionCard>

            </div>
        </div>
    );
};
