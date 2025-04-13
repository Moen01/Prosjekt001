'use client';

import React, { useState } from 'react';
import './initsielFmeaProcses.css'; // Import the CSS file for styling

export default function InitsielFmeaProsess({ title }) {
  const [processBox, setProcessBox] = useState(null); // Track the single process box
  const [isExpanded, setIsExpanded] = useState(true); // Track the expanded/collapsed state

  const handleAddProcess = () => {
    if (!processBox) {
      setProcessBox({
        id: Date.now(),
        rotatedText: { id: Date.now(), value: '', isBold: false }, // Track the rotated text
        textFields: [{ id: Date.now(), title: '', value: '' }], // Track normal text fields
      });
    }
  };

  const handleRotatedTextChange = (value) => {
    setProcessBox((prev) => ({
      ...prev,
      rotatedText: { ...prev.rotatedText, value },
    }));
  };

  const handleRotatedTextKeyPress = (e) => {
    if (e.key === 'Enter') {
      setProcessBox((prev) => ({
        ...prev,
        rotatedText: { ...prev.rotatedText, isBold: true },
      }));
    }
  };

  const handleNormalTextChange = (fieldId, value, fieldType) => {
    setProcessBox((prev) => ({
      ...prev,
      textFields: prev.textFields.map((field) =>
        field.id === fieldId ? { ...field, [fieldType]: value } : field
      ),
    }));
  };

  const handleAddTextField = () => {
    setProcessBox((prev) => ({
      ...prev,
      textFields: [
        ...prev.textFields,
        { id: Date.now(), title: '', value: '' }, // Add a new row with titleNormalText and normalText
      ],
    }));
  };

  return (
    <div className="outer-rectangle">
      <div className="left-inner-rectangle">
        <div className="tilted-text">{title}</div> {/* Display the title inside */}
      </div>
      <div className="right-inner-rectangle">
        <div className="process-box-container">
          {!processBox && (
            <button
              className="add-process-button"
              onClick={handleAddProcess}
            >
              Add Process <span className="plus-icon">+</span>
            </button>
          )}
          {processBox && (
            <div key={processBox.id} className={`process-box ${isExpanded ? '' : 'collapsed'}`}>
              <button
                className="toggle-width-button"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? '←' : '→'}
              </button>
              <div className="text-row-container">
                {/* Rotated Text */}
                <div className="rotated-text-container">
                  {!processBox.rotatedText.isBold ? (
                    <textarea
                      className="rotated-text"
                      placeholder="Rotated Text"
                      value={processBox.rotatedText.value}
                      onChange={(e) => handleRotatedTextChange(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault(); // Prevent default behavior of Enter key
                          setProcessBox((prev) => ({
                            ...prev,
                            rotatedText: { ...prev.rotatedText, isBold: true },
                          }));
                        }
                      }}
                    />
                  ) : (
                    <div className="bold-rotated-text">{processBox.rotatedText.value}</div>
                  )}
                </div>

                {/* Normal Text */}
                <div className="normal-text-container">
                  {processBox.textFields.map((field) => (
                    <div key={field.id} className="normal-text-row">
                      <input
                        type="text"
                        className="title-normal-text"
                        placeholder="Title"
                        value={field.title || ''}
                        onChange={(e) =>
                          handleNormalTextChange(field.id, e.target.value, 'title')
                        }
                      />
                      <input
                        type="text"
                        className="normal-text"
                        placeholder="Normal Text"
                        value={field.value || ''}
                        onChange={(e) =>
                          handleNormalTextChange(field.id, e.target.value, 'value')
                        }
                      />
                    </div>
                  ))}
                  <button
                    className="add-text-field-button"
                    onClick={handleAddTextField}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <button className="triangle-button"></button>

      </div>
    </div>
  );
}