// import "../../../join-code.css"

import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRefreshJoinCodeMutation, useSetJoinCodeEnabledMutation } from "../../../features/courses/courseApiSlice"

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IoToggleOutline } from 'react-icons/io5';
import { selectCurrentUser } from "../../../features/auth/authSlice"
import { useSelector } from 'react-redux'
import { useState } from 'react'

const StudentsInvite = (props: any) => {

  const username = useSelector(selectCurrentUser)
  const course = props.course
  const [copied, setCopied] = useState(false)
  const [refreshJoinCode] = useRefreshJoinCodeMutation()
  const [joinCodeEnabled, setJoinCodeEnabled] = useState(props.course.join_code_enabled)
  const [joinCode, setJoinCode] = useState(props.course.join_code)
  const [enableJoinCode] = useSetJoinCodeEnabledMutation()

  const ownersUsernames = course?.owners.map((owner: any) => owner.username);
  const isOwner = ownersUsernames?.includes(username);

  const tutorUsernames = course?.tutors.map((tutor: any) => tutor.username);
  const isTutor = tutorUsernames?.includes(username);

  const handleRefreshJoinCode = () => {
    refreshJoinCode({ course_id: course.id }).unwrap()
      .then((response) => {
        setJoinCode(response.join_code)
      })
  }

  const handleToggleJoinCodeEnabled = () => {
    const newEnabled = !joinCodeEnabled;
    enableJoinCode({ course_id: course.id, enabled: newEnabled })
      .unwrap()
      .then((response) => {
        setJoinCodeEnabled(response.join_code_enabled);
      })
  }

  const handleCopyJoinCode = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return isOwner || isTutor ? (
    <div className="bg-gray-200 border rounded-3xl flex flex-col gap-4 p-5 md:p-10">
      <h2 className="h3 font-bold">Invite students</h2>
      <p className="mb-2 text-center">Course code</p>

      <div className="flex justify-center">
        <div className="flex items-center mr-2 justify-center bg-gray-400 px-2 rounded-xl">
          {joinCodeEnabled ? (
            <CopyToClipboard text={joinCode} onCopy={handleCopyJoinCode}>
              <button
                id="join-code"
                className="user-select-none text-center px-2 py-1 rounded-3xl text-4xl"
              >
                {joinCode}
              </button>
            </CopyToClipboard>
          ) : (
            <span
              id="join-code"
              className="user-select-none text-center px-2 py-0 rounded-4 h-1"
            >
              &nbsp;
            </span>
          )}
        </div>
        {isOwner && (
          <>
            <div className="flex items-center justify-center">
              <button
                className="text-blue-500 mr-2 bg-gray-800 rounded-full p-2"
                onClick={handleRefreshJoinCode}
                aria-label="Refresh join code"
              >
                <ArrowPathIcon className="w-5 h-5 text-white" />
              </button>
              <button
                className={`text-blue-500 ${joinCodeEnabled ? 'text-green-500' : 'text-red-500'
                  } bg-gray-800 rounded-full p-2`}
                onClick={handleToggleJoinCodeEnabled}
                aria-label="Toggle join code"
              >
                {joinCodeEnabled ? (
                  <IoToggleOutline className="w-5 h-5 text-white" />
                ) : (
                  <IoToggleOutline className="w-5 h-5 text-red-500" />
                )}
              </button>
            </div>
          </>
        )}
      </div>


      {isOwner ? (
        <>
          <div className="flex items-center justify-center">
            {copied && (
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                <p className="text-gray-500">Code copied to clipboard!</p>
              </div>
            )}
          </div>
          <p className="text-muted hidden md:block">
            Students can click "Join course" on the homepage and enter this code.
          </p>
          {joinCodeEnabled ? (
            <>
              <div className="flex items-center md:block">
                <span className="mr-2">Join link:</span>
                <span
                  className="text-decoration-underline text-primary user-select-all text-blue-500"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      window.location.origin + "/course/join/" + joinCode
                    );
                  }}
                >
                  {window.location.origin}/course/join/{joinCode}
                </span>
              </div>
            </>
          ) : (
            <span>The join link is disabled.</span>
          )}
        </>
      ) : null}
    </div>
  ) : null;
}

export default StudentsInvite