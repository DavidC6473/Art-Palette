import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./App.css";

const clientID = "Access_Key";
const count = 50;
const orientation = "portrait";
const endpoint = `https://api.unsplash.com/photos/random/?client_id=${clientID}&count=${count}&orientation=${orientation}`;

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(endpoint)
      .then((response) => response.json())
      .then((jsonData) => {
        setImages(jsonData);
      });
  }, []);

  function handleCardClick(image) {
    setSelectedImage(image);
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
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <button className="close-button" onClick={() => setSelectedImage(null)}>X</button>
        {selectedImage && (
          <img src={selectedImage.urls.full} alt={selectedImage.alt_description} className="modal-image" />
        )}
      </Modal>
    </div>
  );
}

export default App;

