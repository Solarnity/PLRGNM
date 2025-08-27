import { useRef, useEffect, useState } from 'react';

const BuzzText = ({ 
  children,
  as: Tag = 'div', 
  className = '', 
  active = true,
  randomActivation = false,
  activationInterval = 0,
  intensity = 0.5,
  glowDuration = 1000 // Duración del brillo inicial en ms
}) => {
  const containerRef = useRef(null);
  const originalRef = useRef(null);
  const [isActive, setIsActive] = useState(active);
  const [showGlow, setShowGlow] = useState(false);
  const intervalRef = useRef(null);
  const glowTimeoutRef = useRef(null);

  useEffect(() => {
    // Configurar activación aleatoria o por intervalo
    if (randomActivation && activationInterval > 0) {
      intervalRef.current = setInterval(() => {
        setIsActive(Math.random() > 0.5);
      }, activationInterval);
    } else if (activationInterval > 0) {
      intervalRef.current = setInterval(() => {
        setIsActive(prev => !prev);
      }, activationInterval);
    } else {
      setIsActive(active);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current);
      }
    };
  }, [active, randomActivation, activationInterval]);

  // Efecto para manejar el brillo inicial
  useEffect(() => {
    if (isActive) {
      setShowGlow(true);
      glowTimeoutRef.current = setTimeout(() => {
        setShowGlow(false);
      }, glowDuration);
    } else {
      setShowGlow(false);
    }

    return () => {
      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current);
      }
    };
  }, [isActive, glowDuration]);

  // Efecto para aplicar el efecto buzz cuando está activo
  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    
    // Limpiar cualquier contenido previo
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    // Calcular valores basados en la intensidad
    const blurAmount = Math.max(0.5, intensity * 2);
    const opacityValue = 0.1 + (intensity * 0.4);
    
    // Crear capas de texto para el efecto
    for (let i = 0; i < 3; i++) {
      const layer = document.createElement('div');
      layer.innerHTML = originalRef.current.innerHTML;
      layer.className = 'absolute top-0 left-0 w-full h-full';
      layer.style.pointerEvents = 'none';
      
      // Aplicar diferentes estilos a cada capa
      if (i === 0) {
        // Capa de blur rojo
        layer.style.filter = `blur(${blurAmount}px)`;
        layer.style.color = `rgba(255, 0, 0, ${opacityValue})`;
        layer.style.animation = 'blur_30ms_infinite, jerk_50ms_infinite';
      } else if (i === 1) {
        // Capa de blur azul
        layer.style.filter = `blur(${blurAmount}px)`;
        layer.style.color = `rgba(0, 0, 255, ${opacityValue})`;
        layer.style.animation = 'blur_30ms_infinite, jerk_50ms_infinite';
        layer.style.animationDelay = '10ms';
      } else {
        // Capa principal (visible)
        layer.style.color = 'currentColor';
        if (showGlow) {
          layer.style.filter = `blur(${blurAmount/2}px)`;
          layer.style.opacity = '0.8';
        }
      }
      
      containerRef.current.appendChild(layer);
    }
  }, [isActive, intensity, showGlow]);

  return (
    <Tag className={`buzz-text-container relative inline-block ${className}`}>
      {/* Contenedor para el contenido original (siempre visible para mantener espacio) */}
      <div 
        ref={originalRef} 
        className="inline-block"
        style={{ visibility: isActive ? 'hidden' : 'visible' }}
      >
        {children}
      </div>
      
      {/* Contenedor para las capas de efecto (visible solo cuando está activo) */}
      {isActive && (
        <div 
          ref={containerRef} 
          className="absolute top-0 left-0 w-full h-full animate-[jerkwhole_5s_infinite]"
          style={{ 
            filter: showGlow ? `brightness(1.5) contrast(1.2)` : 'none',
            transition: 'filter 300ms ease-out'
          }}
        />
      )}
    </Tag>
  );
};

export default BuzzText;