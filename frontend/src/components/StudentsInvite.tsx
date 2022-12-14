import "../join-code.css"

import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { selectCurrentUser, selectIsTeacher } from "../features/auth/authSlice"

import { ArrowClockwise } from "react-bootstrap-icons"
import { useRefreshJoinCodeMutation } from "../features/courses/courseApiSlice"
import { useSelector } from 'react-redux'
import { useState } from 'react'

const StudentsInvite = (props: any) => {

    const [tooltipText, setTooltipText] = useState('Click to copy to clipboard')
    const [refreshJoinCode] = useRefreshJoinCodeMutation()
    const [joinCode, setJoinCode] = useState(props.course.join_code)
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

    return isOwner || isTutor ? (<>

        <Container className='bg-light p-3 rounded-4'>
            <h3>Invite students</h3>
            <div className='text-center'>
                <p className="text-muted mb-2">Course code</p>
                <OverlayTrigger
                    placement="left"
                    overlay={<Tooltip>{tooltipText}</Tooltip>}
                    onExited={() => setTooltipText('Click to copy to clipboard')}
                >
                    <span
                        id="join-code"
                        className='text-center px-2 py-0 rounded-4 h1'
                        role="button"
                        onClick={() => {
                            navigator.clipboard.writeText(joinCode)
                            setTooltipText('Copied!')
                        }}
                    >
                        {joinCode}
                    </span>
                </OverlayTrigger>
                &nbsp;
                {isOwner ? (
                    <OverlayTrigger
                        placement="right"
                        overlay={<Tooltip>Refresh code</Tooltip>}
                    >
                        <ArrowClockwise
                            className="h1 px-0 py-2 align-middle bg-light border rounded-circle position-absolute mt-1 ms-2"
                            role="button"
                            onClick={handleRefreshJoinCode}
                        />
                    </OverlayTrigger>
                ) : <></>}

            </div>

            <br />
            <p className='text-muted'>Students can click "Join course" on the homepage and enter this code.</p>
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
        </Container>
    </>) : (<></>)
}

export default StudentsInvite