
import React, { useState, useEffect, useRef } from 'react';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import type { CartItem } from '../types';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { InputField } from './common/InputField';

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.502 0c-.34.055-.68.11-.1.022.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const ShoppingBagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
    </svg>
);


const CartItemCard: React.FC<{ item: CartItem, updateQuantity: (id: string, q: number) => void, removeFromCart: (id: string) => void }> = ({ item, updateQuantity, removeFromCart }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    const handleRemove = () => {
        if (itemRef.current) {
            gsap.to(itemRef.current, { 
                opacity: 0, 
                x: -50, 
                height: 0, 
                padding: 0,
                margin: 0,
                duration: 0.4, 
                ease: 'power2.in',
                onComplete: () => removeFromCart(item.id)
            });
        } else {
            removeFromCart(item.id);
        }
    };
    
    return (
        <div ref={itemRef} className="cart-item-card flex items-start space-x-4 bg-ui-surface p-4 rounded-2xl shadow-card" style={{ overflow: 'hidden' }}>
            <Link to={`/flowers/${item.id}`}>
                <img src={item.imageUrls[0]} alt={item.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
            </Link>
            <div className="flex-grow">
                <h3 className="font-semibold text-content-primary text-base leading-tight mb-1">
                    <Link to={`/flowers/${item.id}`} className="hover:text-brand-DEFAULT transition-colors">{item.name}</Link>
                </h3>
                <p className="text-sm text-content-secondary">{item.price.toLocaleString()} руб.</p>
                <div className="flex items-center space-x-2 mt-3">
                    <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium sr-only">Количество</label>
                    <input 
                        type="number" 
                        id={`quantity-${item.id}`}
                        value={item.quantity} 
                        min="1" 
                        max="20"
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="w-16 p-1.5 border border-ui-border rounded-md text-center text-sm focus:ring-1 focus:ring-ui-ring focus:border-ui-ring"
                        aria-label={`Количество для ${item.name}`}
                    />
                     <Button onClick={handleRemove} variant="ghost" size="sm" className="!px-2 !py-2" aria-label={`Удалить ${item.name}`}>
                        <TrashIcon className="w-5 h-5 text-content-subtle hover:text-red-500 transition-colors"/>
                    </Button>
                </div>
            </div>
            <p className="text-lg font-bold text-content-primary ml-auto whitespace-nowrap">
                {(item.price * item.quantity).toLocaleString()} руб.
            </p>
        </div>
    );
};


export const CartPage: React.FC = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, itemCount } = useShoppingCart();
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const pageRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const page = pageRef.current;
        if (page) {
            const header = page.querySelector('.cart-header');
            const cards = gsap.utils.toArray('.cart-item-card', page);
            const summary = page.querySelector('.summary-card');
            
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            if (header) tl.fromTo(header, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 });
            if (cards.length > 0) tl.fromTo(cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, "-=0.4");
            if (summary) tl.fromTo(summary, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
        }
    }, [cart]); // Rerun animation if cart items change (e.g. from empty to not-empty)

    useEffect(() => {
        if (checkoutMessage && notificationRef.current) {
            gsap.fromTo(notificationRef.current, {opacity:0, y: -20, scale: 0.95}, {opacity:1, y:0, scale:1, duration:0.4, ease: 'back.out(1.7)'});
            const timer = setTimeout(() => {
                if(notificationRef.current) {
                    gsap.to(notificationRef.current, {opacity:0, y: -20, scale:0.95, duration:0.4, ease: 'power2.in', onComplete: () => setCheckoutMessage(null)});
                } else {
                    setCheckoutMessage(null);
                }
            }, 4600);
            return () => clearTimeout(timer);
        }
    }, [checkoutMessage]);

    const handleCheckout = () => {
        setIsCheckoutModalOpen(true);
    };

    const processCheckout = () => {
        setCheckoutMessage(`Ваш заказ на сумму ${totalPrice.toLocaleString()} руб. успешно оформлен!`);
        clearCart();
        setIsCheckoutModalOpen(false);
        setTimeout(() => navigate('/flowers'), 3000); 
    };
    
    if (itemCount === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-[60vh]">
                <ShoppingBagIcon className="w-24 h-24 text-content-subtle mb-6" />
                <h1 className="text-2xl font-bold text-content-primary mb-2">Ваша корзина пуста</h1>
                <p className="text-content-secondary mb-6">Самое время добавить что-нибудь прекрасное!</p>
                <Link to="/flowers">
                    <Button variant="primary" size="lg">Перейти в магазин</Button>
                </Link>
            </div>
        );
    }
    
    return (
        <div ref={pageRef} className="space-y-8">
             {checkoutMessage && (
                <div ref={notificationRef} className="p-4 bg-brand-light text-brand-dark rounded-xl shadow-md text-center sticky top-20 z-50" style={{opacity:0}}>
                {checkoutMessage}
                </div>
            )}
            <header className="cart-header" style={{opacity: 0}}>
                <h1 className="text-4xl font-bold text-brand-DEFAULT tracking-tight">Ваша корзина</h1>
                <p className="text-lg text-content-secondary mt-1">
                    У вас {itemCount} товар(а) на общую сумму {totalPrice.toLocaleString()} руб.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map(item => (
                        <CartItemCard 
                            key={item.id} 
                            item={item} 
                            updateQuantity={updateQuantity} 
                            removeFromCart={removeFromCart}
                        />
                    ))}
                </div>
                <aside className="lg:col-span-1 mt-6 lg:mt-0">
                    <div className="summary-card sticky top-24 space-y-4 bg-ui-surface p-6 rounded-2xl shadow-card" style={{opacity: 0}}>
                        <h2 className="text-2xl font-semibold text-content-primary">Итого</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-content-secondary">{itemCount} товар(а)</span>
                                <span>{totalPrice.toLocaleString()} руб.</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-content-secondary">Доставка</span>
                                <span className="font-medium text-green-600">Бесплатно</span>
                            </div>
                        </div>
                        <div className="border-t border-ui-border pt-4 mt-4 flex justify-between items-baseline">
                            <span className="text-lg font-bold text-content-primary">К оплате:</span>
                            <span className="text-2xl font-bold text-brand-DEFAULT">{totalPrice.toLocaleString()} руб.</span>
                        </div>
                        <Button onClick={handleCheckout} size="lg" variant="primary" fullWidth className="mt-4">
                            Перейти к оформлению
                        </Button>
                    </div>
                </aside>
            </div>

            <Modal isOpen={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)}>
                <div className="p-2">
                    <h3 className="text-xl font-semibold text-content-primary mb-2 text-center">Оформление заказа</h3>
                    <p className="text-content-secondary mb-6 text-center">Сумма к оплате: <strong className="text-brand-DEFAULT">{totalPrice.toLocaleString()} руб.</strong></p>
                    <form onSubmit={(e) => { e.preventDefault(); processCheckout(); }} className="space-y-4">
                        <InputField label="Имя получателя" id="checkout-name" defaultValue="Тест Тестович" required />
                        <InputField label="Телефон получателя" id="checkout-phone" type="tel" defaultValue="+7 (999) 123-45-67" required />
                        <InputField label="Адрес доставки (или 'Самовывоз')" id="checkout-address" defaultValue="г. Енакиево, ул. Примерная, 1" required />
                        
                        <div className="pt-4 space-y-3">
                            <Button type="submit" fullWidth size="lg" variant="glass-active">Оплатить (симуляция)</Button>
                            <Button type="button" variant="glass" onClick={() => setIsCheckoutModalOpen(false)} fullWidth>Вернуться в корзину</Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};