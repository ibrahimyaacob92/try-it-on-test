import Image from "next/image";
import React, { useState } from "react";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import EditCanvas from "~/components/EditCanvas";
import EraserSizeController from "~/components/EraserSizeController";
import Modal from "~/components/Modal";

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

  const handleReset = (imageId: number) => {
    setImageDataState(imageDataState.filter((data) => data.id !== imageId));
  };

  return (
    <>
      <div className="mx-auto my-10 grid max-w-fit grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:mx-auto lg:grid-cols-4">
        {imageList?.map((image) => {
          const edited = imageDataState.find((data) => data.id === image.id);
          return (
            <div
              className="flex flex-col items-stretch justify-between gap-2"
              key={`image-${image.id}`}
            >
              {edited ? (
                <img src={edited.data} alt={""} width={300} height={200} />
              ) : (
                <Image
                  className="rounded"
                  src={image.url}
                  alt={"image"}
                  width={300}
                  height={200}
                />
              )}
              <div className="flex items-stretch gap-2">
                <button
                  onClick={() => setSelectedImage(image)}
                  className="grow rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Edit
                </button>
                <button className="grow rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                  Request Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div></div>
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(undefined)}
        size="xl"
      >
        {selectedImage && (
          <div className="flex flex-col gap-4">
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
            <div className="flex justify-between">
              <div>
                <p>Eraser Size</p>
                <EraserSizeController
                  size={eraserSize}
                  onChange={setEraserSize}
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                  onClick={() => handleReset(selectedImage.id)}
                >
                  Reset
                </button>
                <button
                  className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                  onClick={() => setSelectedImage(undefined)}
                >
                  Close
                </button>
                <button
                  className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                  onClick={() => setSelectedImage(undefined)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Images;
