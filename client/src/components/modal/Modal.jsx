import React from "react";

const Modal = ({ visibility, open, width, height, maxHeight, title, content }) => {
  return (
    <div className="modal">
      <div className="container" style={{ width: width, height: height, maxHeight: maxHeight }}>
        <div className="head">
          <h3 className="title">{title}</h3>
          {visibility && (
            <span className="close" onClick={open}>
              &times;
            </span>
          )}
        </div>
        <div className="body">{content}</div>
      </div>
    </div>
  );
};

export default Modal;
