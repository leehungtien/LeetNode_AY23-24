import React, { useEffect, useState } from "react";

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

        const selectionContents = range.cloneContents();
        const textNodes = Array.from(selectionContents.childNodes).filter(node => 
          node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0
        );
        const nodes = Array.from(selectionContents.querySelectorAll('*'));

        const containsImage = nodes.some(node => node.nodeName === 'IMG');
        const containsNonImageElementOrText = textNodes.length > 0 || nodes.some(node =>
          (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0) ||
          (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'IMG')
        );

        console.log('containsImage:', containsImage, 'containsNonImageElementOrText:', containsNonImageElementOrText);

        if (containsImage && containsNonImageElementOrText) {
          alert('Please highlight text only.');
          window.getSelection()?.removeAllRanges(); // Clear the selection to prevent accidental highlighting
        } else if (containsImage && !containsNonImageElementOrText) {
          alert('Please do not highlight images.');
          window.getSelection()?.removeAllRanges(); // Clear the selection to prevent accidental highlighting
        } else if (!containsImage && containsNonImageElementOrText) {
          const selection = window.getSelection();

          // Check if selection is not null and rangeCount is more than 0
          if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const selectedContent = range.extractContents();
        
            // Create a new span for the highlight
            const highlightSpan = document.createElement('span');
            highlightSpan.style.backgroundColor = highlightColor;
            highlightSpan.appendChild(selectedContent);
            range.insertNode(highlightSpan);
        
            // Clean up by removing any potential empty text nodes
            highlightSpan.normalize();
        
            // Clear the selection to prevent accidental highlighting
            selection.removeAllRanges();
          }
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
    <button
      type="button" // This ensures the button does not submit the form in PracQuestions.tsx
      onClick={toggleHighlighter}
      style={{
        backgroundColor: '#15aabf', // No background color for a transparent button
        fontSize: '1rem', // Extra-large text size
        marginBottom: '0.5rem', // Extra-small margin-bottom
        fontWeight: 500, // Bold font weight
        color: 'white', // Cyan text color
        border: 'none', // No border for the button
        padding: '8px 16px', // Standard padding; adjust as needed
        outline: 'none', // Remove outline on focus
        cursor: 'pointer', // Change cursor to pointer to indicate it's a button
        borderRadius: '10px', // Adjust this value to get the desired roundness of corners
      }}
    >
        {isActive ? 'Deactivate Highlighter' : 'Activate Highlighter'}
      </button>
      {isActive && (
        <>
          <div style={{ display: 'inline-block' }}> {/* Add inline-block display */}
            <button 
              type="button" // This ensures the button does not submit the form in PracQuestions.tsx
              onClick={undoHighlight}>Erase All Highlighting</button>
            <button
              type="button" // This ensures the button does not submit the form in PracQuestions.tsx 
              onClick={toggleEraser}>
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
            <button 
              type="button" // This ensures the button does not submit the form in PracQuestions.tsx
              onClick={confirmColorSelection}>Confirm</button>
          </div>
        </>
      )}
    </div>
  );
}