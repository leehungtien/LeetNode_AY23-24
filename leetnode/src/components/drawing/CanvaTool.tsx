import React, { useEffect, useRef, useState } from "react";

import styles from "./CanvasTool.module.css";

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

    /* To adjust pen or eraser size */
    const [eraserSize, setEraserSize] = useState<number>(10); /* Original eraser size: 10 */
    const [penSize, setPenSize] = useState<number>(5); /* Original pen size: 5 */

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
        if (!isErasing) contextRef.current.strokeStyle = color; /* CHANGING COLOUR - SETTING EFFECT */
        contextRef.current.lineWidth = isErasing ? eraserSize : penSize; /* CHANGe PEN/ERASER SIZE - SETTING EFFECT */
    }, 
    [color, !isErasing, eraserSize, penSize]); /* This [] is mainly to state (and maybe, set boolean) variables initiated in useEffect() */
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


    /////////////////////////////////////////////////////////////////////////////////////
    /* FUNCTIONS TO CHANGE PEN OR ERASER SIZE */

    const handleEraserSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        /* PREVENTS CLICKING OF EXTERNAL HTML ELEMENTS */
        event.stopPropagation(); // This will stop the event from bubbling up
        event.preventDefault(); // Prevent default touch behavior

        setEraserSize(parseInt(event.target.value));
    };


    //////////////////////////////////////////////////////
    const handlePenSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        /* PREVENTS CLICKING OF EXTERNAL HTML ELEMENTS */
        event.stopPropagation(); // This will stop the event from bubbling up
        event.preventDefault(); // Prevent default touch behavior

        setPenSize(parseInt(event.target.value));
    };
    //////////////////////////////////////////////////////


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
    /* BUTTON TO RESET ALL DRAWINGSS AND HISTORY TO ORIGINAL STATE */
    const clearCanvas = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // This will stop the event from bubbling up
        event.preventDefault(); // Prevent default touch behavior
        
        if (window.confirm("Are you sure you want to reset all drawings? This action cannot be undone!")) { // Show Confirmation dialog: if user confirms to reset

            const canvas = drawingCanvasRef.current;
            const context = contextRef.current;

            if (canvas && context) {
                // Clear the canvas
                context.clearRect(0, 0, canvas.width, canvas.height);
        
                // Reset history
                setHistory([]);
                setUndoneHistory([]);
        
                // Optional: Reset other states if necessary (like color, pen/eraser active states)
            }
        }
    };
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////

    return (
        <div style={{ position: "relative", display: isVisible ? 'block' : 'none' }}>
        
        {/* Eraser Size Input and Label */}
        {isErasing && (
            <>  {/* Scrollbar for eraser size*/}
                <input
                    type="range"
                    min="5"
                    max="50"
                    value={eraserSize}
                    onChange={handleEraserSizeChange}
                    style={{
                    position: "absolute",
                    top: "110px",
                    left: "1230px",
                    zIndex: 2,
                    }}
                />
                <label
                    className={styles.labelCanvasFont}
                    style={{
                    position: "absolute",
                    top: "83px",
                    left: "1230px",
                    zIndex: 2,
                    }}
                >
                    Eraser Size: 
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={eraserSize}
                            onChange={handleEraserSizeChange}
                            style={{
                                width: "60px", // Give enough space for typing out numbers
                                marginLeft: "7px",
                            }}
                        />
                </label>
            </>
        )}

        {/* Pen Size Input and Label */}
        {!isErasing && (
            <>  {/* Scrollbar for pen size*/}
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={penSize}
                    onChange={handlePenSizeChange}
                    style={{
                    position: "absolute",
                    top: "110px",
                    left: "1230px",
                    zIndex: 2,
                    }}
                />
                <label
                    className={styles.labelCanvasFont}
                    style={{
                    position: "absolute",
                    top: "83px",
                    left: "1230px",
                    zIndex: 2,
                    }}
                >
                    Pen Size: 
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={penSize}
                            onChange={handlePenSizeChange}
                            style={{
                                width: "60px", // Give enough space for typing out numbers
                                marginLeft: "20px",
                            }}
                        />
                </label>
                
                {/* Button to set pen colour */}
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ position: "absolute", top: "150px", left: "1330px", zIndex: 2 }}
                />
                <label 
                    className={styles.labelCanvasFont}
                    style={{ position: "absolute", top: "150px", left: "1230px", zIndex: 2 }}>
                    Pen Color:
                </label>
            </>
        )}

                                {/* REMAINING BUTTONS */}
        
        {/* /////////////////////////////////////////////////////////////////////// */}
        {/* /////////////////////////////////////////////////////////////////////// */}

        {/* Button to COMPLETELY RESET All Drawings - clears all Undo/Redo HISTORY! */}
        <button
            onClick={clearCanvas}
            style={{
                position: "absolute",
                top: "209px",
                left: "1232.5px",
                padding: "10px",
                border: "2px solid black",
                zIndex: 2,
                backgroundColor: "red",  // Set the background color to red
                color: "white",           // Set the font color to white
                cursor: "pointer",         // Change cursor on hover to indicate it's clickable
                fontWeight: "bold"  // Make the label text bold
            }}
        >
            Reset All
        </button>

                    




        {/* Button to Toggle between Pen and Eraser */}
        <button
            onClick={toggleEraser}
            style={{
            position: "absolute",
            top: "80px",
            left: "1102.6px",
            padding: "6.1px",
            border: "2px solid black",
            zIndex: 2,
            cursor: "pointer",         // Change cursor on hover to indicate it's clickable
            }}
        >   
            {/* Styling Purposes */}
            <span style={{ fontWeight: 'bold' }}>Current Tool: </span> 
            <br /> {isErasing ? "🧽 Eraser" : "🖊️ Pen"}
        </button>
        


        
        {/* Button to Toggle the state of the tool (pen/eraser) - to prevent accidental tool actions caused */}
        <button
            onClick={togglePen}
            style={{
            position: "absolute",
            top: "136px",
            left: "1102.5px",
            padding: "9.9px",
            border: "2px solid black",
            zIndex: 2,
            cursor: "pointer",         // Change cursor on hover to indicate it's clickable
            }}
        >
            <span style={{ fontWeight: 'bold' }}>Tool Status: </span> 
            <br /> {isPenActive ? "💡 Active" : "💤 Inactive"}
        </button>

        {/* User Interface - Allow for drawing */}
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

        {/* Button to UNDO most recent action (pen/eraser) */}
        <button onClick={setUndo}
            style={{
                position: "absolute",
                top: "200px",
                left: "1100px",
                padding: "7.5px",
                border: "2px solid black",
                zIndex: 2,
                cursor: "pointer",         // Change cursor on hover to indicate it's clickable
            }}
        >
        <span style={{ fontWeight: 'bold' }}> Undo </span>
        <br/>
            ⬅️
        </button>
        
        {/* Button to REDO previously undone action (pen/eraser) */}
        <button onClick={setRedo}
            style={{
                position: "absolute",
                top: "200px",
                left: "1160px",
                padding: "7.5px",
                border: "2px solid black",
                zIndex: 2,
                cursor: "pointer",         // Change cursor on hover to indicate it's clickable
            }}
        >
        <span style={{ fontWeight: 'bold' }}> Redo </span>
        <br/>
            ➡️
        </button>
        
        {/* User Interface - Allow for drawing */}
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