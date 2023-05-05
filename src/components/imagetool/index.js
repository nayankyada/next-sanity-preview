import { useEffect, useRef, useState } from "react";
import { useDebounceEffect } from "./useDebounceEffect";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import "react-image-crop/dist/ReactCrop.css";
import Select from "react-select";
import { options } from "./utill";

const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
};

const ImageTool = (props) => {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState();

  useEffect(() => {
    if (props.aspect) {
      let newAspect = options.find((asp) => asp.label === props.aspect);
      console.log(newAspect);
      if (newAspect) {
        setAspect(newAspect);
      } else {
        setAspect({ label: "Free", value: undefined });
      }
    }
  }, []);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(null);
      setCompletedCrop(null)
    }
  };

  useEffect(() => {
    if (aspect && imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, aspect.value));
    }
  }, [aspect]);

  const onDownloadCropClick = () => {
    console.log(completedCrop);
    if (!previewCanvasRef.current) {
      throw new Error("Crop canvas does not exist");
    }
    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error("Failed to create blob");
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      blobUrlRef.current = URL.createObjectURL(blob);
      if (hiddenAnchorRef.current) {
        hiddenAnchorRef.current.href = blobUrlRef.current;
        hiddenAnchorRef.current?.click();
      }
    });
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  useEffect(() => {
    console.log(aspect);
  }, [aspect]);

  const handleToggleAspectClick = () => {
    setAspect({ label: "Free", value: undefined });
    const { width, height } = imgRef.current;
    setCrop(centerAspectCrop(width, height, 4 / 3));
  };
  return (
    <div className="App">
      <div className="cropControls">
        <div>
          <div className="file-input">
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              name="file-input"
              id="file-input"
              className="file-input__input"
            />
            <label className="file-input__label" for="file-input">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="upload"
                className="svg-inline--fa fa-upload fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M9.71,6.71,11,5.41V17a1,1,0,0,0,2,0V5.41l1.29,1.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-3-3a1,1,0,0,0-1.42,0l-3,3A1,1,0,0,0,9.71,6.71ZM18,9H16a1,1,0,0,0,0,2h2a1,1,0,0,1,1,1v7a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H8A1,1,0,0,0,8,9H6a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V12A3,3,0,0,0,18,9Z"
                />
              </svg>
              <span>Upload</span>
            </label>
          </div>
        </div>
        {!!imgSrc && (
          <Select
            options={options}
            defaultValue={aspect}
            onChange={(e) => {
              if (e.value) {
                setAspect(e);
                setCrop(null)
                setCompletedCrop(null);
              } else {
                handleToggleAspectClick();
              }
            }}
            className="react_select"
          />
        )}
        {!!completedCrop && (
          <div>
            <button className="downloadButton" onClick={onDownloadCropClick}>
              <label className="iconText">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="upload"
                  className="svg-inline--fa fa-upload fa-w-16"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  strokeWidth={10}
                >
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="M8.29,13.29a1,1,0,0,0,0,1.42l3,3a1,1,0,0,0,1.42,0l3-3a1,1,0,0,0-1.42-1.42L13,14.59V3a1,1,0,0,0-2,0V14.59l-1.29-1.3A1,1,0,0,0,8.29,13.29ZM18,9H16a1,1,0,0,0,0,2h2a1,1,0,0,1,1,1v7a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H8A1,1,0,0,0,8,9H6a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V12A3,3,0,0,0,18,9Z"
                  />
                </svg>
                <span>Download</span>
              </label>
            </button>
            <a
              ref={hiddenAnchorRef}
              download
              style={{
                position: "absolute",
                top: "-200vh",
                visibility: "hidden",
              }}
            >
              Hidden download
            </a>
          </div>
        )}
        {/* <div>
          <label htmlFor="scale-input">Scale: </label>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="rotate-input">Rotate: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
            }
          />
        </div> */}
      </div>

      <div className="imageTool">
        {!!imgSrc && (
          <div className="cropTool">
            <ReactCrop
              crop={crop}
              style={{ maxHeight: "90vh" }}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect.value}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
        )}
        {!!completedCrop && (
          <div className="previewImage">
            <div>
              <canvas
                ref={previewCanvasRef}
                style={{
                  display: "none",
                  objectFit: "contain",
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ImageTool;
