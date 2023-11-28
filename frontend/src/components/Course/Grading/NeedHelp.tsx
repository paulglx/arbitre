const NeedHelp = () => {
    return (
        <div className="bg-gradient-to-r border border-blue-500 bg-blue-50 text-blue-600 p-8 rounded-xl my-4 w-full text-justify">
            <h2 className="text-xl font-bold text-blue-700">How to grade courses</h2>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-700">Step 1: Complete the Evaluation Grid</h3>
                <p>
                    The grid is organized by sessions, where you will find the exercises to evaluate.
                    Enter the amount of points given by each exercise. <br />
                    <span className="italic">Make sure to click Save.</span>
                </p>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-700">Step 2: Evaluate the Tests</h3>
                <p>
                    For each exercise, you can assign a coefficient to each test. To do so, click on the arrow to the left of the exercise. <br />
                    <span className="italic">Make sure to click Save.</span>
                </p>
            </div>
            <div className="">
                <h3 className="text-lg font-semibold mb-2 text-blue-700">Step 3: Review Each Student's Grades</h3>
                <p>
                    To view student grades, click on "Dashboard" on the navigation bar. <br />
                    There, you can access the grades of all students and see a detailed summary of the results.
                </p>
            </div>
        </div>
    );
};

export default NeedHelp;
