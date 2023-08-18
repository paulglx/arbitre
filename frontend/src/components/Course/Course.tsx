import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Header, Modal, Select, Tabs } from "../Common";
import { useDeleteCourseMutation, useGetCourseQuery, useUpdateCourseMutation, useUpdateLanguageMutation } from "../../features/courses/courseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumb from '../Common/Breadcrumb';
import EditableDescription from "../Common/EditableContent/EditableDescription";
import EditableTitle from '../Common/EditableContent/EditableTitle';
import Grading from './Grading/Grading';
import NotFound from '../Util/NotFound';
import SessionContent from "./CourseComponents/SessionContent";
import Students from "./CourseComponents/Students/Students";
import TeacherList from "./CourseComponents/Teachers/TeacherList";
import { pushNotification } from "../../features/notification/notificationSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useGetCourseStudentGroupsQuery } from '../../features/courses/studentGroupApiSlice';
import { useTitle } from '../../hooks/useTitle';

const Course = () => {

    const [course, setCourse] = useState<any>({})
    const [deleteCourse] = useDeleteCourseMutation();
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [updateCourse] = useUpdateCourseMutation();
    const [updateLanguage] = useUpdateLanguageMutation();
    const { id }: any = useParams();
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const username = useSelector(selectCurrentUser);

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
        data: courseData,
        isSuccess: courseIsSuccess,
        isError: courseIsError,
    } = useGetCourseQuery({ id });

    const {
        data: groups,
        refetch: refetchGroups,
    } = useGetCourseStudentGroupsQuery({ course_id: course?.id }, {
        skip: !course?.id
    })

    useTitle(course?.title);

    useEffect(() => {
        if (courseIsSuccess) setCourse(courseData);
        if (courseIsError) {
            setCourse(null);
            dispatch(pushNotification({
                message: "The course does not exist",
                type: "error"
            }));
            navigate("/course");
        }
    }, [courseData, courseIsError, courseIsSuccess, dispatch, navigate]);

    const ownersUsernames = course?.owners?.map((owner: any) => owner.username);
    const isOwner = ownersUsernames?.includes(username);

    const tutorsUsernames = course?.tutors?.map((tutor: any) => tutor.username);
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
                            handleLanguageChange(e)
                        }}
                    />

                </div>
                <div className="ml-2">
                    <button
                        onClick={() => setModalIsOpen(true)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                        aria-label='Delete course'
                    >
                        <TrashIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        ) : null;
    };

    const tabs = [
        {
            key: 'sessions',
            title: 'Sessions',
            content: <SessionContent course={course} id={id} />,
        },
        {
            key: 'students',
            title: 'Students',
            content: <Students course={course} setCourse={setCourse} groups={groups} refetchGroups={refetchGroups} />,
        },
        {
            key: 'teachers',
            title: 'Teachers',
            content: <TeacherList courseId={id} isOwner={isOwner} />,
        },
        {
            key: 'grading',
            title: 'Grading',
            content: <Grading course={course} />,
        },
    ];

    //Main content
    return courseIsSuccess ? (
        <>
            <Header />

            <br />

            <div className="container mx-auto">

                <Breadcrumb items={[
                    { title: "Courses", link: "/course" },
                    { title: title, link: null }
                ]} />

                <br />

                <div className="flex items-center justify-between">
                    <EditableTitle
                        handleUpdate={handleUpdate}
                        isOwner={isOwner}
                        setTitle={setTitle}
                        title={title}
                    />
                    <div className="flex gap-2">
                        <OwnerButtons />
                    </div>
                </div>
                <EditableDescription
                    description={description}
                    handleUpdate={handleUpdate}
                    isOwner={isOwner}
                    setDescription={setDescription}
                />
                {isOwner || isTutor ? (<>
                    <Tabs tabs={tabs} />
                </>) : (<>
                    <div className='text-xl font-semibold mt-2 md:mt-6'>Sessions</div>
                    <SessionContent
                        course={course}
                        id={id}
                    />
                </>)}

                {modalIsOpen &&
                    <Modal
                        title={<h2 className="text-xl font-semibold">Are you sure?</h2>}
                        icon={<ExclamationTriangleIcon className="text-yellow-500 w-12 h-12 mb-2" />}
                        decription={<p className="mb-4">This will permanently remove this course, all of its sessions and all of the session's exercises.</p>}
                        handleCloseModal={() => setModalIsOpen(false)}
                        delete={handleDelete}
                    />
                }
            </div>
        </>
    ) : (
        <NotFound />
    )
}

export default Course