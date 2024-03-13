/* OLDER VERSION OF CANVAS DRAWING TOOL */


import React, { useEffect, useRef, useState } from "react";

function DrawingToolOld(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isPenActive, setIsPenActive] = useState<boolean>(true); // State for pen activity
  const [isErasing, setIsErasing] = useState<boolean>(false); // State for erasing mode

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPenActive) return; // Do not draw if pen is inactive
    const { offsetX, offsetY } = nativeEvent;
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

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isPenActive) return; // Do not draw if pen is inactive or not drawing
    const { offsetX, offsetY } = nativeEvent;
    if (!contextRef.current) return;

    if (isErasing) {
      // If erasing mode, use clearRect instead of lineTo to erase
      contextRef.current.clearRect(offsetX - 5, offsetY - 5, 10, 10);
    } else {
      // If drawing mode, draw as usual
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  const togglePen = () => {
    setIsPenActive(!isPenActive);
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  return (
    <div>
      {/* Button to toggle between drawing mode and erasing mode */}
        <button onClick={toggleEraser} style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px', border: '2px solid black' }}>
        Current Tool: <br /> {isErasing ? 'Eraser' : 'Pen'}
        </button>

      {/* Button to toggle pen ON/OFF mode*/}
        <button onClick={togglePen} style={{ position: 'absolute', top: '81px', left: '20px', padding: '10px', border: '2px solid black' }}>
        Tool Status: <br /> {isPenActive ? 'Active' : 'Inactive'}
        </button>
      
      {/* Canvas */}
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </div>
  );
}

export default DrawingToolOld;