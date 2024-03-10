import React, { useState, useEffect } from 'react';
export default function Highlighter() {
  const [isActive, setIsActive] = useState(false);
  const [highlightColor, setHighlightColor] = useState('#FFFF00');
  const [selectedColor, setSelectedColor] = useState('#FFFF00');
  const [isEraserActive, setIsEraserActive] = useState(false);
  useEffect(() => {
    const handleMouseUp = () => {
      if (isEraserActive) {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        if (container.nodeType === Node.TEXT_NODE) {
          const parent = container.parentNode;
          if (parent && parent.nodeName === 'SPAN' && (parent as HTMLElement).style.backgroundColor) {
            (parent as HTMLElement).style.backgroundColor = '';
          }
        } else if (
          container.nodeType === Node.ELEMENT_NODE &&
          (container as HTMLElement).nodeName === 'SPAN' &&
          (container as HTMLElement).style.backgroundColor
        ) {
          (container as HTMLElement).style.backgroundColor = '';
        }
      } else if (isActive) {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
    
        // Check if the range contains only text nodes or non-image elements
        const isRangeValid = Array.from(range.cloneContents().childNodes).every(node => {
          return node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName !== 'IMG');
        });
    
        if (isRangeValid) {
          const fragment = range.cloneContents();
          const span = document.createElement('span');
          span.style.backgroundColor = highlightColor;
    
          // Iterate through the child nodes in the fragment
          Array.from(fragment.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
              // Append text nodes directly
              span.appendChild(child.cloneNode(true));
            } else if ((child as HTMLElement).tagName !== 'IMG') {
              // Append non-text, non-image elements directly
              span.appendChild(child.cloneNode(true));
            }
          });
    
          // Clear the range before modifying it
          range.deleteContents();
    
          // Insert the modified span
          range.insertNode(span);
          selection.removeAllRanges();
        } else {
          console.warn('Invalid selection: Range contains non-text nodes or images');
        }
      }
    };

    if (isActive || isEraserActive) {
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isActive, highlightColor, isEraserActive]);
  const toggleHighlighter = () => {
    setIsActive(prev => !prev);
    setIsEraserActive(false); // Deactivate eraser mode when highlighter mode is toggled
  };
  const toggleEraser = () => {
    setIsEraserActive(prev => !prev);
  };
  const undoHighlight = () => {
    const highlightedElements = document.querySelectorAll('span[style*="background-color"]');
    highlightedElements.forEach(element => {
      const parent = element.parentNode;
      if (parent) {
        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
      }
    });
  };
  const handleColorChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedColor(event.target.value);
  };
  const confirmColorSelection = () => {
    setHighlightColor(selectedColor);
  };
  return (
    <div>
      <button onClick={toggleHighlighter}>
        {isActive ? 'Deactivate Highlighter' : 'Activate Highlighter'}
      </button>
      {isActive && (
        <>
          <div style={{ display: 'inline-block' }}> {/* Add inline-block display */}
            <button onClick={undoHighlight}>Undo All Highlighting</button>
            <button onClick={toggleEraser}>
              {isEraserActive ? 'Deactivate Eraser' : 'Activate Eraser'}
            </button>
          </div>
          <div>
            <label htmlFor="colorPicker">Select Highlight Color: </label>
            <input
              type="color"
              id="colorPicker"
              value={selectedColor}
              onChange={handleColorChange}
            />
            <button onClick={confirmColorSelection}>Confirm</button>
          </div>
        </>
      )}
      <p>
        Instructions: Once the highlighter is activated, choose a colour of your choice and click on confirm to select the colour. Undo highlighting will remove all highlighting.
      </p>
    </div>
  );
}
