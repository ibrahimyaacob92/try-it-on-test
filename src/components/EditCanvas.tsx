import React, { useRef, useEffect, useState } from "react";

interface Props {
  imageUrl: string;
  imageDataUrl?: string;
  onImageUpdate: (imageDataUrl: string) => void;
  eraserSize: number;
}

function EditCanvas({
  imageDataUrl,
  onImageUpdate,
  imageUrl,
  eraserSize,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return;
    }

    const img = new Image();
    img.crossOrigin = "*";
    img.src = imageDataUrl || imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, [imageUrl, imageDataUrl]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, eraserSize / 2, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const imageDataUrl = canvas.toDataURL();
    onImageUpdate(imageDataUrl);
  };

  return (
    <div>
      <canvas className="w-full" ref={canvasRef} onClick={handleCanvasClick} />
    </div>
  );
}

export default EditCanvas;
