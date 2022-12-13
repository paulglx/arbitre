import "../join-code.css"

import { Button, Container, OverlayTrigger, Tooltip } from 'react-bootstrap'

import { Clipboard } from 'react-bootstrap-icons'
import { useState } from 'react'

const Students = (props: any) => {

    const [tooltipText, setTooltipText] = useState('Click to copy to clipboard')

    const course = props.course
    console.log(course)

    return (<>
        <Container className='w-50 bg-light p-3 rounded-4 pb-1'>
            <h3>Join code</h3>
            <div className='text-center fs-2'>
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
    </>)
}

export default Students