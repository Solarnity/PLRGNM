import React, { useRef, useEffect } from 'react';
import bgImage from '/bg1.jpg';

const DistortedImage = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;
    
    // Asegurarse de que la imagen esté cargada
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Función de animación
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const time = Date.now() * 0.005;
        const amplitude = 25; // Amplitud de las ondas
        const frequency = 0.002; // Frecuencia de las ondas
        
        // Dibujar la imagen con distorsión
        for (let y = 0; y < canvas.height; y += 2) {
          // Calcular desplazamiento horizontal usando función seno
          const displacement = Math.sin(y * frequency + time) * amplitude;
          
          // Dibujar una línea horizontal desplazada
          ctx.drawImage(
            image,
            0, y, canvas.width, 1, // Recorte de la imagen original
            displacement, y, canvas.width, 1 // Posición y tamaño en el canvas
          );
        }
        
        requestAnimationFrame(animate);
      };
      
      animate();
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-900 p-4">
      {/* Imagen oculta que usaremos como fuente */}
      <img 
        ref={imageRef} 
        src={bgImage} 
        alt="Original" 
        className="hidden"
        crossOrigin="anonymous"
      />
      
      {/* Canvas donde dibujaremos la imagen distorsionada */}
      <canvas 
        ref={canvasRef} 
        className="border-2 border-blue-400 rounded-lg shadow-2xl"
      />
      
      {/* Efecto de brillo para mejorar el resultado */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-full max-w-4xl h-0 pb-[56.25%] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-600/10 mix-blend-overlay rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default DistortedImage;