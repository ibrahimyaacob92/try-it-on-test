import Image from "next/image";
import React, { useState } from "react";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import EditCanvas from "~/components/EditCanvas";
import EraserSizeController from "~/components/EraserSizeController";

type OutputType = RouterOutputs["main"]["getImages"][0];

const Images = () => {
  const { data: imageList, isLoading } = api.main.getImages.useQuery();
  const [selectedImage, setSelectedImage] = useState<OutputType>();
  const [imageDataState, setImageDataState] = useState<
    { data: string; id: number }[]
  >([]);
  const [eraserSize, setEraserSize] = useState(10);

  const handleImageUpdate = (imageId: number, imageData: string) => {
    const imageExist = imageDataState.find((data) => data.id === imageId);
    if (imageExist) {
      setImageDataState(
        imageDataState.map((item) =>
          item.id === imageId ? { id: item.id, data: imageData } : item
        )
      );
    } else {
      setImageDataState([...imageDataState, { id: imageId, data: imageData }]);
    }
  };

  return (
    <>
      <div className="">
        {imageList?.map((image) => {
          const edited = imageDataState.find((data) => data.id === image.id);
          return (
            <div key={`image-${image.id}`}>
              {edited ? (
                <img src={edited.data} alt={""} width={300} height={200} />
              ) : (
                <Image src={image.url} alt={"image"} width={300} height={200} />
              )}
              <div>
                <button
                  onClick={() => setSelectedImage(image)}
                  className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Edit
                </button>
                <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                  Request Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {selectedImage && (
          <div>
            <EditCanvas
              imageUrl={selectedImage.url}
              eraserSize={eraserSize}
              imageDataUrl={
                imageDataState.find((data) => data.id === selectedImage.id)
                  ?.data
              }
              onImageUpdate={(imageDataUrl) =>
                handleImageUpdate(selectedImage.id, imageDataUrl)
              }
            />
            <p>Eraser Size</p>
            <EraserSizeController size={eraserSize} onChange={setEraserSize} />
            <button onClick={() => setSelectedImage(undefined)}>Close</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Images;
