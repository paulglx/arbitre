import { ArrowRightIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import { selectCurrentUser, selectIsTeacher } from '../../features/auth/authSlice';

import Error from '../Util/Error';
import Header from '../Common/Header'
import { Link } from "react-router-dom";
import { useGetAllCoursesQuery } from '../../features/courses/courseApiSlice'
import { useSelector } from "react-redux";

const Courses = () => {

    const {
        data: courses,
        isSuccess: courseIsSuccess,
        isError: courseIsError,
        error: courseError
    } = useGetAllCoursesQuery({});

    const user = useSelector(selectCurrentUser)
    const isTeacher = useSelector(selectIsTeacher)

    const teacherContent = () => {
        return isTeacher ? (
            <ul className="rounded-4 mt-3 space-y-2 flex justify-center">
                <li>
                    <Link
                        to="/course/create"
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                        id="create-course"
                    >
                        <span className="inline-flex items-center">
                            <PlusCircleIcon className="mr-1 w-6 h-6" />
                            New course
                        </span>
                    </Link>
                </li>
            </ul>
        ) : null;
    };


    return courseIsSuccess ? (
        <>
            <Header />

            <br />
            <br />

            <div className="container mx-auto">
                <div className="mt-2 md:mt-8 flex justify-center h-screen md:h-auto">
                    <div className="bg-gray-200 rounded-3xl shadow-lg shadow-gray-400/50 p-4 md:p-6 md:h-auto h-5/6 w-full">
                        <h1 className="text-4xl font-bold mb-4 text-gray-700 hidden md:block">
                            Welcome back, {user}!
                        </h1>
                        <hr className="m-2 border-gray-600 hidden md:block" />
                        <div className="mt-8 md:h-auto h-4/5">
                            <div className="flex items-center md:justify-between justify-end">
                                <h2 className="text-3xl text-gray-700 hidden md:block">Your courses</h2>
                                <Link
                                    to="/course/join"
                                    className="inline-flex bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline items-center"
                                >
                                    <ArrowRightIcon className="mr-2 h-5 w-5" />
                                    Join a course
                                </Link>
                            </div>
                            <div className='h-5/6 md:h-auto overflow-y-auto '>
                                <ul className="md:overflow-x-auto flex md:flex-row flex-col ">
                                    {courses.map((course: any, i: number) => (
                                        <li key={i}>
                                            <Link
                                                to={`/course/${course.id}`}
                                                className="block bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-400/50 p-4 mr-2 md:mr-4 my-2 md:my-4 hover:bg-gray-100 transition duration-300 w-58 h-58 md:w-64 md:h-64 "
                                            >
                                                <div className="mb-4">
                                                    <img src="/resource/image_course.png" alt={course.title} className="w-full rounded-md" />
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                                                    <div className="bg-gray-600 h-2.5 rounded-full dark:bg-gray-300" style={{ width: '45%' }}></div>
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                                                {course.description.length > 20 ? (
                                                    <div>
                                                        <p className="text-gray-600 hidden md:block">{course.description.substring(0, 20)}...</p>
                                                        <Link to={`/course/${course.id}`} className="md:block text-gray-700 hover:text-gray-800 font-medium mt-2 justify-end">
                                                            Read more
                                                        </Link>
                                                    </div>) : (
                                                    <p className="text-gray-600">{course.description}</p>
                                                )}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {teacherContent()}
                    </div>
                </div>
            </div>
        </>
    ) : (
        <Error isError={courseIsError} error={JSON.stringify(courseError)} />);
}

export default Courses