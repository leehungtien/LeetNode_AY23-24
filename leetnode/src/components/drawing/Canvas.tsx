import React, { useEffect, useRef, useState } from "react";

function DrawingTool(): JSX.Element {
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isPenActive, setIsPenActive] = useState<boolean>(true);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [eraserSize, setEraserSize] = useState<number>(10);

  useEffect(() => {
    const drawingCanvas = drawingCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!drawingCanvas || !overlayCanvas) return;

    const drawingContext = drawingCanvas.getContext("2d");
    const overlayContext = overlayCanvas.getContext("2d");
    if (!drawingContext || !overlayContext) return;

    drawingCanvas.width = window.innerWidth * 2;
    drawingCanvas.height = window.innerHeight * 2;
    drawingCanvas.style.width = `${window.innerWidth}px`;
    drawingCanvas.style.height = `${window.innerHeight}px`;

    overlayCanvas.width = window.innerWidth * 2;
    overlayCanvas.height = window.innerHeight * 2;
    overlayCanvas.style.width = `${window.innerWidth}px`;
    overlayCanvas.style.height = `${window.innerHeight}px`;

    drawingContext.scale(2, 2);
    drawingContext.lineCap = "round";
    drawingContext.strokeStyle = "black";
    drawingContext.lineWidth = 5;
    overlayContext.scale(2, 2);

    contextRef.current = drawingContext;
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPenActive) return;
    const { offsetX, offsetY } = getMousePosition(event);
    if (!contextRef.current) return;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault(); // Prevent default touch behavior
    
    if (!isDrawing || !isPenActive) return;
  
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    let offsetX = 0;
    let offsetY = 0;
  
    if ('touches' in event) {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        if (touch) { // Check if touch is defined
          offsetX = touch.clientX - canvas.offsetLeft;
          offsetY = touch.clientY - canvas.offsetTop;
        }
      }
    } else {
      offsetX = event.nativeEvent.offsetX;
      offsetY = event.nativeEvent.offsetY;
    }
  
    if (isErasing) {
      ctx.clearRect(offsetX - eraserSize / 2, offsetY - eraserSize / 2, eraserSize, eraserSize);
    } else {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };
  
  

  const getMousePosition = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
  
    let offsetX = 0;
    let offsetY = 0;
  
    if (event instanceof TouchEvent && event.touches.length > 0) {
      const touch = event.touches[0];
      if (touch) {
        offsetX = touch.clientX - canvas.offsetLeft;
        offsetY = touch.clientY - canvas.offsetTop;
      }
    } else {
      offsetX = (event.nativeEvent as MouseEvent).offsetX;
      offsetY = (event.nativeEvent as MouseEvent).offsetY;
    }
  
    return { offsetX, offsetY };
  };
  
  
  

  const togglePen = () => {
    setIsPenActive(!isPenActive);
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const handleEraserSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEraserSize(parseInt(event.target.value));
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="range"
        min="5"
        max="50"
        value={eraserSize}
        onChange={handleEraserSizeChange}
        style={{
          position: "absolute",
          top: "56px",
          left: "1000px",
          zIndex: 2,
        }}
      />
      <label
        style={{
          position: "absolute",
          top: "35px",
          left: "1000px",
          zIndex: 2,
        }}
      >
        Eraser Size
      </label>
      <button
        onClick={toggleEraser}
        style={{
          position: "absolute",
          top: "70px",
          left: "1000px",
          padding: "10px",
          border: "2px solid black",
          zIndex: 2,
        }}
      >
        Current Tool: <br /> {isErasing ? "Eraser" : "Pen"}
      </button>
      <button
        onClick={togglePen}
        style={{
          position: "absolute",
          top: "130px",
          left: "1000px",
          padding: "10px",
          border: "2px solid black",
          zIndex: 2,
        }}
      >
        Tool Status: <br /> {isPenActive ? "Active" : "Inactive"}
      </button>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={draw}
        ref={drawingCanvasRef}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      />
      <canvas
        ref={overlayCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default DrawingTool;