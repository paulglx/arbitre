import { useEffect, useMemo } from 'react';

import GradingTest from "./GradingTest"
import { useGetTestsOfExerciseQuery } from "../../../features/courses/testApiSlice";
import { useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ChevronRightIcon } from '@heroicons/react/16/solid';

const GradingExercise = (props: any) => {
  const [inputGradeValue, setInputGradeValue] = useState('');
  const [openTests, setOpenTests] = useState(false);

  const {
    data: testsResponse,
    isSuccess: testsIsSuccess,
    isLoading: testsIsLoading,
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
      <div className="flex flex-row items-center w-full space-x-2 group">
        <button
          className="flex items-center w-full"
          onClick={() => setOpenTests(!openTests)}
        >
          <span
            className='p-1 border rounded-full group-hover:bg-gray-50 me-2'
          >
            {openTests ? <ChevronDownIcon className='size-4' /> : <ChevronRightIcon className='size-4' />}
          </span>
          <h2 className={` ${openTests ? "text-blue-600" : "text-gray-700"} px-2 py-1 font-semibold group-hover:underline`}>{props.exercise.title}</h2>
        </button>
        <div className="flex items-center">
          <label className="bg-blue-50 border border-blue-100 rounded-l-lg text-gray-700 px-2 py-1 flex items-center">Grade</label>
          <input
            aria-label="grade"
            type="number"
            className="text-right w-16 pl-2 py-1 text-gray-700 bg-white rounded-r-lg border border-l-0 border-blue-100 focus:outline-none focus:border-blue-600"
            placeholder=""
            min="0"
            value={inputGradeValue}
            onChange={handleGradeValueChange}
            name={props.exercise.title}
          />
        </div>
      </div>
      {openTests ?
        <div className='border-s ps-7 ms-3'>
          {sortedTests?.length > 0 ? sortedTests.map((test: any) => (
            <GradingTest test={test} key={test.id} handleTestCoefficientChangeValue={props.handleTestCoefficientChangeValue} />
          )) : <div className='text-gray-500'>
            {testsIsLoading ? "Loading..." : "There are no tests for this exercise."}
          </div>}
        </div> : null}
    </>

  )
}

export default GradingExercise
