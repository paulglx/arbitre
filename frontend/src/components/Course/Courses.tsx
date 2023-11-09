import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Link, useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectIsTeacher } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from "react-redux";

import Error from '../Util/Error';
import Markdown from '../Util/Markdown';
import { pushNotification } from '../../features/notification/notificationSlice';
import { useCreateCourseMutation } from '../../features/courses/courseApiSlice'
import { useGetAllCoursesQuery } from '../../features/courses/courseApiSlice'
import { useMemo } from 'react';
import { useTitle } from '../../hooks/useTitle';

const Courses = () => {

    useTitle("Courses")

    const {
        data: courses,
        isSuccess: coursesIsSuccess,
        isLoading: coursesIsLoading,
        isError: coursesIsError,
        error: coursesError
    } = useGetAllCoursesQuery({});

    const [createCourse] = useCreateCourseMutation()
    const dispatch = useDispatch();
    const isTeacher = useSelector(selectIsTeacher)
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser)

    const sortedCourses = useMemo(() => {
        if (coursesIsSuccess) {
            const coursesToSort = structuredClone(courses);
            return coursesToSort?.sort((a: any, b: any) => {
                return a.title?.localeCompare(b.title);
            });
        }
    }, [coursesIsSuccess, courses]);

    const stripCourseDescription = (description: string) => {
        return <Markdown strip={true}>{description.replace("\n", "")}</Markdown>
    }

    const handleCreateCourse = async (e: any) => {
        e.preventDefault();

        try {
            const newCourse: any = await createCourse({
                title: "",
                description: ""
            });
            navigate(`/course/${newCourse.data.id}`);
        } catch (e) {
            dispatch(pushNotification({
                message: "Something went wrong. The course has not been created.",
                type: "error"
            }));
        }
    }

    const teacherContent = () => {
        return isTeacher ? (
            <button
                onClick={handleCreateCourse}
                className="inline-flex bg-blue-600 text-blue-50 hover:bg-blue-700 font-bold py-2 px-4 rounded-md items-center transition"
                id="create-course"
            >
                <PlusIcon className="md:mr-2 w-6 h-6" />
                <span className="hidden md:block">New course</span>
            </button>
        ) : null;
    };

    if (coursesIsLoading) {
        return (<></>)
    }

    return coursesIsSuccess ? (
        <>
            <br />

            <div className="container mx-auto h-screen">
                <div className="mt-2 flex justify-center h-full">
                    <div className="md:pb-3 h-2/3 w-full">
                        <h1 className="text-3xl font-bold mb-4 text-gray-950 hidden md:block">
                            Welcome{sortedCourses.length > 0 ? " back" : ""}, {user}!
                        </h1>
                        <hr className="border-gray-400 hidden md:block" />
                        {sortedCourses.length > 0 ? (
                            <div className="mt-0 md:mt-4 h-full">
                                <div className="flex items-center justify-between">
                                    <h2 className="block text-2xl font-medium text-gray-800">
                                        Your courses
                                    </h2>
                                    <div className='inline-flex'>
                                        {teacherContent()}
                                        &nbsp;
                                        <Link
                                            to="/course/join"
                                            className="inline-flex bg-blue-600 text-blue-50 hover:bg-blue-700 font-bold py-2 px-4 rounded-md items-center transition"
                                        >
                                            <ArrowRightIcon className="md:mr-2 h-5 w-5" />
                                            <span>Join a course</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className='overflow-y-auto mt-2'>
                                    <ul className="overflow-y-auto justify-between h-5/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-1">
                                        {sortedCourses.map((course: any, i: number) => (
                                            <li key={i}>
                                                <Link
                                                    to={`/course/${course.id}`}
                                                    className="flex md:block items-center bg-blue-50 border border-blue-100 rounded-2xl shadow shadow-blue-50 p-4 first:ml-0 hover:bg-blue-100 transition duration-300 ease-in-out w-full md:h-44"
                                                >
                                                    <h3 className={`text-lg font-bold leading-tight line-clamp-2 md:mb-1 ${course.title ? "text-blue-600" : " text-blue-400"}`}>
                                                        {course.title ? course.title : "Untitled Course"}
                                                    </h3>
                                                    <div className='hidden md:block'>
                                                        <span className="text-gray-600 line-clamp-4">{stripCourseDescription(course.description)}</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-0 md:mt-4 flex flex-col items-center justify-center">
                                <div className='w-fit border rounded-xl bg-gray-50 px-4 py-2'>
                                    <div className='m-4 text-xl'>
                                        {isTeacher ? "You have not created any courses yet." : "You have not joined any courses yet."}
                                    </div>
                                    <div className='w-full flex justify-center mb-4'>
                                        {teacherContent()}
                                        &nbsp;
                                        <Link
                                            to="/course/join"
                                            className="inline-flex bg-blue-600 text-blue-50 hover:bg-blue-700 font-bold py-2 px-4 rounded-md items-center transition"
                                        >
                                            <ArrowRightIcon className="mr-2 h-5 w-5" />
                                            <span>Join a course</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    ) : (
        <Error isError={coursesIsError} error={JSON.stringify(coursesError)} />
    );
}

export default Courses