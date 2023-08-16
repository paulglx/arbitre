const NeedHelp = () => {
    return (
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-8 rounded-xl my-4 w-full text-justify">
            <h2 className="text-3xl font-bold">How to grade courses</h2>
            <p className="text-md mb-6">
                To grade exercises, follow these steps :
            </p>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Step 1: Complete the Evaluation Grid</h3>
                <p>
                    The grid is organized by sessions, where you will find the exercises to evaluate.
                    Enter the amount of points that the exercise rewards in the "Grade" field. <br />
                    <span className="italic">Make sure to click Save.</span>
                </p>
            </div>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Step 2: Evaluate the Tests</h3>
                <p>
                    After entering the exercise grade, adjust the importance of each test.
                    Here, you will assign a coefficient to each test, from 0 to 100.
                    For example, if you have 4 tests and assign them a weight of 1, and each exercise is worth 1 point,
                    if you pass all the tests, you will get the maximum grade of 0.25, resulting in a total exercise grade of 1. <br />
                    <span className="italic">Make sure to click Save.</span>
                </p>
            </div>
            <div className="">
                <h3 className="text-xl font-semibold mb-2">Step 3: Review Each Student's Grades</h3>
                <p>
                    To view student grades, click on "Dashboard" on the navigation bar. <br />
                    There, you can access the grades of all students and see a detailed summary of the results.
                </p>
            </div>
        </div>
    );
};

export default NeedHelp;
