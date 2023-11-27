import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const SubmissionDeadline = (props: any) => {

    const { exercise } = props

    const Warning = (text: string) => {
        return (<div className='px-4 py-2 mt-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 flex flex-row items-center'>
            <ExclamationTriangleIcon className='h-5 w-5' />
            <span className='ml-2 text-sm'>{text}</span>
        </div>)
    }


    if (exercise?.session?.has_ended) {
        if (exercise?.session?.can_submit) {
            return (Warning("The session has ended. You can still submit your solution, but it will be marked as late."))
        } else {
            return (Warning("The session has ended. You can no longer submit your solution."))
        }
    }

    return (<></>)
}

export default SubmissionDeadline