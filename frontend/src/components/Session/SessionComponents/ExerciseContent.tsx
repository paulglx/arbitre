import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/solid'
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { useGetExercisesOfSessionQuery } from '../../../features/courses/exerciseApiSlice'
import { useSelector } from 'react-redux'

const ExerciseContent = (props: any) => {

    const session = props.session;

    const username = useSelector(selectCurrentUser);
    const isOwner = session?.course?.owners?.map((o: any) => o.username).includes(username);

    const {
        data: exercises,
        isLoading: exercisesIsLoading,
        isSuccess: exercisesIsSuccess,
        isError: exercisesIsError,
    } = useGetExercisesOfSessionQuery({ session_id: session?.id });

    //Create exercise button (only for owners)
    const CreateExerciseButton = () => isOwner ? (
        <Link
            id="create-exercise-button"
            className="flex items-center justify-center m-2 md:m-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md shadow-lg transition duration-300 ease-in-out"
            to={"/exercise/create?session_id=" + session.id}
        >
            <PlusIcon className="w-5 h-5 mr-1" />
            Create Exercise
        </Link >
    ) : (<></>)

    //Create exercise button, on "no exercises" block (only for owners)
    const CreateExerciseButtonNoExercises = () => isOwner ? (
        <Link
            id="create-exercise-no-exercises"
            className="flex items-center justify-center m-2 md:m-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md shadow-lg transition duration-300 ease-in-out"
            to={"/exercise/create?session_id=" + session.id}
        >
            <PlusIcon className="w-6 h-6 mr-2" />
            Create Exercise
        </Link>
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
                    <CreateExerciseButtonNoExercises />
                </li>
            </ul>
        )
    }
    else if (exercisesIsSuccess) {
        return (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  mt-2 md:mt-6">
                    {exercises.map((exercise: any, i: number) => (
                        <Link
                            key={i}
                            className="border bg-gray-50 border-gray-300 rounded-md shadow p-4 flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                            to={"/exercise/" + exercise.id}
                        >
                            <span className="text-gray-700 text-xl font-medium">{exercise.title}</span>
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