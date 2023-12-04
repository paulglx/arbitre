import { Select, Tabs } from "../Common";
import { useDeleteCourseMutation, useGetCourseQuery, useUpdateCourseMutation, useUpdateLanguageMutation } from "../../features/courses/courseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumb from '../Common/Breadcrumb';
import CSELoading from '../Common/CSE/CSELoading';
import CSEOwnerActions from "../Common/CSE/CSEOwnerActions";
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
    const [edit, setEdit] = useState(false);
    const [language, setLanguage] = useState("");
    const [title, setTitle] = useState("");
    const [updateCourse] = useUpdateCourseMutation();
    const [updateLanguage] = useUpdateLanguageMutation();
    const [latePenalty, setLatePenalty] = useState(0);
    const { id }: any = useParams();
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const username = useSelector(selectCurrentUser);

    const languageChoices = [
        { code: "asm", name: "Assembly" },
        { code: "bash", name: "Bash" },
        { code: "basic", name: "Basic" },
        { code: "c", name: "C" },
        { code: "cpp", name: "C++" },
        { code: "csharp", name: "C#" },
        { code: "clojure", name: "Clojure" },
        { code: "cobol", name: "Cobol" },
        { code: "commonlisp", name: "Common Lisp" },
        { code: "d", name: "D" },
        { code: "elixir", name: "Elixir" },
        { code: "erlang", name: "Erlang" },
        { code: "executable", name: "Executable" },
        { code: "fortran", name: "Fortran" },
        { code: "fsharp", name: "F#" },
        { code: "go", name: "Go" },
        { code: "groovy", name: "Groovy" },
        { code: "haskell", name: "Haskell" },
        { code: "java", name: "Java" },
        { code: "javascript", name: "JavaScript" },
        { code: "kotlin", name: "Kotlin" },
        { code: "lua", name: "Lua" },
        { code: "objectivec", name: "Objective-C" },
        { code: "ocaml", name: "OCaml" },
        { code: "octave", name: "Octave" },
        { code: "pascal", name: "Pascal" },
        { code: "perl", name: "Perl" },
        { code: "php", name: "PHP" },
        { code: "prolog", name: "Prolog" },
        { code: "python", name: "Python" },
        { code: "r", name: "R" },
        { code: "ruby", name: "Ruby" },
        { code: "rust", name: "Rust" },
        { code: "scala", name: "Scala" },
        { code: "sql", name: "SQL" },
        { code: "swift", name: "Swift" },
        { code: "typescript", name: "TypeScript" },
        { code: "vbnet", name: "VB.NET" },
    ];

    const {
        data: courseData,
        isSuccess: courseIsSuccess,
        isLoading: courseIsLoading,
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
        if (courseIsSuccess) {
            setCourse(courseData);
            if (courseData.title === "" && courseData.description === "") {
                setEdit(true);
            }
        }
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
        setLatePenalty(course?.late_penalty);
    }, [course, courseIsSuccess]);

    const handleUpdate = async () => {
        await updateCourse({
            id: course?.id,
            title,
            description,
            late_penalty: latePenalty,
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

    const LanguageChoice = () => {
        return (<div className="relative inline-block text-left ml-2">
            <Select
                options={languageChoices}
                title={language}
                onChange={(e: any) => {
                    handleLanguageChange(e)
                }}
            />
        </div>)
    }

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
            content: <Grading course={course} latePenalty={latePenalty} setLatePenalty={setLatePenalty} edit={edit} />,
        },
    ];

    if (courseIsLoading) return (<CSELoading />);

    //Main content
    return courseIsSuccess ? (
        <>

            <div className="container mx-auto">

                <Breadcrumb items={[
                    { title: "Courses", link: "/course" },
                    { title: title, link: null }
                ]} />

                <br />

                <div className="flex items-center justify-between">
                    <EditableTitle
                        edit={edit}
                        isOwner={isOwner}
                        setTitle={setTitle}
                        title={title}
                    />
                    <div className="flex flex-row gap-1">
                        {isOwner || isTutor ? (<>
                            <LanguageChoice />
                            <CSEOwnerActions
                                edit={edit}
                                setEdit={setEdit}
                                isOwner={isOwner}
                                handleUpdate={handleUpdate}
                                handleDelete={handleDelete}
                            />
                        </>) : (<></>)}
                    </div>
                </div>
                <EditableDescription
                    edit={edit}
                    description={description}
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
            </div>
        </>
    ) : (
        <NotFound />
    )
}

export default Course