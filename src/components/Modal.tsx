import { FC, ReactNode, useEffect, useRef } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  children: ReactNode;
};

const Modal: FC<ModalProps> = ({ open, onClose, size = "md", children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "max-w-xs";
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-8xl";
      default:
        return "max-w-md";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-10 overflow-y-auto ${open ? "" : "hidden"}`}
    >
      <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-6 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className={`inline-block transform rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle ${getSizeClasses()}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          ref={modalRef}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
