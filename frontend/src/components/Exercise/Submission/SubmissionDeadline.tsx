import { ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import moment from 'moment';

const SubmissionDeadline = (props: any) => {

    const { exercise } = props

    const Warning = (text: string) => {
        return (<div className='px-4 py-2 mt-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 flex flex-row items-center'>
            <ExclamationTriangleIcon className='h-5 w-5' />
            <span className='ml-2 text-sm'>{text}</span>
        </div>)
    }

    if (!exercise?.session?.deadline) {
        return (<></>)
    }


    if (exercise?.session?.has_ended) {
        if (exercise?.session?.can_submit) {
            return (Warning(`The session has ended ${moment(exercise.session.deadline).fromNow()}. You can still submit your solution, but it will be marked as late.`))
        } else {
            return (Warning(`The session has ended ${moment(exercise.session.deadline).fromNow()}. You can no longer submit your solution.`))
        }
    }

    return (<div>
        <div className='px-2 py-1 mt-2 text-gray-600 flex flex-row items-center'>
            <ClockIcon className='h-4 w-4' />
            <p className='ml-1 text-sm'>
                You have
                <span className='font-semibold'> {moment(exercise.session.deadline).fromNow(true)} </span>
                left to submit your solution.
                <span className='text-gray-400'> Deadline: {moment(exercise.session.deadline).format("LLL")} </span>
            </p>
        </div>
    </div>)
}

export default SubmissionDeadline