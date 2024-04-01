import React, { useEffect, useRef, useState } from "react";

function CanvasTool({ isVisible }: { isVisible: boolean }): JSX.Element {

    /* 
    isVisible: allows component to appear/disappear when:
        - "Activate Canvas" or "Dectivate Canvas" button is pressed
        -> When 'activated', canvas tool will appear; allowing user to draw ANYWHERE, even ON TOP of the variables box
            - Users won't be able to click 'Submit' button (USEFUL if annotation ends up clicking any button by accident)
        -> When 'deactivated', canvas tool will disappear; allowing user to select the options AND answer the question
    */


    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    /* To draw on HTML/IMAGES */
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    
    const [isPenActive, setIsPenActive] = useState<boolean>(true);
    const [isErasing, setIsErasing] = useState<boolean>(false);
    const [eraserSize, setEraserSize] = useState<number>(10);

    /* For Undo - Redo functionality - HISTORY */
    const [history, setHistory] = useState<any[]>([]);
    const [undoneHistory, setUndoneHistory] = useState<any[]>([]);

    /* For changing color of pen drawing */
    const [color, setColor] = useState('#000000');

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

    ////////////////
    
    useEffect(() => {
        if (!contextRef.current) return;
        if (!isErasing) contextRef.current.strokeStyle = color;
        contextRef.current.lineWidth = isErasing ? eraserSize : 5;
    }, [color, !isErasing, eraserSize]);
    
    //////////////////////

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

        if (isDrawing || isErasing) {
            const canvas = drawingCanvasRef.current;
            if (!canvas) return;
            const snapshot = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
            setHistory([...history, snapshot]);
            setUndoneHistory([]);

            // const overlay_canvas = overlayCanvasRef.current;
            // if (!overlay_canvas) return;
            // const overlay_snapshot = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
            // setHistory([...history, overlay_snapshot]);
            // setUndoneHistory([]);

        }

    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        
        /* PREVENTS CLICKING OF EXTERNAL HTML ELEMENTS */
        event.stopPropagation(); // This will stop the event from bubbling up
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

        /* PREVENTS CLICKING OF EXTERNAL HTML ELEMENTS */
        event.stopPropagation(); // This will stop the event from bubbling up
        event.preventDefault(); // Prevent default touch behavior

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
    
    
    

    const togglePen = (event: React.MouseEvent<HTMLButtonElement>) => {

        /* PREVENTS CLICKING OF EXTERNAL HTML ELEMENTS */
        event.stopPropagation(); // This will stop the event from bubbling up
        event.preventDefault(); // Prevent default touch behavior

        setIsPenActive(!isPenActive);
    };

    const toggleEraser = (event: React.MouseEvent<HTMLButtonElement>) => {

        /* PREVENTS CLICKING OF EXTERNAL HTML ELEMENTS */
        event.stopPropagation(); // This will stop the event from bubbling up
        event.preventDefault(); // Prevent default touch behavior

        setIsErasing(!isErasing);
    };

    const handleEraserSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        /* PREVENTS CLICKING OF EXTERNAL HTML ELEMENTS */
        event.stopPropagation(); // This will stop the event from bubbling up
        event.preventDefault(); // Prevent default touch behavior

        setEraserSize(parseInt(event.target.value));
    };


    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

    const setUndo = (event: React.MouseEvent<HTMLButtonElement>) => {

        /* PREVENTS CLICKING OF EXTERNAL HTML ELEMENTS */
        event.stopPropagation(); // This will stop the event from bubbling up
        event.preventDefault(); // Prevent default touch behavior

        if (history.length >= 0) {
            const lastAction = history.pop();
            if (lastAction) {
                setUndoneHistory([...undoneHistory, lastAction]);
            }
            redrawCanvas();
        }
    };

    const setRedo = (event: React.MouseEvent<HTMLButtonElement>) => {

        /* PREVENTS CLICKING OF EXTERNAL HTML ELEMENTS */
        event.stopPropagation(); // This will stop the event from bubbling up
        event.preventDefault(); // Prevent default touch behavior

        if (undoneHistory.length >= 0) {
            const nextAction = undoneHistory.pop();
            if (nextAction) {
                setHistory([...history, nextAction]);
            }
            redrawCanvas();
        }
    };

    const redrawCanvas = () => {
        const canvas = drawingCanvasRef.current;
        if (!canvas || !contextRef.current) return;
        contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
        history.forEach(snapshot => contextRef.current?.putImageData(snapshot, 0, 0));
    };

    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////

    return (
        <div style={{ position: "relative", display: isVisible ? 'block' : 'none' }}>
        
        {isErasing && (
            <>
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
            </>
        )}

        {!isErasing && (
            <>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ position: "absolute", top: "94px", left: "1140px", zIndex: 2 }}
                />
                <label 
                    style={{ position: "absolute", top: "70px", left: "1132px", zIndex: 2 }}>
                    Pen Color
                </label>
            </>
        )}

                    





        
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

        
        <button onClick={setUndo}
            style={{
                position: "absolute",
                top: "200px",
                left: "1000px",
                padding: "10px",
                border: "2px solid black",
                zIndex: 2,
            }}
        >Undo
        </button>

        <button onClick={setRedo}
            style={{
                position: "absolute",
                top: "200px",
                left: "1070px",
                padding: "10px",
                border: "2px solid black",
                zIndex: 2,
            }}
        >Redo</button>
        
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

export default CanvasTool;