import "../join-code.css"

import { ArrowClockwise, ToggleOff, ToggleOn } from "react-bootstrap-icons"
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useRefreshJoinCodeMutation, useSetJoinCodeEnabledMutation } from "../features/courses/courseApiSlice"

import { selectCurrentUser } from "../features/auth/authSlice"
import { useSelector } from 'react-redux'
import { useState } from 'react'

const StudentsInvite = (props: any) => {

    const [tooltipText, setTooltipText] = useState('Click to copy to clipboard')
    const [refreshJoinCode] = useRefreshJoinCodeMutation()
    const [enableJoinCode] = useSetJoinCodeEnabledMutation()
    const [joinCode, setJoinCode] = useState(props.course.join_code)
    const [joinCodeEnabled, setJoinCodeEnabled] = useState(props.course.join_code_enabled)
    const username = useSelector(selectCurrentUser)
    const course = props.course

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

    const handleToggleJoinCodeEnabled = (enabled: boolean) => {
        enableJoinCode({ course_id: course.id, enabled }).unwrap()
            .then((response) => {
                setJoinCodeEnabled(response.join_code_enabled)
            })
    }

    return isOwner || isTutor ? (<>

        <Container className='bg-light p-3 rounded-4'>
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
}

export default StudentsInvite