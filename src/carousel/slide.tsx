import clsx from "clsx";
import { useEffect, useRef } from "react";
import { getCursorPosition, slide } from "./utils";

const SLIDE_WIDTH = 640;

const Slide: React.FunctionComponent<{
  picture: string;
  index: number;
  currentIndex: number;
  setCurrentPicIndex: React.Dispatch<React.SetStateAction<number>>;
  clicked: React.MutableRefObject<boolean>;
  slideStart: React.MutableRefObject<number>;
}> = ({
  picture,
  currentIndex,
  index,
  setCurrentPicIndex,
  clicked,
  slideStart,
}) => {
  const slideContainer = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);

  const imgWidth = useRef<number | null>(null);
  const isSelected = currentIndex === index;
  const isNeighborPrev = index === currentIndex - 1;
  const isNeighborNext = index === currentIndex + 1;

  const onEndPressSlider = () => {
    clicked.current = false;
    slideStart.current = 0;

    if (!image.current) return;
    if (isNeighborNext || isNeighborPrev || isSelected) {
      const imageWidth = image.current.offsetWidth;

      if (imageWidth >= SLIDE_WIDTH * 0.5) {
        setCurrentPicIndex(index);
        image.current.style.transition = "all ease-out 0.5s";
        image.current.style.width = SLIDE_WIDTH + "px";
        setTimeout(() => {
          if (!image.current) return;
          image.current.style.transition = "unset";
        }, 500);
      } else {
        image.current.style.transition = "all ease-out 0.5s";
        image.current.style.width = 0 + "px";
        setTimeout(() => {
          if (!image.current) return;
          image.current.style.transition = "unset";
        }, 500);
      }
    }
  };

  const onMoveSlider = (e: MouseEvent) => {
    if (
      !image.current ||
      !slideContainer.current ||
      (!isNeighborNext && !isNeighborPrev && !isSelected) ||
      !clicked.current ||
      !slideStart.current === null ||
      imgWidth.current === null
    )
      return;
    const startX = slideStart.current;
    const currentX = e.pageX;

    const movedPixel = startX - currentX;

    if (isNeighborNext) {
      if (movedPixel > 0) {
        slide(movedPixel, image.current);
      } else {
        slide(0, image.current);
      }
    }

    if (isNeighborPrev) {
      if (movedPixel < 0) {
        slide(-movedPixel, image.current);
      } else {
        slide(0, image.current);
      }
    }

    if (movedPixel && isSelected) {
      if (movedPixel > 0) {
        slideContainer.current.style.justifyContent = "flex-start";
        image.current.style.backgroundPositionX = "0px";
      } else {
        slideContainer.current.style.justifyContent = "flex-end";
        image.current.style.backgroundPosition = "right";
      }

      slide(SLIDE_WIDTH - Math.abs(movedPixel), image.current);
    }
  };

  useEffect(() => {
    if (!slideContainer.current || !image.current) return;

    if (isNeighborNext) {
      slideContainer.current.style.justifyContent = "flex-end";
      image.current.style.backgroundPosition = "right";
    }
  }, [isNeighborNext]);

  useEffect(() => {
    if (!image.current || (!isNeighborNext && !isNeighborPrev && !isSelected))
      return;
    imgWidth.current = image.current.offsetWidth;
    window.addEventListener("mouseup", onEndPressSlider);
    window.addEventListener("mousemove", onMoveSlider);

    return () => {
      window.removeEventListener("mouseup", onEndPressSlider);
      window.removeEventListener("mousemove", onMoveSlider);
    };
  }, [isSelected, isNeighborNext, isNeighborPrev]);

  return (
    <div
      ref={slideContainer}
      className={clsx([
        "slide",
        {
          "current-slide": isSelected,
          "slide-overlay": isNeighborNext || isNeighborPrev,
          isPrev: isNeighborPrev,
          isNext: isNeighborNext,
        },
      ])}
    >
      <div
        ref={image}
        className="image"
        style={{ background: `url(${picture})` }}
      >
        <p>slide title</p>
      </div>
    </div>
  );
};

export default Slide;
