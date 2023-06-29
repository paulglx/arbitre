import React from 'react'
import moment from 'moment';
import { useState } from 'react';

const TestResultTimeBadge = (props: any) => {

    const time = props.time

    const [showTooltip, setShowTooltip] = useState(false)

    return <div className='inline-block relative text-center'>
        <span
            className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-300 cursor-default"
            onMouseEnter={() => { setShowTooltip(true) }}
            onMouseLeave={() => { setShowTooltip(false) }}
        >
            {moment(time).fromNow()}
        </span>
        {showTooltip ?
            <div id="tooltip" role="tooltip" className="absolute text-center z-10 inline-block px-3 py-1 w-48 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-lg shadow-sm tooltip bottom-full -left-1/2 pointer-events-none mb-1">
                {moment(time).format('MMMM Do YYYY, h:mm:ss a')}
            </div>
            : <></>
        }
    </div>
}

export default TestResultTimeBadge