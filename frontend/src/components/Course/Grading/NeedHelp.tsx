const NeedHelp = () => {
    return (
        <div className="bg-gradient-to-r from-blue-300 to-blue-500 text-white p-8 rounded-lg my-4 w-full text-justify">
            <h2 className="text-3xl font-bold mb-6">How to grade courses?</h2>
            <p className="text-lg mb-6">
                With our application, you can quickly and easily obtain the grade for each session and exercise.
                Follow these simple steps to get started:
            </p>
            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Step 1: Complete the Evaluation Grid</h3>
                <p>
                    The grid is organized by sessions, where you will find the exercises to evaluate.
                    Simply enter the grade that each exercise deserves.
                </p>
            </div>
            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Step 2: Evaluate the Tests</h3>
                <p>
                    After entering the exercise grade, it's time to adjust the importance of each test.
                    Here, you will assign a weighted value to each test, with a range from 0 to 10 to decide!
                    For example, if you have 4 tests and assign them a weight of 1, and each exercise is worth 1 point,
                    if you pass all the tests, you will get the maximum grade of 0.25, resulting in a total exercise grade of 1.
                </p>
            </div>
            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Step 3: Review Each Student's Grades</h3>
                <p>
                    If you wish to review each student's grades, simply go to the navigation bar and click on "Dashboard".
                    There, you can access the grades of all students and see a detailed summary of the results.
                </p>
            </div>
        </div>
    );
};

export default NeedHelp;
