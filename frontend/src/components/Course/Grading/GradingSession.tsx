import { useGetExercisesOfSessionQuery, useUpdateExerciseMutation } from "../../../features/courses/exerciseApiSlice";
import { useMemo, useState } from 'react';

import GradingExercise from "./GradingExercise";
import { pushNotification } from "../../../features/notification/notificationSlice";
import { useDispatch } from "react-redux";
import { useUpdateSessionMutation } from "../../../features/courses/sessionApiSlice";
import { useUpdateTestMutation } from "../../../features/courses/testApiSlice";

const GradingSession = (props: any) => {
  const [exerciseGradeValues, setExerciseGradeValues] = useState<Record<number, string>>({})
  const [testCoefficientValues, setTestCoefficientValues] = useState<Record<number, any>>({});
  const [updateExercise] = useUpdateExerciseMutation();
  const [updateSession] = useUpdateSessionMutation();
  const [updateTest] = useUpdateTestMutation();
  const dispatch = useDispatch();


  const {
    data: exercises,
    isSuccess: exercisesIsSuccess,
  } = useGetExercisesOfSessionQuery({ session_id: props.session?.id });

  const sortedExercises = useMemo(() => {
    if (exercisesIsSuccess) {
      const exercisesToSort = structuredClone(exercises);
      exercisesToSort.sort((a: any, b: any) => {
        return a.title.localeCompare(b.title);
      });
      return exercisesToSort;
    }
    return exercises;
  }, [exercises, exercisesIsSuccess]);

  const handleSaveExerciseGrade = async (exercise: any) => {
    if (exercise.grade)
      await updateExercise(exercise)
        .unwrap()
        .catch((e) => {
          console.log(e);
        })
  }

  const handleSaveSessionGrade = async (session: any) => {
    await updateSession(session)
      .unwrap()
      .then(() => {
        dispatch(pushNotification({
          message: "The session grading grid has been updated",
          type: "success"
        }));
      })
      .catch(() => {
        dispatch(pushNotification({
          message: "Something went wrong. The session grading grid has not been updated",
          type: "error"
        }));
      })
  }

  const handleTestCoefficient = async (testCoefficientValues: any) => {
    await updateTest(testCoefficientValues)
      .unwrap()
      .catch((e) => {
        console.log(e)
      })
  }

  const handleSaveGrade = () => {
    let gradeSession: number = 0
    sortedExercises.forEach((exercise: any) => {
      const gradeExercise = Number(exerciseGradeValues[exercise.id])
      gradeSession += gradeExercise
      handleSaveExerciseGrade({
        ...exercise,
        grade: gradeExercise,
        session_id: exercise.session.id,
      })
    });

    for (const id in testCoefficientValues) {
      const coefficientTest = testCoefficientValues[id].value;
      const exercise_id = testCoefficientValues[id].exercise_id;
      const test_name = testCoefficientValues[id].name;
      handleTestCoefficient({
        id,
        coefficient: coefficientTest,
        exercise: exercise_id,
        name: test_name,
      })
    }

    handleSaveSessionGrade({
      ...props.session,
      grade: gradeSession,
      course_id: props.session.course.id,
    })

  }
  const handleExerciseGradeChangeValue = (value: any, id: number) => {
    let _exerciseGradeValues = exerciseGradeValues;
    _exerciseGradeValues[id] = value;
    setExerciseGradeValues(_exerciseGradeValues)
  }

  const handleTestCoefficientChangeValue = (value: any, name: string, id: number, exercise_id: number) => {
    let _testCoefficientValues = testCoefficientValues;
    _testCoefficientValues[id] = {
      value,
      exercise_id,
      name,
    };
    setTestCoefficientValues(_testCoefficientValues)
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-700">
            <span className="font-bold">{props.session.title}</span>
          </h1>
          <button
            className="bg-blue-50 border-2 border-blue-300 text-blue-600 hover:bg-blue-700 hover:text-white px-6 py-0.5 my-2 text-sm font-semibold rounded-md"
            onClick={() => handleSaveGrade()}
          >
            Save
          </button>
        </div>


        <hr className="mb-4" />

        <div className="flex flex-wrap gap-4 w-full">
          {sortedExercises?.length > 0 ? sortedExercises.map((exercise: any) => (
            <GradingExercise
              exercise={exercise}
              key={exercise.id}
              handleExerciseGradeChangeValue={handleExerciseGradeChangeValue}
              handleTestCoefficientChangeValue={handleTestCoefficientChangeValue}
            />
          )) : <div className="text-gray-500">
            There are no exercises in this session.
          </div>}
        </div>
      </div>
      <br />
    </>
  )
}

export default GradingSession
