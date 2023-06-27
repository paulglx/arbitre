import { selectCurrentUser, selectIsTeacher } from '../../features/auth/authSlice';
import Error from '../Util/Error';
import Header from '../Common/Header'
import { useGetAllCoursesQuery } from '../../features/courses/courseApiSlice'
import { useSelector } from "react-redux";
import { PlusCircleIcon , ArrowRightIcon } from '@heroicons/react/24/solid'


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
          <ul className="rounded-4 mt-3 space-y-2">
            <li>
              <a
                href="/course/create"
                className="block bg-white border border-gray-200 rounded-full p-2 hover:bg-gray-100 transition duration-300 rounded-full flex items-center"
                id="create-course"
              >
                <span className="inline-flex items-center">
                <PlusCircleIcon className="mr-1 w-6 h-6" />
                  New course
                </span>
              </a>
            </li>
          </ul>
        ) : null;
      };
      
    

     return courseIsSuccess ? (
        <>
        <Header />
        <div className="mt-2 md:mt-8 flex justify-center h-screen md:h-auto">
            <div className="bg-gray-200 rounded-3xl shadow-lg shadow-gray-400/50 p-4 md:p-6 md:h-auto h-5/6 w-full">
                <h1 className="text-4xl font-bold mb-4 text-gray-700 hidden md:block">
                    Welcome back, {user}!
                </h1>
                <hr className="m-2 border-gray-600"/>
                <div className="mt-8 md:h-auto h-4/5">
                    <div className="flex items-center md:justify-between m-2 justify-end">
                        <h2 className="text-3xl text-gray-700 hidden md:block">Your courses</h2>
                        <a
                        href="/course/join"
                        className="inline-flex bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline items-center"
                        >
                            <ArrowRightIcon className="mr-2 h-5 w-5"/>
                            Join a course
                        </a>
                    </div>
                    <div className='h-5/6 md:h-auto overflow-y-auto '>
                        <ul className="md:overflow-x-auto flex md:flex-row flex-col gap-4 ">
                            {courses.map((course: any, i: number) => (
                            <li key={i}>
                                <a
                                    href={`/course/${course.id}`}
                                    className="block bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-400/50 p-4 m-2 md:m-6 hover:bg-gray-100 transition duration-300 w-58 h-58 md:w-64 md:h-64 "
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
                                        <a href={`/course/${course.id}`} className="hidden md:block text-gray-700 hover:text-gray-800 font-medium mt-2 inline-block flex justify-end">
                                            Read more
                                        </a>
                                    </div> ) : (
                                    <p className="text-gray-600">{course.description}</p>
                                )}</a>
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            {teacherContent()}
            </div>
        </div>
        </>
        ) : (
        <Error isError={courseIsError} error={JSON.stringify(courseError)} />);
}

export default Courses