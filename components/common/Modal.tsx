
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
      
      if (modalRef.current && contentRef.current) {
        modalRef.current.style.display = 'flex'; // Make it visible before animation
        timelineRef.current = gsap.timeline({
            onReverseComplete: () => {
                if (modalRef.current) modalRef.current.style.display = 'none';
            }
        })
          .fromTo(modalRef.current, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.3, ease: 'power2.inOut' }
          )
          .fromTo(contentRef.current, 
            { opacity: 0, scale: 0.95, y: -20 }, 
            { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 
            "-=0.2" // Start slightly after backdrop
          );
      }
    } else {
      if (timelineRef.current) {
        timelineRef.current.reverse();
      }
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isOpen, onClose]);


  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] items-center justify-center p-4" 
      style={{ display: 'none' }} // Initially hidden, GSAP controls visibility
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div 
        ref={contentRef}
        className="bg-ui-surface rounded-2xl shadow-modal p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        {(title || onClose) && (
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            {title && <h3 id="modal-title" className="text-xl sm:text-2xl font-semibold text-content-primary">{title}</h3>}
            <button 
              onClick={onClose} 
              className="text-content-subtle hover:text-content-primary transition-colors text-2xl leading-none -mt-1 -mr-1 p-1 rounded-full hover:bg-ui-background"
              aria-label="Закрыть модальное окно"
            >
              &times;
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
