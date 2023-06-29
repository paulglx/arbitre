import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Header, Modal, Select, Tabs } from "../Common";
import { selectCurrentUser, selectIsTeacher } from "../../features/auth/authSlice";
import { useDeleteCourseMutation, useGetCourseQuery, useUpdateCourseMutation, useUpdateLanguageMutation } from "../../features/courses/courseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DescriptionContent from "./CourseComponents/DescriptionContent";
import { Link } from "react-router-dom";
import SessionContent from "./CourseComponents/SessionContent";
import Students from "./Students/Students";
import TeacherList from "./Teachers/TeacherList";
import autosize from "autosize";
import { pushNotification } from "../../features/notification/notificationSlice";

const Course = () => {

    const dispatch = useDispatch();
    const { id }: any = useParams();
    const [updateLanguage] = useUpdateLanguageMutation();
    const [updateCourse] = useUpdateCourseMutation();
    const [title, setTitle] = useState("");
    const [language, setLanguage] = useState("");
    const [editTitle, setEditTitle] = useState(false);
    const [description, setDescription] = useState("");
    const [deleteCourse] = useDeleteCourseMutation();

    const username = useSelector(selectCurrentUser);
    const navigate = useNavigate();
    const isTeacher = useSelector(selectIsTeacher);
    const [modalIsOpen, setModalIsOpen] = useState(false);

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
        isError: courseIsError,
    } = useGetCourseQuery({ id });

    const ownersUsernames = course?.owners.map((owner: any) => owner.username);
    const isOwner = ownersUsernames?.includes(username);

    const tutorsUsernames = course?.tutors.map((tutor: any) => tutor.username);
    const isTutor = tutorsUsernames?.includes(username);

    // Autosize textareas and add event listeners for enter and escape
    useEffect(() => {
        const textareas = document.getElementsByTagName("textarea");
        autosize(textareas);

        window.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                if (editTitle) {
                    (event.target as HTMLElement).blur();
                }
            }
            if (event.key === 'Escape') {
                //TODO revert to previous state
                (event.target as HTMLElement).blur();
            }
        });
    });

    // Set title and description when course is loaded
    useEffect(() => {
        setTitle(course?.title);
        setDescription(course?.description);
        setLanguage(course?.language);
    }, [course, courseIsSuccess]);

    const handleUpdate = async () => {
        try {
            updateCourse({
                id: course?.id,
                title,
                description
            });
            dispatch(pushNotification({
                message: "The course has been updated",
                type: "light"
            }));

        } catch (e) {
            dispatch(pushNotification({
                message: "Something went wrong. The course could not be updated",
                type: "danger"
            }));
        }
    }

    const handleDelete = (e: any) => {
        e.preventDefault();
        try {
            deleteCourse(id);
            navigate("/course")
        } catch (e) {
            console.log(e);
        }
    }

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang);
        updateLanguage({
            course_id: course?.id,
            language: lang
        });
        dispatch(pushNotification({
            message: `The course language has been updated to ${lang}`,
            type: "light"
        }));
    }

    // Show title or edit title
    const titleContent = () => {
        if (!isOwner || !editTitle) {
            return (
                <h1
                    className={"fw-bold hover:bg-blue-600 " + (isOwner ? " teacher editable-title" : "")}
                    id="title-editable"
                    onFocus={() => isOwner ? setEditTitle(true) : null}
                    tabIndex={0} //allows focus
                >
                    {title}
                </h1>
            );
        } else if (isOwner && editTitle) {
            return (
                <input
                    autoComplete="false"
                    autoFocus
                    className="teacher title-input h2 fw-bold p-2"
                    id="title-input"
                    onBlur={() => {
                        if (title === "") {
                            setTitle("Untitled course");
                        }
                        setEditTitle(false)
                        handleUpdate();
                    }}
                    onChange={(e: any) => setTitle(e.target.value)}
                    placeholder="Enter course title"
                    type="text"
                    value={title}
                />
            )
        }
    }

    // Delete button (teacher only)
    const ownerActionsContent = () => {
        return isOwner ? (
            <div className="flex justify-end items-center space-x-2">
                <div className="relative inline-block text-left">
                    <Select
                        options={languageChoices}
                        title="Langages"
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
            eventKey: 'session',
            title: 'Session',
            component: <SessionContent
                course={course}
                id={id}
            />,
            buttonClassName: "rounded-l-md"
        },
        {
            eventKey: 'student',
            title: 'Student',
            component: <Students course={course} />,
            buttonClassName: ""
        },
        {
            eventKey: 'teacher',
            title: 'Teacher',
            component: <TeacherList courseId={id} isOwner={isOwner} />,
            buttonClassName: "rounded-r-md"
        },

    ]
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
                    <ol className="flex items-center space-x-1 md:space-x-3">
                        <li className="flex items-center">
                            <Link to="/course" className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                Courses
                            </Link>
                        </li>
                        <li className="flex items-center text-gray-500" aria-current="page">
                            <svg aria-hidden="true" className="w-6 h-6 text-gray-400 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            {title}
                        </li>
                    </ol>
                </nav>

                <br />
                <br />

                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-center hover:bg-gray-200">
                        {titleContent()}
                    </h1>
                    <div className="flex gap-2">
                        {ownerActionsContent()}
                    </div>
                </div>
                <DescriptionContent
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
                    <DescriptionContent
                        course={course}
                        description={description}
                        setDescription={setDescription}
                        handleUpdate={handleUpdate}
                    />

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