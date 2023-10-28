import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/solid'

import Modal from '../Modal';
import { useState } from 'react';

const CSEOwnerActions = (props: any) => {

    const {
        isOwner,
        edit,
        setEdit,
        handleUpdate,
        handleDelete
    } = props;

    const [modalIsOpen, setModalIsOpen] = useState(false);

    return isOwner ? (<>
        <div className="flex flex-row gap-2 ml-1">
            {edit ? (
                <button
                    onClick={() => {
                        setEdit(false);
                        handleUpdate();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white border font-semibold py-2 px-4 rounded"
                    aria-label='Cancel edit'
                >
                    Save
                </button>) : (
                <button
                    onClick={() => setEdit(true)}
                    className="border font-semibold py-2 px-4 rounded hover:bg-gray-50"
                    aria-label='Edit exercise'
                >
                    Edit
                </button>)}
            <button
                onClick={() => setModalIsOpen(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                aria-label='Delete exercise'
                aria-haspopup="true"

            >
                <TrashIcon className="w-6 h-6" />

            </button>
        </div>
        {modalIsOpen &&
            <Modal
                title={<h2 className="text-xl font-semibold">Are you sure?</h2>}
                icon={<ExclamationTriangleIcon className="text-yellow-500 w-12 h-12 mb-2" />}
                decription={<p className="mb-4">This will permanently remove this session and all of its exercises.</p>}
                handleCloseModal={() => setModalIsOpen(false)}
                delete={handleDelete}
            />
        }
    </>) : null;
}

export default CSEOwnerActions