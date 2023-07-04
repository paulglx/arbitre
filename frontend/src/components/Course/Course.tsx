import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Header, Modal, Select, Tabs } from "../Common";
import { useDeleteCourseMutation, useGetCourseQuery, useUpdateCourseMutation, useUpdateLanguageMutation } from "../../features/courses/courseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EditableDescription from "../Common/EditableContent/EditableDescription";
import EditableTitle from '../Common/EditableContent/EditableTitle';
import { Link } from "react-router-dom";
import SessionContent from "./CourseComponents/SessionContent";
import Students from "./CourseComponents/Students/Students";
import TeacherList from "./CourseComponents/Teachers/TeacherList";
import { pushNotification } from "../../features/notification/notificationSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";

const Course = () => {

    const [deleteCourse] = useDeleteCourseMutation();
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [updateCourse] = useUpdateCourseMutation();
    const [updateLanguage] = useUpdateLanguageMutation();
    const { id }: any = useParams();
    const dispatch = useDispatch();

    const username = useSelector(selectCurrentUser);
    const navigate = useNavigate();

    const languageChoices = [
        { code: "ada", name: "Ada" },
        { code: "c", name: "C" },
        { code: "c#", name: "C#" },
        { code: "c++", name: "C++" },
        { code: "d", name: "D" },
        { code: "go", name: "Go" },
        { code: "haskell", name: "Haskell" },
        { code: "java", name: "Java" },
        { code: "javascript", name: "JavaScript" },
        { code: "lua", name: "Lua" },
        { code: "ocaml", name: "OCaml" },
        { code: "pascal", name: "Pascal" },
        { code: "perl", name: "Perl" },
        { code: "php", name: "PHP" },
        { code: "prolog", name: "Prolog" },
        { code: "python", name: "Python" },
        { code: "ruby", name: "Ruby" },
        { code: "rust", name: "Rust" },
        { code: "scheme", name: "Scheme" },
    ];

    const {
        data: course,
        isLoading: courseIsLoading,
        isSuccess: courseIsSuccess,
        //isError: courseIsError, TODO: handle error
    } = useGetCourseQuery({ id });

    const ownersUsernames = course?.owners.map((owner: any) => owner.username);
    const isOwner = ownersUsernames?.includes(username);

    const tutorsUsernames = course?.tutors.map((tutor: any) => tutor.username);
    const isTutor = tutorsUsernames?.includes(username);

    // Set title and description when course is loaded
    useEffect(() => {
        setTitle(course?.title);
        setDescription(course?.description);
        setLanguage(course?.language);
    }, [course, courseIsSuccess]);

    const handleUpdate = async () => {
        await updateCourse({
            id: course?.id,
            title,
            description
        })
            .unwrap()
            .then(() => {
                dispatch(pushNotification({
                    message: "The course has been updated",
                    type: "success"
                }));
            })
            .catch((e) => {
                dispatch(pushNotification({
                    message: "Something went wrong. The course has not been updated",
                    type: "error"
                }));
            })
    }

    const handleDelete = async (e: any) => {
        e.preventDefault();
        await deleteCourse(id)
            .unwrap()
            .then(() => {
                dispatch(pushNotification({
                    message: "The course has been deleted",
                    type: "success"
                }));
                navigate("/course");
            })
            .catch((e) => {
                dispatch(pushNotification({
                    message: "Something went wrong. The course has not been deleted",
                    type: "error"
                }));
            })
    }

    const handleLanguageChange = async (e: any) => {
        const lang = e.code;
        const langName = e.name;

        await updateLanguage({
            course_id: course?.id,
            language: lang
        })
            .unwrap()
            .then(() => {
                setLanguage(lang);
                dispatch(pushNotification({
                    message: `The course language has been updated to ${langName}`,
                    type: "success"
                }));
            })
            .catch((e) => {
                dispatch(pushNotification({
                    message: "Something went wrong. The course language has not been updated",
                    type: "error"
                }));
            })
    }

    const OwnerButtons = () => {
        return isOwner ? (
            <div className="flex justify-end items-center space-x-2">
                <div className="relative inline-block text-left">
                    <Select
                        options={languageChoices}
                        title={language}
                        onChange={(e: any) => {
                            console.log(e)
                            handleLanguageChange(e)
                        }}
                    />

                </div>
                <div className="ml-2">
                    <button
                        onClick={() => setModalIsOpen(true)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        <TrashIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        ) : null;
    };

    const tabs = [
        {
            eventKey: 'sessions',
            title: 'Sessions',
            component: <SessionContent
                course={course}
                id={id}
            />,
            buttonClassName: "rounded-l-md"
        },
        {
            eventKey: 'students',
            title: 'Students',
            component: <Students course={course} />,
            buttonClassName: ""
        },
        {
            eventKey: 'teachers',
            title: 'Teachers',
            component: <TeacherList courseId={id} isOwner={isOwner} />,
            buttonClassName: "rounded-r-md"
        },

    ];

    //Main content
    return courseIsLoading ? (
        <></>
    ) : (
        <>
            <Header />

            <br />
            <br />

            <div className="container mx-auto">
                <nav className="flex px-5 py-3 mt-2 md:mt-6 w-full text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-1">
                        <li className="flex items-center">
                            <Link to="/course" className="flex items-center text-gray-700 hover:text-blue-600">
                                Courses
                            </Link>
                        </li>
                        <li className="flex items-center text-gray-500" aria-current="page">
                            <svg aria-hidden="true" className="w-6 h-6 text-gray-400 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            {title ? title : "Untitled course"}
                        </li>
                    </ol>
                </nav>

                <br />
                <br />

                <div className="flex items-center justify-between">
                    <EditableTitle
                        course={course}
                        title={title}
                        setTitle={setTitle}
                        handleUpdate={handleUpdate}
                    />
                    <div className="flex gap-2">
                        <OwnerButtons />
                    </div>
                </div>
                <EditableDescription
                    course={course}
                    description={description}
                    setDescription={setDescription}
                    handleUpdate={handleUpdate}
                />
                {isOwner || isTutor ? (<>
                    <Tabs
                        tabs={tabs}
                    />
                </>) : (<>
                    <h2>Sessions</h2>
                    <SessionContent
                        course={course}
                        id={id}
                    />
                </>)}

                {modalIsOpen &&
                    <Modal
                        title={<h2 className="text-xl font-semibold">Are you sure?</h2>}
                        icon={<ExclamationTriangleIcon className="text-yellow-500 w-12 h-12 mb-2" />}
                        decription={<p className="mb-4">This will remove permanently this course, all its sessions and all the session's exercises.</p>}
                        handleCloseModal={() => setModalIsOpen(false)}
                        delete={handleDelete}
                    />}
            </div>
        </>
    )
}

export default Course