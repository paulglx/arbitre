import { useGetExercisesOfSessionQuery } from "../../../features/courses/exerciseApiSlice";
import { useMemo } from 'react';
import GradingExercise from "./GradingExercise";


const GradingSession = (props: any) => {
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


    return (
        <>
            <div className="border bg-gray-50 border-gray-300 rounded-md shadow p-4 flex flex-col items-center">
                <h1 key={props.session.id}>Session: {props.session.title}</h1>
                {sortedExercises ? sortedExercises.map((exercise: any) => (
                    <GradingExercise exercise={exercise} key={exercise.id} />

                )) : null}


            </div>
            <br />
        </>
    )
}

export default GradingSession