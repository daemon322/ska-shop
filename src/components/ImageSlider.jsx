import { useState, useEffect } from "react";
import imageInfo from "../data/imageInfo";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

const promotionalTexts = [
  "Explore our exclusive collection!",
  "Unmatched quality for every style.",
  "Grab your perfect fit today!",
  "Special discounts available now.",
  "Nuevos Productos cada día.",
  "Ofertas Especiales los fines de semana.",
  "Descuentos para usuarios registrados.",
  "Combina elegantes estilos.",
  "Paga ahora con nuestros planes.",
  "única a nivel Nacional.",
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Índice de la imagen actual
  const [textIndex, setTextIndex] = useState(0); // Índice del texto actual
  const [displayedText, setDisplayedText] = useState(""); // Texto mostrado con animación
  const [typing, setTyping] = useState(false); // Controla la animación de escritura
  const colors = ["text-pink-500", "text-cyan-400", "text-purple-500", "text-yellow-300"];

  // Precargar imágenes para evitar retrasos
  useEffect(() => {
    imageInfo.forEach((image) => {
      const img = new Image();
      img.src = image.src;
    });
  }, []);

  // Cambiar automáticamente a la siguiente imagen y texto cada 5 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageInfo.length);
      setTextIndex((prevTextIndex) => (prevTextIndex + 1) % promotionalTexts.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Animación de escritura para el texto promocional
  useEffect(() => {
    let typingTimeout;
    let currentText = promotionalTexts[textIndex];
    setDisplayedText(""); // Reinicia el texto mostrado
    setTyping(true); // Inicia la animación de escritura

    const typeText = (charIndex = 0) => {
      if (charIndex < currentText.length) {
        setDisplayedText((prev) => prev + currentText[charIndex]);
        typingTimeout = setTimeout(() => typeText(charIndex + 1), 100);
      } else {
        setTyping(false); // Finaliza la animación de escritura
      }
    };

    typeText(); // Inicia la animación

    return () => {
      clearTimeout(typingTimeout); // Limpia el timeout si el componente se desmonta o cambia
    };
  }, [textIndex]);

  // Funciones para cambiar manualmente las imágenes
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imageInfo.length) % imageInfo.length);
    setTextIndex((prevTextIndex) => (prevTextIndex - 1 + promotionalTexts.length) % promotionalTexts.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageInfo.length);
    setTextIndex((prevTextIndex) => (prevTextIndex + 1) % promotionalTexts.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Imagen mostrada con transición */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <img
          src={imageInfo[currentIndex].src}
          alt={imageInfo[currentIndex].alt}
          className="object-cover w-full h-screen filter brightness-75"
        />
      </div>

      {/* Texto promocional dinámico */}
      <div className="absolute w-full px-4 text-center transform -translate-y-1/2 top-1/2">
        <h1
          className={`text-4xl sm:text-6xl font-bold uppercase transition-transform duration-700 ease-in-out ${colors[textIndex % colors.length]} ${
            typing ? "animate-pulse" : ""
          }`}
        >
          {displayedText}
        </h1>
        <p className="mt-4 text-lg text-white sm:text-xl animate-fade-in">
          Discover unbeatable deals and stunning styles.
        </p>
      </div>

      {/* Indicadores (barras dinámicas) */}
      <div className="absolute left-0 right-0 flex justify-center space-x-2 bottom-8">
        {imageInfo.map((_, index) => (
          <span
            key={index}
            className={`w-8 h-1 rounded-full transition-transform transform duration-500 ${
              index === currentIndex ? "bg-white scale-125" : "bg-gray-500 scale-100"
            }`}
          />
        ))}
      </div>

      {/* Controles manuales */}
      <div className="absolute left-0 flex items-center h-full">
        <button
          onClick={handlePrev}
          className="p-2 text-white rounded-full hover:bg-black focus:outline-none"
        >
          <MdSkipPrevious className="size-10"/>
        </button>
      </div>
      <div className="absolute right-0 flex items-center h-full">
        <button
          onClick={handleNext}
          className="p-2 text-white rounded-full hover:bg-black focus:outline-none"
        >
          <MdSkipNext className="size-10"/>
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;
