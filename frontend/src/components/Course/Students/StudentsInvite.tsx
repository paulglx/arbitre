import "../../../join-code.css"

import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useRefreshJoinCodeMutation, useSetJoinCodeEnabledMutation } from "../../../features/courses/courseApiSlice"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import copy from 'clipboard-copy';



import { selectCurrentUser } from "../../../features/auth/authSlice"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { IoToggleOutline } from 'react-icons/io5';

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
          });
      };
      

    const handleCopyJoinCode = () => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      };
      
      return isOwner || isTutor ? (
        <div className="bg-gray-200 p-3 border rounded-3xl flex flex-col gap-4">
          <h2 className="h3 font-bold">Invite students</h2>
          <p className="mb-2 text-center">Course code</p>
      
          <div className="flex items-center mx-auto justify-center bg-gray-400 w-1/5 rounded-xl">
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
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            )}
          </div>
      
          {isOwner ? (
            <>
            {copied && (
  <div className="flex items-center justify-start">
    <CheckCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
    <p className="text-gray-500">Code copied to clipboard!</p>
  </div>
)}
              <div className="flex mx-auto">
                <button
                  className="text-blue-500 mr-2 bg-gray-800 rounded-full p-2"
                  onClick={handleRefreshJoinCode}
                >
                  <ArrowPathIcon className="w-5 h-5 text-white" />
                </button>
                <button
    className={`text-blue-500 ${
        joinCodeEnabled ? 'text-green-500' : 'text-red-500'
    } bg-gray-800 rounded-full p-2`}
    onClick={handleToggleJoinCodeEnabled}
>
    {joinCodeEnabled ? (
        <IoToggleOutline className="w-5 h-5 text-white" />
    ) : (
        <IoToggleOutline className="w-5 h-5 text-red-500" />
    )}
</button>
              </div>
      
              <p className="text-muted">
                Students can click "Join course" on the homepage and enter this code.
              </p>
      
              {joinCodeEnabled ? (
                <>
                  <div className="flex items-center">
  <span className="mr-2">Join link:</span>
  <span
    className="text-decoration-underline text-primary user-select-all"
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
/*
    return isOwner || isTutor ? (<>

        <Container className='bg-light p-3 border rounded-4'>
            <h2 className="h3">Invite students</h2>
            <div className='text-center'>
                <p className="text-muted mb-2">Course code</p>

                {joinCodeEnabled ? (
                    <OverlayTrigger
                        placement="left"
                        overlay={<Tooltip>{tooltipText}</Tooltip>}
                        onExited={() => setTooltipText('Click to copy to clipboard')}
                    >
                        <span
                            id="join-code"
                            className='user-select-none text-center px-2 py-0 rounded-4 h1'
                            role="button"
                            onClick={() => {
                                navigator.clipboard.writeText(joinCode)
                                setTooltipText('Copied!')
                            }}
                        >
                            {joinCode}
                        </span>
                    </OverlayTrigger>
                ) : (
                    <span
                        id="join-code"
                        className='user-select-none text-center px-2 py-0 rounded-4 h1 disabled'
                    >
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                )}

                &nbsp;

                {isOwner ? (<>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Refresh code</Tooltip>}
                    >
                        <ArrowClockwise
                            id="refresh-join-code"
                            className={"h1 px-0 py-2 align-middle bg-light border rounded-circle position-absolute mt-1 ms-1" + (joinCodeEnabled ? "" : " disabled")}
                            role={joinCodeEnabled ? "button" : ""}
                            onClick={joinCodeEnabled ? handleRefreshJoinCode : () => { }}
                        />
                    </OverlayTrigger>

                    <OverlayTrigger
                        placement="right"
                        overlay={<Tooltip>Toggle joining with code</Tooltip>}
                    >
                        {joinCodeEnabled ? (
                            <ToggleOn
                                className="h1 px-0 py-2 align-middle bg-light border rounded-circle position-absolute mt-1 ms-5"
                                role="button"
                                onClick={() => handleToggleJoinCodeEnabled(false)}
                            />
                        ) : (
                            <ToggleOff
                                className="h1 px-0 py-2 align-middle bg-light border rounded-circle position-absolute mt-1 ms-5"
                                role="button"
                                onClick={() => handleToggleJoinCodeEnabled(true)}
                            />
                        )}
                    </OverlayTrigger>

                </>) : <></>}

            </div>

            <br />
            <p className='text-muted'>Students can click "Join course" on the homepage and enter this code.</p>
            {joinCodeEnabled ? (<>
                <span>Join link :&nbsp;</span>
                <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>{tooltipText}</Tooltip>}
                    onExited={() => setTooltipText('Click to copy to clipboard')}
                >
                    <span
                        className="text-decoration-underline text-primary user-select-all"
                        role="button"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.origin + "/course/join/" + joinCode)
                            setTooltipText('Copied!')
                        }}
                    >
                        {window.location.origin}/course/join/{joinCode}
                    </span>
                </OverlayTrigger>
            </>) : <>
                <span>The join link is disabled.</span>
            </>}
        </Container>
    </>) : (<></>)
    */

export default StudentsInvite