

const GradingExercise = (props: any) => {



    return (
        <>
            <div className="flex flex-row items-center w-full">
                <div className="flex-1 mx-2 p-2 bg-blue-50 border-2 border-blue-100 rounded-lg">
                    <h1 className="text-gray-700 font-semibold">{props.exercise.title}</h1>
                </div>
                <div className="flex items-center">
                    <span className="px-3 py-2  bg-blue-50 border-2 border-blue-100 rounded-l-lg font-semibold text-gray-700">Grading</span>
                    <input
                        type="text"
                        className="w-32 px-4 py-2 text-gray-700 bg-white border-2 border-blue-100 rounded-r-lg shadow-sm focus:outline-none focus:border-indigo-500"
                        placeholder=""
                    />
                </div>
            </div>
        </>
    )
}

export default GradingExercise