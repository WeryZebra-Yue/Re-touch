import "./App.css";
import { useRef } from "react";
import logo from "./Group.svg";

function App() {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const TextRef = useRef(null);
  const inputRef = useRef(null);
  const MainApp = useRef(null);

  const getAreas = (contours) => {
    const cv = document.cv;
    let areas = new Array(contours.size());
    for (let i = 0; i < contours.size(); ++i) {
      let contour = contours.get(i);
      areas[i] = cv.contourArea(contour, false);
    }
    return areas;
  };
  const cutImage = (e) => {
    if (!document.cv) {
      if (TextRef) {
        TextRef.current.innerHTML = "Opencv.js is not loaded yet!";
        setTimeout(() => {
          TextRef.current.innerHTML = "Image Frame - 2";
        }, 1000);
      }
      return;
    }
    // console.log(logo)
    let log = window.location.href;
    log = log.substring(0, log.length - 1) + logo;

    const cv = document.cv;
    if (!imgRef.current.src || imgRef.current.src === log) {
      console.log("no image");
      TextRef.current.innerHTML = "No Image!";
      setTimeout(() => {
        TextRef.current.innerHTML = "Image Frame - 2";
      }, 1000);
      return;
    }
    let src = cv.imread(imgRef.current);
    let original = cv.imread(imgRef.current);
    let dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, src, 120, 200, cv.THRESH_BINARY);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(
      src,
      contours,
      hierarchy,
      cv.RETR_CCOMP,
      cv.CHAIN_APPROX_SIMPLE
    );

    let areas = getAreas(contours);
    let maxArea = Math.max.apply(null, areas);
    let maxIndex = areas.indexOf(maxArea);
    let color = new cv.Scalar(0, 0, 255);
    cv.drawContours(
      dst,
      contours,
      maxIndex,
      color,
      1,
      cv.LINE_8,
      hierarchy,
      100
    );
    let contour = contours.get(maxIndex);
    let rect = cv.boundingRect(contour);
    let x = rect.x;
    let y = rect.y;
    let width = rect.width;
    let height = rect.height;
    console.log(x, y, width, height);
    rect = new cv.Rect(x, y, width, height);
    dst = original.roi(rect);

    cv.imshow("canvasOutput", dst);
    src.delete();
    dst.delete();
    contours.delete();
    hierarchy.delete();
  };

  return (
    <div ref={MainApp}>
      <div className="header">
        <img src={logo}></img>
      </div>

      <div className={"app"}>
        <div className="inputoutput">
          <h2 className="caption"> Image Frame - 1</h2>

          <input
            className="button"
            ref={inputRef}
            type="file"
            id="fileInput"
            name="file"
            onInput={(e) => {
              imgRef.current.src = URL.createObjectURL(e.target.files[0]);
              imgRef.current.src = URL.createObjectURL(e.target.files[0]);
            }}
          />
        </div>

        <div className="inputoutput">
          <canvas className=" canva" ref={canvasRef} id="canvasOutput"></canvas>

          <h2 className="caption" ref={TextRef}>
            {" "}
            Image Frame - 2
          </h2>

          <button
            className="button"
            onClick={() => {
              TextRef.current.innerHTML = "Loading...";

              imgRef.current.style =
                "width: auto!important; height: auto!important;max-height:none!important;max-width:none!important;";
              try {
                cutImage();
              } catch {
                const cv = document.cv;
                cv.imshow("canvasOutput", cv.imread(imgRef.current));
              } finally {
                imgRef.current.style =
                  "max-height: 900px; max-width: 80%!important;";
                MainApp.current.style = "visibility: visible";

                TextRef.current.innerHTML = "Image Frame - 2";
              }
            }}
          >
            Crop and Resize
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
