import { ArrowRightIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import { selectCurrentUser, selectIsTeacher } from '../../features/auth/authSlice';

import Error from '../Util/Error';
import Header from '../Common/Header'
import { Link } from "react-router-dom";
import { useCreateCourseMutation } from '../../features/courses/courseApiSlice'
import { useGetAllCoursesQuery } from '../../features/courses/courseApiSlice'
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const Courses = () => {

    const {
        data: courses,
        isSuccess: coursesIsSuccess,
        isError: coursesIsError,
        error: coursesError
    } = useGetAllCoursesQuery({});

    const [createCourse] = useCreateCourseMutation()
    const isTeacher = useSelector(selectIsTeacher)
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser)

    const handleCreateCourse = async (e: any) => {
        e.preventDefault();

        try {
            const newCourse: any = await createCourse({
                title: "",
                description: ""
            });
            navigate(`/course/${newCourse.data.id}`);
        } catch (err) {
            console.log(err);
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
                <div className="mt-2 md:mt-8 flex justify-center">
                    <div className="bg-gray-100 rounded-xl shadow-lg shadow-gray-400/50 p-6 md:p-6 md:pb-3 md:h-auto w-full">
                        <h1 className="text-3xl font-bold mb-4 text-gray-700 hidden md:block">
                            Welcome back, {user}!
                        </h1>
                        <hr className="border-gray-400 hidden md:block" />
                        <div className="mt-4 h-auto">
                            <div className="flex items-center md:justify-between justify-end">
                                <h2 className="text-2xl font-medium text-gray-700 hidden md:block">
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
                                    {courses.map((course: any, i: number) => (
                                        <li key={i}>
                                            <Link
                                                to={`/course/${course.id}`}
                                                className="block bg-gray-50 border border-gray-300 rounded-2xl shadow-md shadow-gray-400/50 p-4 first:ml-0 md:mr-4 my-2 md:my-4 hover:bg-gray-100 transition duration-300 ease-in-out md:w-80 h-5/6"
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
        <Error isError={coursesIsError} error={JSON.stringify(coursesError)} />);
}

export default Courses