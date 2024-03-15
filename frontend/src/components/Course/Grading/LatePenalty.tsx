import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

import { useState } from "react"

const LatePenalty = (props: {
    latePenalty: number,
    setLatePenalty: React.Dispatch<any>,
    edit: boolean
}) => {

    const [accordionOpened, setAccordionOpened] = useState<any>(false)

    const { latePenalty, setLatePenalty, edit } = props

    const isValid = (n: number) => {
        if (!edit)
            return true
        if (!n)
            return false
        return n >= 0 && n <= 100
    }

    return (
        <div className='mb-2'>
            <div
                className={`
                    flex flex-row items-center justify-between px-4 py-3 border cursor-pointer
                    ${accordionOpened ?
                        'bg-gray-100 hover:bg-gray-200 rounded-t-lg'
                        :
                        ' bg-gray-50 hover:bg-gray-100 rounded-lg'
                    }
                `}
                onClick={() => setAccordionOpened(!accordionOpened)}
            >
                <span className="mr-2 font-medium">Manage late submissions penalty</span>
                {accordionOpened ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </div>

            {accordionOpened ?
                <div className="p-4 border border-t-0 rounded-b-lg">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <label id="late-submissions-label" className="text-sm font-medium">Late submissions penalty</label>
                            <span className="text-xs text-gray-500">
                                This percentage of the grade will be deducted on late submissions.
                                {edit ? "" : " Click on the edit button to change this value."}
                            </span>
                            {!isValid(latePenalty) ? <span className="text-xs text-red-500">This field is required and must be between 0 and 100.</span> : <></>}
                        </div>
                        <div className="flex flex-row items-center">
                            <input
                                aria-label="Late submissions penalty"
                                aria-disabled={!edit}
                                aria-invalid={!isValid(latePenalty)}
                                aria-labelledby="late-submissions-label"
                                type="number"
                                className={`w-16 border rounded-md p-1 ${!isValid(latePenalty) ? "border-red-500" : ""}`}
                                value={latePenalty}
                                disabled={!edit}
                                min={0}
                                max={100}
                                onChange={(e) => setLatePenalty(e.target.value)}
                            />
                            <span className={`ml-2 ${!isValid(latePenalty) ? "text-red-500" : "text-gray-800"}`}>%</span>
                        </div>
                    </div>
                </div>

                : <></>
            }
        </div >
    )
}

export default LatePenalty