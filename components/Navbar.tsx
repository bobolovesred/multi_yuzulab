import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { MdShoppingCart } from 'react-icons/md';

const Bars3Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useShoppingCart();
  
  const drawerContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerContentRef = useRef<HTMLDivElement>(null);
  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const drawerElement = drawerContainerRef.current;
    const overlayElement = overlayRef.current;
    const drawerContentElement = drawerContentRef.current;

    if (!drawerElement || !overlayElement || !drawerContentElement) return;

    if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
        drawerElement.removeAttribute('inert');
        drawerElement.setAttribute('aria-hidden', 'false');
        drawerElement.style.display = 'block'; 

        if (animationTimelineRef.current) animationTimelineRef.current.kill();
        
        animationTimelineRef.current = gsap.timeline();
        animationTimelineRef.current
            .to(overlayElement, { opacity: 1, duration: 0.3, ease: 'power2.inOut' })
            .to(drawerContentElement, { x: '0%', duration: 0.3, ease: 'power2.out' }, "-=0.2");

    } else { 
        document.body.style.overflow = 'unset';
        if (drawerElement) {
            drawerElement.setAttribute('inert', 'true'); 
            drawerElement.setAttribute('aria-hidden', 'true');
        }

        if (animationTimelineRef.current) {
            animationTimelineRef.current.reverse().then(() => {
                if (drawerElement && !isMobileMenuOpen) { 
                    drawerElement.style.display = 'none';
                }
            });
        } else {
             if (drawerElement) {
                drawerElement.style.display = 'none';
            }
        }
    }

    return () => { 
      document.body.style.overflow = 'unset';
      if (animationTimelineRef.current) {
        animationTimelineRef.current.kill();
      }
    };
  }, [isMobileMenuOpen]);


  const navLinks = [
    { to: "/", text: "Главная" },
    { to: "/photo-studios", text: "Фотостудии" },
    { to: "/flowers", text: "Цветы" },
    { to: "/photobooks", text: "Фотокниги" },
    { to: "/master-classes", text: "Мастер-классы" },
  ];
  
  const handleProfileClick = () => {
    navigate('/profile');
  };

  const showCartIcon = location.pathname.startsWith('/flowers') || location.pathname.startsWith('/cart');

  return (
    <>
      <nav 
        className="bg-ui-surface/80 backdrop-blur-md shadow-md sticky top-0 z-40 w-full"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Group: Burger for mobile, Logo for desktop */}
            <div className="flex items-center">
                {/* Mobile Burger */}
                <div className="md:hidden">
                    <button 
                      onClick={openMobileMenu} 
                      aria-label="Открыть меню" 
                      aria-expanded={isMobileMenuOpen}
                      aria-controls="mobile-drawer-menu"
                      className="p-2 -ml-2 text-content-primary hover:text-brand-dark hover:bg-brand-light/30 rounded-full transition-all"
                    >
                      <Bars3Icon className="h-7 w-7" />
                    </button>
                </div>
                {/* Desktop Logo */}
                <div className="hidden md:block">
                     <Link to="/" className="text-xl font-semibold text-brand-DEFAULT hover:text-brand-dark transition-colors">
                        ЛОГО {/* Placeholder for actual logo */}
                     </Link>
                </div>
            </div>

            {/* Center: Mobile Logo (only shown on mobile if Burger is on the left) */}
            <div className="md:hidden">
                <Link to="/" className="text-lg font-semibold text-brand-DEFAULT hover:text-brand-dark transition-colors">
                    ЛОГО
                </Link>
            </div>

            {/* Right Group: Nav links and Icons */}
            <div className="flex items-center">
                {/* Desktop Nav and Icons */}
                <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
                    <nav className="flex items-center space-x-5 lg:space-x-7">
                        {navLinks.map(link => (
                            <Link 
                                key={link.to} 
                                to={link.to} 
                                className="text-sm font-medium text-content-primary hover:text-brand-dark transition-colors"
                            >
                                {link.text}
                            </Link>
                        ))}
                    </nav>
                     <div className="flex items-center space-x-3">
                        <button 
                          onClick={handleProfileClick}
                          aria-label="Профиль пользователя" 
                          className="p-1.5 rounded-full text-content-primary hover:text-brand-dark hover:bg-brand-light/30 focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT focus:ring-offset-2 focus:ring-offset-ui-surface transition-colors"
                        >
                            <UserCircleIcon className="h-6 w-6" />
                        </button>
                        {showCartIcon && (
                           <button 
                              onClick={() => navigate('/cart')}
                              aria-label={`Корзина, ${itemCount} товаров`} 
                              className="relative p-1.5 rounded-full text-content-primary hover:text-brand-dark hover:bg-brand-light/30 focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT focus:ring-offset-2 focus:ring-offset-ui-surface transition-colors"
                            >
                                <MdShoppingCart className="h-6 w-6" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-white text-[10px] font-bold ring-2 ring-ui-surface">
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
                {/* Mobile Icons */}
                <div className="md:hidden flex items-center space-x-1">
                   {showCartIcon && (
                      <button 
                          onClick={() => navigate('/cart')}
                          aria-label={`Корзина, ${itemCount} товаров`}
                          className="relative p-2 text-content-primary hover:text-brand-dark hover:bg-brand-light/30 rounded-full transition-all"
                      >
                          <MdShoppingCart className="h-7 w-7" />
                           {itemCount > 0 && (
                               <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-white text-[10px] font-bold ring-2 ring-ui-surface">
                                   {itemCount}
                               </span>
                           )}
                      </button>
                   )}
                   <button 
                      onClick={handleProfileClick}
                      aria-label="Профиль пользователя" 
                      className="p-2 -mr-2 text-content-primary hover:text-brand-dark hover:bg-brand-light/30 rounded-full transition-all"
                    >
                        <UserCircleIcon className="h-7 w-7" />
                    </button>
                </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div 
        id="mobile-drawer-menu"
        ref={drawerContainerRef} 
        className="fixed inset-0 z-50 md:hidden"
        style={{ display: 'none' }} 
        aria-hidden={!isMobileMenuOpen} 
        role="dialog"
        aria-modal="true"
      >
        <div 
          ref={overlayRef} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
          style={{ opacity: 0 }}
          onClick={closeMobileMenu}
          aria-label="Закрыть меню (фон)"
        ></div>
        
        <div 
          ref={drawerContentRef} 
          className="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-ui-surface/90 backdrop-blur-lg shadow-2xl p-6 transform -translate-x-full flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-semibold text-content-primary">Меню</span>
            <button onClick={closeMobileMenu} aria-label="Закрыть меню (кнопка)" className="p-2 -mr-2 text-content-primary hover:text-brand-dark">
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
          <nav className="flex flex-col space-y-2 flex-grow">
            {navLinks.map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                onClick={closeMobileMenu} 
                className="text-lg text-content-primary hover:text-brand-DEFAULT hover:bg-brand-light/50 rounded-md py-2.5 px-3 transition-colors duration-150"
              >
                {link.text}
              </Link>
            ))}
            {/* Profile Link in Drawer */}
            <div className="mt-auto pt-4 border-t border-ui-border">
                <Link
                    to="/profile" 
                    onClick={closeMobileMenu}
                    className="flex items-center text-lg text-content-primary hover:text-brand-DEFAULT hover:bg-brand-light/50 rounded-md py-2.5 px-3 transition-colors duration-150"
                    aria-label="Перейти в профиль пользователя"
                >
                    <UserCircleIcon className="h-6 w-6 mr-3" />
                    Профиль
                </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};