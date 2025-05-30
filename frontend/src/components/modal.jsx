import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md mx-4">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 text-2xl font-bold hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
