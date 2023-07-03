// import "../../../join-code.css"

import { useRefreshJoinCodeMutation, useSetJoinCodeEnabledMutation } from "../../../features/courses/courseApiSlice"

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { IoToggleOutline } from 'react-icons/io5';
import { pushNotification } from '../../../features/notification/notificationSlice';
import { selectCurrentUser } from "../../../features/auth/authSlice"
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import { useState } from 'react'

const StudentsInvite = (props: any) => {

  const [enableJoinCode] = useSetJoinCodeEnabledMutation()
  const [joinCode, setJoinCode] = useState(props.course.join_code)
  const [joinCodeEnabled, setJoinCodeEnabled] = useState(props.course.join_code_enabled)
  const [refreshJoinCode] = useRefreshJoinCodeMutation()
  const course = props.course
  const dispatch = useDispatch()
  const username = useSelector(selectCurrentUser)

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
    navigator.clipboard.writeText(joinCode);
    dispatch(pushNotification({
      message: "Copied join code to clipboard",
      type: "info"
    }));
  };

  return isOwner || isTutor ? (
    <div className="bg-gray-200 border border-gray-300 rounded-lg p-5 md:p-10">
      <p className="text-2xl font-bold">Invite students</p>
      <span className="text-gray-600">
        Students can join your course by entering the join code below.
      </span>
      <div className="flex justify-center my-5">
        <div className="flex items-center mr-2 text-gray-100 justify-center bg-gray-800 border border-gray-900 px-2 rounded-xl">
          {joinCodeEnabled ? (
            <button
              id="join-code"
              className="font-mono text-center px-2 py-1 rounded-3xl text-4xl"
              onClick={handleCopyJoinCode}
            >
              {joinCode}
            </button>
          ) : (
            <span
              id="join-code"
              className="font-mono text-gray-400 select-none text-center px-2 py-1 rounded-3xl text-4xl"
            >
              DISABLED
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
                className={`text-blue-500 bg-gray-800 rounded-full p-2`}
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


      {
        isOwner ? (
          <>
            {joinCodeEnabled ? (
              <>
                <span className="flex items-center md:block">
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
                </span>
              </>
            ) : (
              <span>The join link is disabled.</span>
            )}
          </>
        ) : null
      }
    </div >
  ) : null;
}

export default StudentsInvite