import React, { useState, useEffect } from "react";

const ProgressiveImage = ({ lowQualitySrc, highQualitySrc, alt }) => {
  const [highQualityLoaded, setHighQualityLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = highQualitySrc;
    img.onload = () => setHighQualityLoaded(true);
  }, [highQualitySrc]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <img
        src={lowQualitySrc}
        alt={alt}
        style={{
          filter: highQualityLoaded ? "none" : "blur(10px)",
          transition: "filter 0.5s ease-out",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      />
      {highQualityLoaded && (
        <img
          src={highQualitySrc}
          alt={alt}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transition: "opacity 0.5s ease-out",
            opacity: highQualityLoaded ? 1 : 0,
          }}
        />
      )}
    </div>
  );
};

export default ProgressiveImage;
