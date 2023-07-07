import { ArrowRightIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import { Link, useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectIsTeacher } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from "react-redux";

import Error from '../Util/Error';
import Header from '../Common/Header'
import { pushNotification } from '../../features/notification/notificationSlice';
import { useCreateCourseMutation } from '../../features/courses/courseApiSlice'
import { useGetAllCoursesQuery } from '../../features/courses/courseApiSlice'
import { useMemo } from 'react';

const Courses = () => {

    const {
        data: courses,
        isSuccess: coursesIsSuccess,
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
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center"
                id="create-course"
            >
                <PlusCircleIcon className="mr-2 w-6 h-6" />
                New course
            </button>
        ) : null;
    };


    return coursesIsSuccess ? (
        <>
            <Header />

            <br />
            <br />

            <div className="container mx-auto">
                <div className="mt-2 flex justify-center">
                    <div className="bg-gray-50 rounded-lg shadow border p-6 md:p-6 md:pb-3 md:h-auto w-full">
                        <h1 className="text-3xl font-bold mb-4 text-gray-700 hidden md:block">
                            Welcome back, {user}!
                        </h1>
                        <hr className="border-gray-300 hidden md:block" />
                        <div className="mt-0 md:mt-4 h-auto">
                            <div className="flex items-center justify-between">
                                <h2 className="block text-2xl font-medium text-gray-700">
                                    Your courses
                                </h2>
                                <div className='inline-flex'>
                                    {teacherContent()}
                                    &nbsp;
                                    <Link
                                        to="/course/join"
                                        className="inline-flex bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md items-center"
                                    >
                                        <ArrowRightIcon className="mr-2 h-5 w-5" />
                                        Join a course
                                    </Link>
                                </div>
                            </div>
                            <div className='h-auto overflow-y-auto'>
                                <ul className="md:overflow-x-auto flex md:flex-row flex-col ">
                                    {sortedCourses.map((course: any, i: number) => (
                                        <li key={i}>
                                            <Link
                                                to={`/course/${course.id}`}
                                                className="block bg-gray-100 border border-gray-300 rounded-2xl shadow-md shadow-gray-400/50 p-4 first:ml-0 md:mr-4 my-2 md:my-4 hover:bg-gray-200 transition duration-300 ease-in-out md:w-80 h-5/6"
                                            >

                                                {/*
                                                 <div className="mb-4">
                                                    <img src="/resource/image_course.png" alt={course.title} className="w-full rounded-md" />
                                                </div>
                                                */}
                                                {/* Progress bar
                                                 <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                                                    <div className="bg-gray-600 h-2.5 rounded-full dark:bg-gray-300" style={{ width: '45%' }}></div>
                                                </div>
                                                */}
                                                <h3 className={`text-lg font-bold leading-tight mb-1 ${course.title ? "" : " text-gray-500"}`}>
                                                    {course.title ? course.title : "Untitled Course"}
                                                </h3>
                                                {course.description.length > 100 ? (
                                                    <div>
                                                        <p className="text-gray-600 hidden md:block">{course.description.substring(0, 100)}...</p>
                                                    </div>) : (
                                                    <p className="text-gray-600 hidden md:block">{course.description}</p>
                                                )}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    ) : (
        <Error isError={coursesIsError} error={JSON.stringify(coursesError)} />
    );
}

export default Courses