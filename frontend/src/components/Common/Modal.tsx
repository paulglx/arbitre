
const Modal = (props: any) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
      <div className="modal-container bg-white w-96 mx-auto rounded-lg shadow-lg z-50">
        <div className="modal-content p-4 text-center">
          <div className="flex flex-col items-center mb-4">
            {props.icon}
            {props.title}
            
          </div>
          {props.decription}
          <div className="flex justify-center">
            <button
              onClick={props.delete}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2"
            >
              Accept
            </button>
            <button
              onClick={props.handleCloseModal}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
