import { useEffect, useMemo } from 'react';

import GradingTest from "./GradingTest"
import { useGetTestsOfExerciseQuery } from "../../../features/courses/testApiSlice";
import { useState } from "react";

const GradingExercise = (props: any) => {
    const [inputGradeValue, setInputGradeValue] = useState('');

    const {
        data: testsResponse,
        isSuccess: testsIsSuccess,
    } = useGetTestsOfExerciseQuery({ exercise_id: props.exercise.id });

    const sortedTests = useMemo(() => {
        if (testsIsSuccess) {
            const testsToSort = structuredClone(testsResponse);
            testsToSort.sort((a: any, b: any) => {
                return a.name.localeCompare(b.name);
            });
            return testsToSort;
        }
        return testsResponse;
    }, [testsResponse, testsIsSuccess]);

    useEffect(() => {
        if (props.exercise)
            setInputGradeValue(props.exercise.grade || "")
    }, [props.exercise]);

    const handleGradeValueChange = (e: any) => {
        let value = e.target.value;
        value = value > 100 ? 100 : value;
        value = value < 0 ? 0 : value;

        setInputGradeValue(value);
        props.handleExerciseGradeChangeValue(value, props.exercise.id);
    }


    return (
        <>
            <div className="flex flex-wrap gap-4  bg-gray-50 rounded-md border border-gray-300 py-4 px-2 w-full">
                <div className="flex flex-row items-center w-full space-x-4">
                    <div className="flex-1 flex items-center bg-blue-50 border border-blue-100 rounded-lg h-10 px-4">
                        <h1 className="text-gray-700 font-semibold">{props.exercise.title}</h1>
                    </div>
                    <div className="flex items-center">
                        <label className="bg-blue-50 border border-blue-100 rounded-l-lg text-gray-700 px-4 py-2 flex items-center h-10">Grade</label>
                        <input
                            type="number"
                            className="w-32 px-4 py-2 text-gray-700 bg-white rounded-r-lg border border-blue-100 focus:outline-none focus:border-blue-600 h-10"
                            placeholder=""
                            min="0"
                            value={inputGradeValue}
                            onChange={handleGradeValueChange}
                            name={props.exercise.title}
                        />
                    </div>
                </div>
                {sortedTests ? sortedTests.map((test: any) => (
                    <GradingTest test={test} key={test.id} handleTestCoefficientChangeValue={props.handleTestCoefficientChangeValue} />
                )) : null}
            </div>
        </>

    )
}

export default GradingExercise