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
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 font-semibold py-2 px-4 rounded-lg shadow-sm sm:leading-6 ml-1 transition-all"
                    aria-label='Save exercise'
                >
                    Save
                </button>) : (
                <button
                    onClick={() => setEdit(true)}
                    className="border font-semibold py-2 px-4 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 shadow-sm sm:leading-6 transition-all"
                    aria-label='Edit exercise'
                >
                    Edit
                </button>)}
            <button
                onClick={() => setModalIsOpen(true)}
                className="bg-gray-50 hover:bg-red-50 border hover:border-red-300 text-red-600 font-semibold py-2 px-4 rounded-lg shadow-sm sm:leading-6 transition-all"
                aria-label='Delete exercise'
                aria-haspopup="true"

            >
                <TrashIcon className="w-5 h-5" />

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