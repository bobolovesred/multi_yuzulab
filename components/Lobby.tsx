import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const services = [
  { 
    id: 'photo-studios', 
    name: 'Фотостудии', 
    path: '/photo-studios', 
  },
  { 
    id: 'flowers', 
    name: 'Цветы', 
    path: '/flowers', 
  },
  { 
    id: 'photobooks', 
    name: 'Фотокниги', 
    path: '/photobooks', 
  },
  { 
    id: 'master-classes', 
    name: 'Мастер-классы', 
    path: '/master-classes', 
  },
];

export const Lobby: React.FC = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainEl = mainContentRef.current;
    if (!mainEl) return;

    // Use gsap.context for proper cleanup in React
    const ctx = gsap.context(() => {
      const headerTitle = mainEl.querySelector('h1');
      const headerSubtitle = mainEl.querySelector('p');
      const serviceItems = gsap.utils.toArray<Element>(mainEl.querySelectorAll('nav > div'));

      const tl = gsap.timeline({
        defaults: { duration: 0.5, ease: 'power2.out' },
      });
      
      if (headerTitle) {
        tl.from(headerTitle, { autoAlpha: 0, scale: 0.96, duration: 0.6 });
      }

      if (headerSubtitle) {
        // Starts 0.2s after the previous animation (the title) begins
        tl.from(headerSubtitle, { autoAlpha: 0, y: 10 }, "<0.2");
      }
      
      if (serviceItems.length > 0) {
        // Start the service items animation at t=0.4s for a smooth cascade
        const listStartTime = 0.4;
        // Animate each item sequentially with a 0.15s interval
        serviceItems.forEach((item, index) => {
            tl.from(item, { autoAlpha: 0, y: 20 }, listStartTime + (index * 0.15));
        });
      }
      
    }, mainContentRef);

    // Cleanup function
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#F9F9F7] text-[#1D1D1F] font-sans flex flex-col min-h-screen w-full overflow-hidden">
      
      {/* The main content wrapper, vertically centered and horizontally padded */}
      <div ref={mainContentRef} className="w-full flex-grow flex flex-col justify-center px-[10vw] py-16">
        
        <header className="mb-10 md:mb-14">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] tracking-tight">Ракурс</h1>
            <p className="text-sm md:text-base text-content-secondary mt-1">Фото | Цветы | Книги | События</p>
        </header>
        
        <main>
          <nav className="flex flex-col space-y-2 md:space-y-1 lg:space-y-2">
            {services.map((service) => (
              <div key={service.id}>
                <Link
                  to={service.path}
                  className="group inline-block py-1 md:py-2"
                  aria-label={service.name}
                >
                  <span className="
                    text-[10vw] sm:text-[9vw] md:text-[8vw] lg:text-[7vw]
                    font-bold leading-tight tracking-tighter
                    transition-colors duration-300 ease-in-out
                    group-hover:text-[#004643]
                  ">
                    {service.name}
                  </span>
                </Link>
              </div>
            ))}
          </nav>
        </main>
      </div>
    </div>
  );
};