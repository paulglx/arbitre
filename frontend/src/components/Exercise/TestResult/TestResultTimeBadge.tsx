import { ClockIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useState } from 'react';

const TestResultTimeBadge = (props: any) => {

    const time = props.time

    const [showTooltip, setShowTooltip] = useState(false)

    return <div className='inline-block relative text-center'>
        <span
            className="inline-flex flex-row items-center bg-gray-100 bg-opacity-50 text-gray-800 text-sm font-medium mr-2 py-1 px-2 rounded border border-gray-300 cursor-default"
            onMouseEnter={() => { setShowTooltip(true) }}
            onMouseLeave={() => { setShowTooltip(false) }}
        >
            <ClockIcon className="inline w-4 h-4 text-gray-600" />
            <span className='ml-1 hidden md:inline text-xs'>
                {moment(time).fromNow()}
            </span>
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