export const getCursorPosition = (e: MouseEvent, img: HTMLImageElement) => {
  const imagePos = img.getBoundingClientRect();
  return e.pageX - imagePos.left - window.scrollX;
};

export const slide = (width: number, img: HTMLDivElement) => {
  img.style.width = `${width}px`;
  //   slider.style.left = `${img.offsetWidth - slider.offsetWidth / 2}px`;
};
