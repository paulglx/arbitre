// import '../../join-code.css'

import { useEffect, useState } from "react";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { pushNotification } from "../../features/notification/notificationSlice";
import useDigitInput from "react-digit-input";
import { useDispatch } from "react-redux";
import { useJoinCourseWithCodeMutation } from "../../features/courses/courseApiSlice";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";

const JoinCourse = ({ embedded }: { embedded?: boolean }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { join_code: join_code_parameter } = useParams<{ join_code: string }>();
  const [joinCourseWithCode] = useJoinCourseWithCodeMutation();
  const [err, setErr] = useState<any>("");
  const [codeInput, setCodeInput] = useState<any>("");

  useTitle("Join a course");

  const handleCodeInput = (value: any) => {
    setErr("");
    setCodeInput(value.toUpperCase());
  };

  const digits = useDigitInput({
    acceptedCharacters: /^[a-zA-Z0-9]$/,
    length: 8,
    value: codeInput,
    onChange: handleCodeInput,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setCodeInput(codeInput.toUpperCase());
      const response = await joinCourseWithCode({
        join_code: codeInput,
      }).unwrap();
      dispatch(
        pushNotification({
          message: "You have successfully joined the course.",
          type: "success",
        }),
      );
      navigate(`/course/${response.course_id}`);
    } catch (err: any) {
      if (err.data.course_id) {
        dispatch(
          pushNotification({
            message: "You are already in this course.",
            type: "warning",
          }),
        );
        navigate(`/course/${err.data.course_id}`);
        return;
      }
      setErr(err.data.message);
    }
  };

  useEffect(() => {
    async function joinCourse(code: string) {
      setCodeInput(code.toUpperCase());
      await joinCourseWithCode({ join_code: code })
        .unwrap()
        .catch((err: any) => {
          if (err.data.course_id) {
            dispatch(
              pushNotification({
                message: "You are already in this course.",
                type: "warning",
              }),
            );
            navigate(`/course/${err.data.course_id}`);
            return;
          } else if (err.data.message) {
            setErr("Invalid join link.");
            navigate("/course/join");
            return;
          }
        })
        .then((response: any) => {
          if (!response || !("course_id" in response)) return;
          dispatch(
            pushNotification({
              message: "You have successfully joined the course.",
              type: "success",
            }),
          );
          navigate(`/course/${response.course_id}`);
        });
    }

    if (join_code_parameter) {
      if (join_code_parameter.length !== 8) {
        setErr("Invalid join link.");
        navigate("/course/join");
        return;
      } else {
        setCodeInput(join_code_parameter.toUpperCase());
      }

      joinCourse(join_code_parameter);
    }
  }, [join_code_parameter, joinCourseWithCode, navigate, dispatch]);

  return (
    <>
      <div className="mx-auto max-w-2xl">
        {!embedded && (
          <Link
            to="/course"
            className="inline-flex bg-gray-50 hover:bg-gray-100 border font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline items-center my-4 md:my-6"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to courses
          </Link>
        )}

        <div className="bg-gray-50 rounded-xl md:rounded-3xl border shadow-gray-400/50 p-4 md:p-6 flex flex-col items-center justify-center">
          <h1 className="text-xl font-bold mb-2 text-gray-700">
            Join a course
          </h1>
          <hr />
          {err === "" ? (
            <p className="text-gray-500 mt-2 text-xs">
              Enter the 8 character code provided by your teacher
            </p>
          ) : (
            <p className="text-red-500 m-2">{err}</p>
          )}

          <form className="m-2 md:n-4 bg-gray-100 border border-b-4 rounded-xl md:rounded-3xl p-4 md:p-6 overflow-x-auto flex justify-center">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <input
                  type="text"
                  placeholder="X"
                  key={i}
                  autoFocus={i === 0}
                  className="font-mono w-8 mx-1 text-gray-700 placeholder-gray-300 border border-gray-300 rounded-md text-4xl text-center focus:placeholder:opacity-0 caret-transparent"
                  {...digits[i]}
                  onChange={(e) => handleCodeInput(e.target.value)}
                />
              ))}
          </form>

          <br />

          <button
            className={`${codeInput.replace(" ", "").length === 8 ? " text-blue-50 bg-blue-600 hover:bg-gray-700" : "text-gray-100 bg-gray-300"} font-bold py-2 px-4 transition duration-300 rounded-lg justify-center flex items-center`}
            disabled={codeInput.replace(" ", "").length < 8}
            onClick={handleSubmit}
          >
            Join
          </button>
        </div>
      </div>
    </>
  );
};

export default JoinCourse;
