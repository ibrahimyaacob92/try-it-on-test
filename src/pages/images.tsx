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
  const [requestEditImage, setRequestEditImage] = useState<OutputType>();
  const [selectedImage, setSelectedImage] = useState<OutputType>();
  const [editRequestPrompt, setEditRequestPrompt] = useState("");
  const [imageDataState, setImageDataState] = useState<
    { data: string; id: number }[]
  >([]);

  const { mutate } = api.main.uploadRequest.useMutation({
    onSuccess: (d) => {
      setEditRequestPrompt("");
      alert(d.message);
    },
    onMutate: () => setRequestEditImage(undefined),
    onError: (e) => alert(e.message),
  });
  const [eraserSize, setEraserSize] = useState(10);

  const handleSubmitPrompt = () => {
    if (requestEditImage) {
      mutate({ prompt: editRequestPrompt, imageUrl: requestEditImage.url });
    }
  };

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
                <button
                  className="grow rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                  onClick={() => setRequestEditImage(image)}
                >
                  Request Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        size="lg"
        open={!!requestEditImage}
        onClose={() => setRequestEditImage(undefined)}
      >
        <div className="flex flex-col gap-3">
          <p className="font-semibold">
            Tell the AI how do you want to edit the image!
          </p>
          <textarea
            className="w-full rounded-lg border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={editRequestPrompt}
            onChange={(e) => setEditRequestPrompt(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmitPrompt}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
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
                <p className="font-size-sm">Eraser Size</p>
                <EraserSizeController
                  size={eraserSize}
                  onChange={setEraserSize}
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
                  onClick={() => handleReset(selectedImage.id)}
                >
                  Reset
                </button>
                <button
                  className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
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
