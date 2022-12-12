import '../join-code.css'

import { Button, Container, Form } from 'react-bootstrap'

import Header from './Header'
import useDigitInput from 'react-digit-input';
import { useParams } from 'react-router-dom'
import { useState } from 'react'

const JoinCourse = (props: any) => {

    const { join_code } = useParams<{ join_code: string }>()

    const [codeInput, setCodeInput] = useState<any>(join_code || '')
    const digits = useDigitInput({
        acceptedCharacters: /^[0-9]$/,
        length: 8,
        value: codeInput,
        onChange: (value: any) => setCodeInput(value),
    });

    return (
        <>
            <Header />

            <br /><br />

            <Container className='w-50'>
                <h1 className='fw-bold'>Join a course</h1>
                <hr />
                <p className='text-muted'>Enter the 8 digit course ID to join a course.</p>

                <div className="jc-input-group">
                    <input placeholder='X' inputMode="decimal" autoFocus {...digits[0]} />
                    <input placeholder='X' inputMode="decimal" {...digits[1]} />
                    <input placeholder='X' inputMode="decimal" {...digits[2]} />
                    <input placeholder='X' inputMode="decimal" {...digits[3]} />
                    <input placeholder='X' inputMode="decimal" {...digits[4]} />
                    <input placeholder='X' inputMode="decimal" {...digits[5]} />
                    <input placeholder='X' inputMode="decimal" {...digits[6]} />
                    <input placeholder='X' inputMode="decimal" {...digits[7]} />
                </div>

                <br />

                <Button
                    variant='primary'
                    disabled={codeInput.replace(" ", "").length < 8}
                >
                    Join
                </Button>

            </Container>
        </>
    )
}

export default JoinCourse