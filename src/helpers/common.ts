export const calculateCanvasSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Calculate the maximum size for the canvas
    const maxSize = Math.min(width, height) * 0.4; // Use 80% of the smaller dimension

    return {
        width: maxSize,
        height: maxSize,
    };
}