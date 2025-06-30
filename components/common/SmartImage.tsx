import React, { useState } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string; // путь к PNG/JPG
  webp?: string; // путь к WebP (если есть)
  blur?: string; // путь к миниатюре для blur-up (если есть)
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SmartImage: React.FC<SmartImageProps> = ({ src, webp, blur, alt, className = '', style, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', ...style }} className={className}>
      {blur && (
        <img
          src={blur}
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(16px) saturate(1.2)',
            opacity: loaded ? 0 : 1,
            transition: 'opacity 0.4s',
            zIndex: 1,
          }}
        />
      )}
      <picture>
        {webp && <source srcSet={webp} type="image/webp" />}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s',
            position: 'relative',
            zIndex: 2,
          }}
          {...rest}
        />
      </picture>
    </div>
  );
}; 