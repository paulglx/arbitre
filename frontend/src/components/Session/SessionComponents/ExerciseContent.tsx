import { useDispatch, useSelector } from 'react-redux'

import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/solid'
import { pushNotification } from '../../../features/notification/notificationSlice';
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { useCreateExerciseMutation } from '../../../features/courses/exerciseApiSlice'
import { useGetExercisesOfSessionQuery } from '../../../features/courses/exerciseApiSlice'
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom'

const ExerciseContent = (props: any) => {

    const session = props.session;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [createExercise] = useCreateExerciseMutation();

    const username = useSelector(selectCurrentUser);
    const isOwner = session?.course?.owners?.map((o: any) => o.username).includes(username);

    const {
        data: exercises,
        isLoading: exercisesIsLoading,
        isSuccess: exercisesIsSuccess,
        isError: exercisesIsError,
    } = useGetExercisesOfSessionQuery({ session_id: session?.id });

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

    const handleCreateExercise = async () => {
        try {
            const newExercise: any = await createExercise({
                title: "",
                description: "",
                session_id: session?.id,
            }).unwrap()
            //Redirect to new exercise
            navigate(`/exercise/${newExercise?.id}`)
        } catch (e) {
            dispatch(pushNotification({
                message: "Something went wrong. The exercise has not been created",
                type: "error"
            }));
        }
    }

    //Create session button (teacher only)
    const CreateExerciseButton = () => isOwner ? (
        <button
            id="create-exercise-button"
            className="flex items-center justify-center m-2 md:m-6 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 font-bold rounded-md shadow shadow-blue-50 transition duration-300 ease-in-out"
            onClick={handleCreateExercise}
        >
            <PlusIcon className="w-5 h-5 mr-1" />
            Create Exercise
        </button>
    ) : (<></>)


    if (exercisesIsLoading) {
        return (
            <p>Loading exercises...</p>
        )
    }
    else if (exercisesIsSuccess && exercises.length === 0) {
        return (
            <ul className="border border-gray-300 rounded-md flex justify-center">
                <li id="no-sessions-warning" className="text-muted text-center border-dashed flex flex-col items-center">
                    <br />
                    <p>This course doesn't have any sessions.</p>
                    <CreateExerciseButton />
                </li>
            </ul>
        )
    }
    else if (exercisesIsSuccess) {
        return (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  mt-2 md:mt-6">
                    {sortedExercises.map((exercise: any, i: number) => (
                        <Link
                            key={i}
                            className="border bg-gray-50 border-gray-300 rounded-md shadow p-4 flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                            to={"/exercise/" + exercise.id}
                        >
                            <p className={`text-xl line-clamp-3 font-medium ${exercise.title ? "text-gray-700" : "text-gray-500"}`}>
                                {exercise.title ? exercise.title : "Untitled Exercise"}
                            </p>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center mt-1 md:mt-2">
                    <CreateExerciseButton />
                </div>
            </>
        )
    }
    else if (exercisesIsError) {
        return (
            <p>Something went wrong while loading the exercises.</p>
        )
    }

    return null;

}

export default ExerciseContent