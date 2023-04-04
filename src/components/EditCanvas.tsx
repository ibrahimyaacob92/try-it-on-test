import React, { useRef, useEffect, useState } from "react";

interface Props {
  imageUrl: string;
  initialImageDataUrl?: string;
  onImageEdit: (imageDataUrl: string) => void;
  eraserSize: number;
}

function EditCanvas({
  initialImageDataUrl,
  onImageEdit,
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
    img.src = initialImageDataUrl || imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, [imageUrl, initialImageDataUrl]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - 30) * 1.4;
    const y = (event.clientY - rect.top + 10) * 1.3;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, eraserSize / 2, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const imageDataUrl = canvas.toDataURL();
    onImageEdit(imageDataUrl);
  };

  return (
    <div>
      <canvas className="w-full" ref={canvasRef} onClick={handleCanvasClick} />
    </div>
  );
}

export default EditCanvas;
