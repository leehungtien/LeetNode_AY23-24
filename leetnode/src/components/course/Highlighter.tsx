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
    
        // Check if the selection is valid and contains only text
        const isRangeValid = Array.from(range.cloneContents().childNodes).every(
          (node) =>
            node.nodeType === Node.TEXT_NODE ||
            (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'BR')
        );
    
        if (isRangeValid) {
          // Create start and end markers
          const startMarker = document.createTextNode('');
          const endMarker = document.createTextNode('');
          range.insertNode(startMarker);
          range.collapse(false); // Collapse the range to the end point
          range.insertNode(endMarker);
          range.setStartAfter(startMarker);
          range.setEndBefore(endMarker);
    
          // Create the span element to wrap the selected text
          const span = document.createElement('span');
          span.style.backgroundColor = highlightColor;
          span.style.display = 'inline'; // Ensure the span is displayed inline
          range.surroundContents(span);
    
          // Clean up markers
          startMarker.remove();
          endMarker.remove();
    
          // Clear the selection
          selection.removeAllRanges();
        } else {
          // Warn the user and clear the selection
          alert('Please highlight only the text in question.');
          selection.removeAllRanges(); // Clear the selection
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