import "./carousel.css";
import { pic1, pic2, pic3, pic4, pic5 } from "./assets";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Slide from "./slide";

const slides = [
  {
    url: pic1,
  },
  {
    url: pic2,
  },
  {
    url: pic3,
  },
  {
    url: pic4,
  },
  {
    url: pic5,
  },
];

// https://www.w3schools.com/howto/howto_js_image_comparison.asp

const Carousel = () => {
  const [currentPicIndex, setCurrentPicIndex] = useState<number>(slides.length);
  const slider = useRef<HTMLDivElement>(null);
  const clicked = useRef<boolean>(false);
  const slideStart = useRef<number>(0);

  const onStartPressSlider = (e: MouseEvent) => {
    clicked.current = true;
    slideStart.current = e.pageX;
  };

  useEffect(() => {
    if (!slider.current) return;

    slider.current.addEventListener("mousedown", onStartPressSlider);
    return () => {
      if (!slider.current) return;
      slider.current.removeEventListener("mousedown", onStartPressSlider);
    };
  }, []);

  return (
    <div className="container">
      <div className="slider" ref={slider} />
      {[...slides, ...slides, ...slides].map((picture, idx) => (
        <Slide
          picture={picture.url}
          key={picture.url + idx}
          index={idx}
          currentIndex={currentPicIndex}
          setCurrentPicIndex={setCurrentPicIndex}
          clicked={clicked}
          slideStart={slideStart}
        />
      ))}
    </div>
  );
};

export default Carousel;
