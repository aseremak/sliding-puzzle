import React from 'react';
import image420 from '../../assets/images/420Koalas.jpg';
import './ImagePreview.css';

const ImagePreview = (props) => {
  const styleSize = {
    width: props.width + 'px',
    height: props.width + 'px'
}  
  return (
    <div className="ImagePreview" style={styleSize}>
      <img src={image420} style={styleSize} alt="Preview" />
      {/* <img src={true} alt="" /> */}
    </div>
  )
};

export default ImagePreview;