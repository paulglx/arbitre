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
            .catch((e) => {
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
                <h1 className="text-2xl text-gray-700 mb-2">
                    <span>Session :&nbsp;</span>
                    <span className="font-bold">{props.session.title}</span>
                </h1>

                <hr className="border-t-2 mb-4" />

                <div className="flex flex-wrap gap-4 w-full">
                    {sortedExercises ? sortedExercises.map((exercise: any) => (
                        <GradingExercise
                            exercise={exercise}
                            key={exercise.id}
                            handleExerciseGradeChangeValue={handleExerciseGradeChangeValue}
                            handleTestCoefficientChangeValue={handleTestCoefficientChangeValue}
                        />
                    )) : null}
                </div>
                <div className="flex justify-center items-center w-full">
                    <button
                        className="inline-block w-40 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 my-4 rounded-md shadow-lg transition-colors duration-300"
                        onClick={() => handleSaveGrade()}
                    >
                        Save
                    </button>
                </div>
            </div>
            <br />
        </>
    )
}

export default GradingSession