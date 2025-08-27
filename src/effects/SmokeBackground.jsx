// src/components/SmokeBackground.jsx

import React, { useEffect, useRef } from "react";
import smokeImageSource from "/smoke.webp";

const SmokeBackground = ({
  classes = "bg-gradient-to-r from-chestnut from-20% to-blackbean",
  smokeColor = "#330B0B",
  numParticles = 20,
  minSize = 500,
  maxSize = 3000,
  minOpacity = 0.1,
  maxOpacity = 0.8,
  minDuration = 10000, // Duración mínima en ms
  maxDuration = 20000, // Duración máxima en ms
  rotationSpeed = 0.002,
  fps = 24,
  canvasOpacity = 100,
  enableAnimation = true,
  direction = "right",
  origin = "random",
  movementIntensity = 1.0,
  fadeInOut = true // Si las partículas deben aparecer y desaparecer suavemente
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const imageRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const fpsInterval = 1000 / fps;
    let then = Date.now();

    // Verificar si se debe reducir el movimiento
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches && !enableAnimation) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight + 100;
    };

    // Función para calcular posición inicial según el origen
    const getInitialPosition = (canvasWidth, canvasHeight) => {
      let x, y;
      
      switch (origin) {
        case 'left':
          x = -canvasWidth * 0.8;
          y = Math.random() * canvasHeight - canvasHeight / 2;
          break;
        case 'right':
          x = canvasWidth * 0.8;
          y = Math.random() * canvasHeight - canvasHeight / 2;
          break;
        case 'top':
          x = Math.random() * canvasWidth - canvasWidth / 2;
          y = -canvasHeight * 0.8;
          break;
        case 'bottom':
          x = Math.random() * canvasWidth - canvasWidth / 2;
          y = canvasHeight * 0.8;
          break;
        case 'center':
          x = Math.random() * canvasWidth * 0.4 - canvasWidth * 0.2;
          y = Math.random() * canvasHeight * 0.4 - canvasHeight * 0.2;
          break;
        case 'random':
        default:
          x = Math.random() * canvasWidth - canvasWidth;
          y = Math.random() * canvasHeight - canvasHeight / 2;
          break;
      }
      
      return { x, y };
    };

    // Clase de partícula con duración y opacidad relacionadas
    class Particle {
      constructor(image) {
        this.image = image;
        const { x, y } = getInitialPosition(canvas.width, canvas.height);
        this.x = x;
        this.y = y;
        this.size = Math.random() * (maxSize - minSize) + minSize;
        
        // Duración y opacidad relacionadas
        this.totalDuration = Math.random() * (maxDuration - minDuration) + minDuration;
        this.elapsedTime = 0;
        this.initialOpacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
        this.currentOpacity = fadeInOut ? 0 : this.initialOpacity;
        this.fadeProgress = 0; // 0 a 1 para controlar fade in/out
        
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * rotationSpeed;
        this.isAlive = true;
        
        // Configurar dirección de movimiento
        this.setMovementDirection();
      }
      
      setMovementDirection() {
        // Velocidad base ajustada por intensidad
        const baseSpeed = 0.5 * movementIntensity;
        
        switch (direction) {
          case 'right':
            this.speedX = Math.random() * baseSpeed + baseSpeed * 0.5;
            this.speedY = (Math.random() - 0.5) * baseSpeed * 0.5;
            break;
          case 'left':
            this.speedX = -(Math.random() * baseSpeed + baseSpeed * 0.5);
            this.speedY = (Math.random() - 0.5) * baseSpeed * 0.5;
            break;
          case 'top':
            this.speedX = (Math.random() - 0.5) * baseSpeed * 0.5;
            this.speedY = -(Math.random() * baseSpeed + baseSpeed * 0.5);
            break;
          case 'bottom':
            this.speedX = (Math.random() - 0.5) * baseSpeed * 0.5;
            this.speedY = Math.random() * baseSpeed + baseSpeed * 0.5;
            break;
          default:
            this.speedX = Math.random() * baseSpeed - baseSpeed * 0.5;
            this.speedY = Math.random() * baseSpeed - baseSpeed * 0.5;
        }
      }
      
      update(deltaTime) {
        if (!this.isAlive) return;
        
        this.elapsedTime += deltaTime;
        this.rotation += this.rotationSpeed;
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Calcular progreso de vida (0 a 1)
        const lifeProgress = Math.min(1, this.elapsedTime / this.totalDuration);
        
        // Gestionar fade in/out si está habilitado
        if (fadeInOut) {
          if (lifeProgress < 0.2) {
            // Fade in durante los primeros 20% de la vida
            this.fadeProgress = lifeProgress / 0.2;
          } else if (lifeProgress > 0.8) {
            // Fade out durante los últimos 20% de la vida
            this.fadeProgress = 1 - ((lifeProgress - 0.8) / 0.2);
          } else {
            // Opacidad completa durante el 60% central
            this.fadeProgress = 1;
          }
          
          this.currentOpacity = this.initialOpacity * this.fadeProgress;
        } else {
          // Sin fade, opacidad constante hasta el final
          this.currentOpacity = this.initialOpacity;
        }
        
        // Comprobar si la partícula debe morir
        if (this.elapsedTime >= this.totalDuration || this.currentOpacity <= 0.01) {
          this.isAlive = false;
        }
        
        // Reposicionar partículas que salen completamente del canvas
        const margin = 200;
        const isOffscreen = 
          this.x + this.size < -margin || 
          this.x - this.size > canvas.width + margin ||
          this.y + this.size < -margin || 
          this.y - this.size > canvas.height + margin;
        
        if (isOffscreen) {
          this.isAlive = false;
        }
      }
      
      draw() {
        if (!this.isAlive || this.currentOpacity <= 0.01) return;
        
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.currentOpacity;

        // Dibuja la imagen original de humo
        ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);

        // Superpone un color sólido encima de la imagen
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = smokeColor;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

        ctx.restore();
      }
      
      // Método para reiniciar la partícula
      reset() {
        const { x, y } = getInitialPosition(canvas.width, canvas.height);
        this.x = x;
        this.y = y;
        this.totalDuration = Math.random() * (maxDuration - minDuration) + minDuration;
        this.elapsedTime = 0;
        this.initialOpacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
        this.currentOpacity = fadeInOut ? 0 : this.initialOpacity;
        this.fadeProgress = 0;
        this.rotation = Math.random() * Math.PI * 2;
        this.isAlive = true;
        this.setMovementDirection();
      }
    }

    const init = (loadedImage) => {
      particlesRef.current = [];
      for (let i = 0; i < numParticles; i++) {
        particlesRef.current.push(new Particle(loadedImage));
      }
    };

    const handleParticles = (deltaTime) => {
      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let particlesToRecycle = 0;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i];
        
        if (particle.isAlive) {
          particle.update(deltaTime);
          particle.draw();
        } else {
          particlesToRecycle++;
          // Reutilizar partícula en lugar de crear una nueva
          particle.reset();
        }
      }
    };

    const animate = (currentTime) => {
      rafRef.current = requestAnimationFrame(animate);
      const now = Date.now();
      const elapsed = now - then;
      
      if (elapsed > fpsInterval) {
        const deltaTime = elapsed;
        then = now - (elapsed % fpsInterval);
        handleParticles(deltaTime);
      }
    };

    // Carga de la imagen de humo y inicio de la animación
    if (!imageRef.current) {
      imageRef.current = new Image();
      imageRef.current.onload = () => {
        resizeCanvas();
        init(imageRef.current);
        if (enableAnimation && !reducedMotionQuery.matches) {
          then = Date.now();
          animate();
        } else {
          // Si la animación está deshabilitada, solo dibujar una vez
          handleParticles(0);
        }
      };
      imageRef.current.src = smokeImageSource;
    } else {
      // Si la imagen ya está cargada, solo reiniciar
      resizeCanvas();
      init(imageRef.current);
      if (enableAnimation && !reducedMotionQuery.matches) {
        then = Date.now();
        animate();
      } else {
        handleParticles(0);
      }
    }

    const handleResize = () => {
      resizeCanvas();
      // Recalcular posiciones basadas en el nuevo tamaño
      for (let i = 0; i < particlesRef.current.length; i++) {
        const { x, y } = getInitialPosition(canvas.width, canvas.height);
        particlesRef.current[i].x = x;
        particlesRef.current[i].y = y;
      }
      handleParticles(0);
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [
    smokeColor, 
    numParticles, 
    minSize, 
    maxSize, 
    minOpacity, 
    maxOpacity, 
    minDuration,
    maxDuration,
    rotationSpeed, 
    fps, 
    enableAnimation,
    direction,
    origin,
    movementIntensity,
    fadeInOut
  ]);

  // Convertir el valor de opacidad a formato CSS válido
  const canvasOpacityValue = canvasOpacity / 100;

  return (
    <div 
      id="smoke-bkg" 
      className={`fixed top-0 -z-10 h-full w-full ${classes}`}
    >
      <canvas
        id="smoke-canvas"
        ref={canvasRef}
        style={{ opacity: canvasOpacityValue }}
      >
      </canvas>
    </div>
  );
};

export default SmokeBackground;