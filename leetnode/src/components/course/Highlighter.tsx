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
        const nodes = Array.from(selectionContents.querySelectorAll('*')); // Select all elements within the selection
  
        // Checks if there are any image elements
        const containsImage = nodes.some(node => node.nodeName === 'IMG');
        // Checks for non-image elements or text nodes
        const containsNonImageElementOrText = nodes.some(node =>
          node.nodeType === Node.TEXT_NODE ||
          (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'IMG')
        );
        
        
      console.log('containsImage:', containsImage, 'containsNonImageElementOrText:', containsNonImageElementOrText);
      
      if (containsImage && containsNonImageElementOrText) {
          // Case when both an image and text/formula are selected
          alert('Please do not highlight text and images together. Highlight text only.');
          selection.removeAllRanges(); // Clear the selection
        } else if (containsImage) {
          // Case when only an image is selected
          alert('Please do not highlight images.');
          selection.removeAllRanges(); // Clear the selection
          //case when text/formaula are selected
        } else {
          // Assume any selection is potentially valid for highlighting for simplicity,
          // but you might want to refine this to exclude certain elements explicitly.
          const isTextSelection = nodes.every(node => 
            node.nodeType === Node.TEXT_NODE || 
            node.nodeType === Node.ELEMENT_NODE // Optionally, add more specific checks here
          );
        
          if (isTextSelection) {
            const highlightSpan = document.createElement('span');
            highlightSpan.style.backgroundColor = highlightColor;
            highlightSpan.style.display = 'inline';
        
            // Fragment to gather nodes for wrapping
            const docFragment = document.createDocumentFragment();
            docFragment.appendChild(highlightSpan);
        
            try {
              nodes.forEach(node => {
                // Clone and append to the highlight span if it's an element node that might not directly be text
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const clonedNode = node.cloneNode(true); // Deep clone to get all child nodes
                  highlightSpan.appendChild(clonedNode);
                } else if (node.nodeType === Node.TEXT_NODE) {
                  highlightSpan.appendChild(node.cloneNode(true));
                }
              });
        
              // Replace the original range contents with the new fragment
              range.deleteContents();
              range.insertNode(docFragment);
        
              // Clear the selection to prevent accidental manipulation
              window.getSelection()?.removeAllRanges();
            } catch (error) {
              console.error('Error applying highlight:', error);
            }
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