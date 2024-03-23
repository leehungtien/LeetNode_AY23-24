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
  
        const selectionContents = range.cloneContents();
        // Directly check for text nodes within the selection, including a null check for textContent
        const textNodes = Array.from(selectionContents.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0);
        const nodes = Array.from(selectionContents.querySelectorAll('*')); // Select all elements within the selection
  
        // Update the checks to include direct text node checks and null check for textContent
        const containsImage = nodes.some(node => node.nodeName === 'IMG');
        const containsNonImageElementOrText = textNodes.length > 0 || nodes.some(node =>
          (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0) ||
          (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'IMG')
        );
        
        
      console.log('containsImage:', containsImage, 'containsNonImageElementOrText:', containsNonImageElementOrText);
      
      if (!containsImage && containsNonImageElementOrText) {
        const highlightSpan = document.createElement('span');
        highlightSpan.style.backgroundColor = highlightColor;
        highlightSpan.style.display = 'inline';

        try {
          // Instead of cloning and appending child nodes to the highlightSpan,
          // directly surround the range with the highlightSpan.
          range.surroundContents(highlightSpan);

          // Clear the selection to prevent accidental manipulation
          window.getSelection()?.removeAllRanges();
        } catch (error) {
          console.error('Error applying highlight:', error);
          // Fallback for cases where surroundContents might fail due to complex selections
          // This can be due to selections spanning multiple nodes which cannot be surrounded as a single range.
          // Implement additional handling here if needed.
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