import "../join-code.css"

import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap'

import { selectIsTeacher } from "../features/auth/authSlice"
import { useSelector } from 'react-redux'
import { useState } from 'react'

const StudentsInvite = (props: any) => {

    const [tooltipText, setTooltipText] = useState('Click to copy to clipboard')
    const isTeacher = useSelector(selectIsTeacher)

    const course = props.course
    console.log(course)

    return isTeacher ? (<>

        <Container className='bg-light p-3 rounded-4 pb-1'>
            <h3>Invite students</h3>
            <div className='text-center'>
                <p className="text-muted mb-2">Course code</p>
                <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>{tooltipText}</Tooltip>}
                    onExited={() => setTooltipText('Click to copy to clipboard')}
                >
                    <span
                        id="join-code"
                        className='text-center px-2 py-0 rounded-4 h1'
                        role="button"
                        onClick={() => {
                            navigator.clipboard.writeText(course.join_code)
                            setTooltipText('Copied!')
                        }}
                    >
                        {course.join_code}
                    </span>
                </OverlayTrigger>

            </div>

            <br />

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
                        navigator.clipboard.writeText(window.location.origin + "/course/join/" + course.join_code)
                        setTooltipText('Copied!')
                    }}
                >
                    {window.location.origin}/course/join/{course.join_code}
                </span>
            </OverlayTrigger>

            <br />
            <p className='text-muted'>Students can click "Join course" on the homepage and enter this code.</p>
        </Container>
    </>) : (<></>)
}

export default StudentsInvite