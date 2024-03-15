import CodePreview from '../../Util/CodePreview/CodePreview'
import React from 'react'
import { XMarkIcon } from "@heroicons/react/24/solid"

const TestResultCodePreviewModal = (props: any) => {
    const { submission, show, setShow } = props
    return (
        <div
            id="codePreviewModal"
            aria-hidden={!show}
            className={"fixed grid place-items-center z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0 h-screen max-h-full bg-gray-900 bg-opacity-50 " + (show ? "visible" : "hidden")}
        >
            <div className="relative w-full max-w-lg md:max-w-2xl lg:max-w-4xl max-h-full">
                <div className="relative bg-white rounded-lg shadow border">

                    <div className="flex items-start justify-between px-4 py-3 border-b rounded-t bg-gray-50">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {submission?.file?.split("/").pop()}
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 mt-1 rounded-lg text-sm ml-auto inline-flex items-center"
                            onClick={() => {
                                setShow(false)
                            }}

                        >
                            <XMarkIcon className="w-6 h-6" />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    {show ? <CodePreview submissionId={submission.id} /> : <></>}

                </div>
            </div>
        </div >
    )
}

export default TestResultCodePreviewModal