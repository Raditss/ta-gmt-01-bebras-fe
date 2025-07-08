export const calculateCanvasSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const maxSize = Math.min(width, height) * 0.4;

    return {
        width: maxSize,
        height: maxSize,
    };
}