export const calculateCanvasSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Make the monster take up less space - 15% of viewport instead of 20%
  const maxSize = Math.min(width, height) * 0.3;

  return {
    width: maxSize,
    height: maxSize * 1.5 // Make it slightly taller than wide for better proportions
  };
};
