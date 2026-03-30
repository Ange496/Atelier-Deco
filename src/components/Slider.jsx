export default function Slider({ slides, currentSlide, onSlideChange }) {
  const goToPrevSlide = () => {
    onSlideChange((currentSlide - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    onSlideChange((currentSlide + 1) % slides.length);
  };

  return (
    <div className="slider-wrap">
      {slides.map((slide, index) => (
        <div key={slide.id} className={`slide ${index === currentSlide ? "active" : ""}`}>
          <div className="slide-bg" style={{ background: slide.bg }} />
          <img className="slide-img" src={slide.img} alt={slide.title} />
          <div className="slide-content">
            <span className="slide-tag">{slide.tag}</span>
            <div className="slide-title">{slide.title}</div>
            <div className="slide-sub">{slide.subtitle}</div>
          </div>
        </div>
      ))}
      
      <div className="slide-dots">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => onSlideChange(index)}
          />
        ))}
      </div>
      
      <div className="slide-controls">
        <button className="slide-btn" onClick={goToPrevSlide}>◀</button>
        <button className="slide-btn" onClick={goToNextSlide}>▶</button>
      </div>
    </div>
  );
}