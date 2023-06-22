import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ColorThief from "colorthief";
import "./App.css";

const clientID = "Access_Key";
const count = 50;
const orientation = "portrait";
const endpoint = `https://api.unsplash.com/photos/random/?client_id=${clientID}&count=${count}&orientation=${orientation}`;

function calculateOppositeColor(rgbColor) {
  const r = 255 - rgbColor[0];
  const g = 255 - rgbColor[1];
  const b = 255 - rgbColor[2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sum = max + min;
  const oppositeR = sum - r;
  const oppositeG = sum - g;
  const oppositeB = sum - b;
  return [oppositeR, oppositeG, oppositeB];
}

Modal.setAppElement("#root"); // Add this line to set the app element

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [colorPalette, setColorPalette] = useState([]);
  const [modalBackgroundColor, setModalBackgroundColor] = useState("#161616");
  const [modalCloseButtonColor, setModalCloseButtonColor] = useState("rgb(255, 119, 0)");

  useEffect(() => {
    fetch(endpoint)
      .then((response) => response.json())
      .then((jsonData) => {
        setImages(jsonData);
      });
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const colorThief = new ColorThief();
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = selectedImage.urls.regular;
  
      img.onload = () => {
        const palette = colorThief.getPalette(img, 5);
        setColorPalette(palette);
        const vibrantColor = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`;
        const oppositeColor = calculateOppositeColor(palette[0]);
        const oppositeBackgroundColor = `rgb(${oppositeColor[0]}, ${oppositeColor[1]}, ${oppositeColor[2]})`;
        setModalBackgroundColor(oppositeBackgroundColor);
        setModalCloseButtonColor(vibrantColor);
      };
    }
  }, [selectedImage]);
  

  function handleCardClick(image) {
    setSelectedImage(image);
  }

  function handleColorClick(hexCode) {
    navigator.clipboard.writeText(hexCode)
      .then(() => {
        alert(`Copied "${hexCode}" to clipboard!`);
      })
      .catch((error) => {
        console.error("Failed to copy hex code to clipboard:", error);
      });
  }

  return (
    <div className="container">
      <div className="row row-cols-5 g-3">
        {images.map((image) => (
          <div className="col d-flex align-items-center" key={image.id}>
            <div className="card" onClick={() => handleCardClick(image)}>
              <img src={image.urls.small} alt={image.alt_description} className="card-img-top" />
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={selectedImage !== null}
        onRequestClose={() => setSelectedImage(null)}
        contentLabel="Image Modal"
        className="custom-modal" // Added class name for styling
        overlayClassName="custom-overlay" // Added overlay class name for styling
        style={{
          content: { backgroundColor: modalBackgroundColor },
        }}
      >
        <button
          className="close-button"
          onClick={() => setSelectedImage(null)}
          style={{ color: modalCloseButtonColor }}
        >
          X
        </button>
        {selectedImage && (
          <>
            <img src={selectedImage.urls.full} alt={selectedImage.alt_description} className="modal-image" />

            <div className="color-palette">
              {colorPalette.map((color, index) => {
                const hexCode = `#${color[0].toString(16).padStart(2, "0")}${color[1].toString(16).padStart(2, "0")}${color[2].toString(16).padStart(2, "0")}`;
                return (
                  <div
                    key={index}
                    className="color-palette-item"
                    style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
                    onClick={() => handleColorClick(hexCode)}
                  >
                    {hexCode}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default App;
