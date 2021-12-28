import logo from './logo.svg';
import './App.css';
import {useEffect, useRef} from 'react';
function App() {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const inputRef = useRef(null);
 useEffect(() => {
 

 },[])
  return (
    <div className="App">
      <div class="inputoutput">
    <img  className='image'ref={imgRef} id="imageSrc" alt="No Image" />
    <div  class="caption">imageSrc <input ref={inputRef} type="file" id="fileInput" name="file" onInput={(e)=>{
     const cv = document.cv

  imgRef.current.src = URL.createObjectURL(e.target.files[0]);

imgRef.current.onload = function() {
    let src = cv.imread(imgRef.current);
    let original = cv.imread(imgRef.current);
    let dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3);
cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
cv.threshold(src, src, 120, 200, cv.THRESH_BINARY);
let contours = new cv.MatVector();
let hierarchy = new cv.Mat();
// You can try more different parameters
cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

function getAreas(contours) {
    let areas = new Array(contours.size());
    for (let i = 0; i < contours.size(); ++i) {
        let contour = contours.get(i);
        areas[i] = cv.contourArea(contour, false);
    }
    return areas;
}
let areas = getAreas(contours);
let maxArea = Math.max.apply(null, areas);
let maxIndex = areas.indexOf(maxArea);
let color = new cv.Scalar(0, 0, 255);
cv.drawContours(dst, contours, maxIndex, color, 1, cv.LINE_8, hierarchy, 100);
let contour = contours.get(maxIndex);
let rect = cv.boundingRect(contour);
let x = rect.x;
let y = rect.y;
let width = rect.width;
let height = rect.height;
console.log(x, y, width, height);
rect = new cv.Rect(x, y, width, height);
dst = original  .roi(rect);


cv.imshow('canvasOutput', dst);
src.delete(); dst.delete(); contours.delete(); hierarchy.delete();

};

    }} /></div>
  </div>
  
    <div class="inputoutput">
      <canvas className='image' ref={canvasRef} id="canvasOutput" ></canvas>
      <div class="caption"> canvasOutput</div>
    </div>
    </div>
  );
}

export default App;
