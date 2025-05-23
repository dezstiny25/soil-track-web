import { TriangleAlert } from "lucide-react";


interface ConfirmModalProps {
  title: string;
  message: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  isOpen,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {

  if (!isOpen) return null;

  return (
    <div className="modal modal-open fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={onCancel}>
      <div className="modal-box rounded-md max-w-md bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-5 items-center">
          <div className="flex items-center justify-center w-10 h-10 p-2 rounded-full bg-red-500/50">
            <TriangleAlert size={20} className="text-error" />
          </div>
          <div className="leading-tight">
            <h3 className="font-semibold text-lg"> {title} </h3>
            <p className="text-md"> {message} </p>
          </div>
        </div>
        <div className="modal-action mt-8">
          <button className="btn btn-sm border-gray-300 bg-transparent hover:bg-gray-200" onClick={onCancel}>
            {cancelText}
          </button>

          <button className="btn btn-sm border-none bg-red-600 hover:bg-red-500 text-white" onClick={onConfirm}>
             {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
