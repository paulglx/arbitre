import {
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";
import { Select, Tabs } from "../Common";
import {
  useCloneCourseMutation,
  useDeleteCourseMutation,
  useGetCourseQuery,
  useUpdateCourseMutation,
  useUpdateLanguageMutation,
} from "../../features/courses/courseApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumb from "../Common/Breadcrumb";
import CSELoading from "../Common/CSE/CSELoading";
import CSEOwnerActions from "../Common/CSE/CSEOwnerActions";
import EditableDescription from "../Common/EditableContent/EditableDescription";
import EditableTitle from "../Common/EditableContent/EditableTitle";
import Grading from "./Grading/Grading";
import NotFound from "../Util/NotFound";
import SessionContent from "./CourseComponents/SessionContent";
import Students from "./CourseComponents/Students/Students";
import TeacherList from "./CourseComponents/Teachers/TeacherList";
import { pushNotification } from "../../features/notification/notificationSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useGetCourseStudentGroupsQuery } from "../../features/courses/studentGroupApiSlice";
import { useTitle } from "../../hooks/useTitle";

const Course = () => {
  const [actionsDropdown, setActionsDropdown] = useState(false);
  const [deleteCourse] = useDeleteCourseMutation();
  const [description, setDescription] = useState("");
  const [edit, setEdit] = useState(false);
  const [language, setLanguage] = useState("");
  const [title, setTitle] = useState("");
  const [updateCourse] = useUpdateCourseMutation();
  const [cloneCourse] = useCloneCourseMutation();
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
    data: course,
    isSuccess: courseIsSuccess,
    isLoading: courseIsLoading,
    isError: courseIsError,
    refetch: refetchCourse,
  } = useGetCourseQuery({ id });

  useTitle(course?.title);

  useEffect(() => {
    if (courseIsError) {
      dispatch(
        pushNotification({
          message: "The course does not exist",
          type: "error",
        })
      );
      navigate("/course");
    }
  }, [course, courseIsError, courseIsSuccess, dispatch, navigate]);

  useEffect(() => {
    console.log(course);
    if (course?.title === "" && course?.description === "") {
      setEdit(true);
    }
  }, [course]);

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
        dispatch(
          pushNotification({
            message: "The course has been updated",
            type: "success",
          })
        );
      })
      .catch((e) => {
        dispatch(
          pushNotification({
            message: "Something went wrong. The course has not been updated",
            type: "error",
          })
        );
      });
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    await deleteCourse(id)
      .unwrap()
      .then(() => {
        dispatch(
          pushNotification({
            message: "The course has been deleted",
            type: "success",
          })
        );
        navigate("/course");
      })
      .catch((e) => {
        dispatch(
          pushNotification({
            message: "Something went wrong. The course has not been deleted",
            type: "error",
          })
        );
      });
  };

  const handleLanguageChange = async (e: any) => {
    const lang = e.code;
    const langName = e.name;

    await updateLanguage({
      course_id: course?.id,
      language: lang,
    })
      .unwrap()
      .then(() => {
        setLanguage(lang);
        dispatch(
          pushNotification({
            message: `The course language has been updated to ${langName}`,
            type: "success",
          })
        );
      })
      .catch((e) => {
        dispatch(
          pushNotification({
            message:
              "Something went wrong. The course language has not been updated",
            type: "error",
          })
        );
      });
  };

  const handleClone = async (e: any) => {
    if (edit) {
      dispatch(
        pushNotification({
          message: `Please save your changes before leaving the page`,
          type: "warning",
        })
      );
      return;
    }

    await cloneCourse({
      course_id: course?.id,
    })
      .unwrap()
      .then((response: any) => {
        const newCourseId = response.new_course_id;
        dispatch(
          pushNotification({
            message: `The course has been cloned`,
            type: "success",
          })
        );
        navigate(`/course/${newCourseId}`);
      })
      .catch((e) => {
        dispatch(
          pushNotification({
            message: "Something went wrong. The course wasn't cloned.",
            type: "error",
          })
        );
      });
  };

  const ActionsDropdown = () => {
    return isOwner || isTutor ? (
      <>
        <button
          id="dropdownDefaultButton"
          className="rounded-lg border shadow-sm text-semibold px-5 py-2.5 text-center inline-flex items-center"
          type="button"
          aria-haspopup="true"
          aria-expanded={actionsDropdown}
          onClick={() => setActionsDropdown(!actionsDropdown)}
        >
          Actions&nbsp;
          {actionsDropdown ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
          {actionsDropdown && (
            <div
              id="dropdown"
              className="absolute mt-32 border z-10 bg-white divide-y divide-gray-100 rounded-lg shadow"
            >
              <ul
                className="py-2 text-gray-700"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <a
                    className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                    onClick={handleClone}
                  >
                    <DocumentDuplicateIcon className="h-4 w-4 inline-block mr-2" />
                    Clone
                  </a>
                </li>
              </ul>
            </div>
          )}
        </button>
      </>
    ) : null;
  };

  const LanguageChoice = () => {
    return (
      <div className="relative inline-block text-left ml-2">
        <Select
          options={languageChoices}
          title={language}
          onChange={(e: any) => {
            handleLanguageChange(e);
          }}
        />
      </div>
    );
  };

  const tabs = [
    {
      key: "sessions",
      title: "Sessions",
      content: <SessionContent course={course} id={id} />,
    },
    {
      key: "students",
      title: "Students",
      content: (
        <Students
          course={course}
          refetch={refetchCourse}
        />
      ),
    },
    {
      key: "teachers",
      title: "Teachers",
      content: <TeacherList courseId={id} isOwner={isOwner} />,
    },
    {
      key: "grading",
      title: "Grading",
      content: (
        <Grading
          course={course}
          latePenalty={latePenalty}
          setLatePenalty={setLatePenalty}
          edit={edit}
        />
      ),
    },
  ];

  if (courseIsLoading) return <CSELoading />;

  //Main content
  return courseIsSuccess ? (
    <>
      <div className="container mx-auto">
        <Breadcrumb
          items={[
            { title: "Courses", link: "/course" },
            { title: title, link: null },
          ]}
        />

        <br />

        <div className="flex items-center justify-between">
          <EditableTitle
            edit={edit}
            isOwner={isOwner}
            setTitle={setTitle}
            title={title}
          />
          <div className="flex flex-row gap-2">
            {isOwner || isTutor ? (
              <>
                <LanguageChoice />
                <CSEOwnerActions
                  edit={edit}
                  setEdit={setEdit}
                  isOwner={isOwner}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                />
                <ActionsDropdown />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <EditableDescription
          edit={edit}
          description={description}
          isOwner={isOwner}
          setDescription={setDescription}
        />
        {isOwner || isTutor ? (
          <>
            <Tabs tabs={tabs} />
          </>
        ) : (
          <>
            <div className="text-xl font-semibold mt-2 md:mt-6">Sessions</div>
            <SessionContent course={course} id={id} />
          </>
        )}
      </div>
    </>
  ) : (
    <NotFound />
  );
};

export default Course;
