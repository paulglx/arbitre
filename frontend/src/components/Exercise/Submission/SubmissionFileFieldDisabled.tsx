const SubmissionFileFieldDisabled = () => {
    return (<div className="flex items-center justify-between space-x-3 rounded-lg pt-2 pb-4 select-none">
        <div className="block rounded-lg border p-2 w-full">
            <div className="block text-gray-700 w-full text-sm mr-2 py-2 px-4 rounded-lg border-0">
                Submissions are closed for this exercise.
            </div>
        </div>

        <div className='rounded-lg bg-gray-100 px-6 py-3 text-gray-500 font-semibold border border-gray-200 cursor-not-allowed'>
            Submit
        </div>
    </div>)
}

export default SubmissionFileFieldDisabled