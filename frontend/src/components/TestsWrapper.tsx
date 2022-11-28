import { Dropdown } from 'react-bootstrap';
import React from 'react'
import TestsEditor from './TestsEditor';
import { useState } from 'react'

const TestsWrapper = (props:any) => {

    const [chosenEditor, setChosenEditor] = useState('VISUAL'); //VISUAL or RAW

    return (<>
        <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                Edit mode
            </Dropdown.Toggle>

            <Dropdown.Menu className='p-2'>
                <Dropdown.Item 
                    className={'rounded-3' + (chosenEditor==='VISUAL' ? ' bg-dark text-white' : '')}
                    onClick={() => setChosenEditor("VISUAL")}
                >
                        <span className='fw-bold'>Visual</span>
                        <br />
                        <small className='text-muted'>Edit tests in a visual editor</small>
                </Dropdown.Item>

                <Dropdown.Item
                    className={'rounded-3' + (chosenEditor==='RAW' ? ' bg-dark text-white' : '')}
                    active={chosenEditor === "RAW"}
                    onClick={() => setChosenEditor("RAW")}
                >
                    <span className='fw-bold'>Raw</span>
                    <br />
                    <small className='text-muted'>Edit tests in a raw JSON editor</small>
                </Dropdown.Item>

            </Dropdown.Menu>
        </Dropdown>

        <br />

        {chosenEditor === 'VISUAL' ? (<TestsEditor exercise={props.exercise} />) : (<p>TODO</p>) }

    </>)

}

export default TestsWrapper