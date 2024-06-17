import { DocumentIcon } from '@heroicons/react/24/outline';
import DownloadTeacherFiles from './DownloadTeacherFiles';
import RemoveTeacherFiles from './RemoveTeacherFiles';
import TeacherFilesField from './TeacherFilesField'

const MultifileRuntime = (props: any) => {

    const { exercise } = props;

    const ThereAreTeacherFiles = () => {
        return (<>
            <span className='inline-flex items-center border shadow rounded-lg px-2 py-1 bg-green-50 border-green-300 text-green-800 font-semibold font-mono text-sm'>
                <DocumentIcon className='inline h-4 w-4 text-green-600 mr-1' />
                teacher_files.zip
            </span>
            <span className='text-green-500 ml-2'>✓</span>
            <RemoveTeacherFiles exercise={props.exercise} />
            <DownloadTeacherFiles exercise={props.exercise} />
            <p className='text-sm text-green-700 mt-2 ml-1'>
                Your files are on the server. The worker is ready to run and test student code. You can change the files by uploading a new zip file.
            </p>
        </>)
    }

    const ThereAreNoTeacherFiles = () => {
        return (<>
            <span className='inline-flex items-center border shadow rounded-lg px-2 py-1 bg-gray-50 border-gray-300 text-gray-500 font-semibold font-mono text-sm border-dashed'>
                <DocumentIcon className='inline h-4 w-4 text-gray-600 mr-1' />
                teacher_files.zip
            </span>
            <span className='text-gray-500 ml-2 text-sm'>(missing)</span>
            <p className='text-sm text-gray-500 mt-2 ml-1'>
                The worker doesn't know how to run the student code yet. Please upload a zip file including the necessary files.
            </p>
        </>)
    }

    return (<div className='p-1'>

        <h3 className="font-semibold">Teacher Files</h3>
        <p className='text-sm text-gray-500'>
            Select a zip file. Its content will be added at the root of the directory where the student code is executed.
        </p>

        <TeacherFilesField exercise={props.exercise} />
        {exercise.teacher_files === null ? <ThereAreNoTeacherFiles /> : <ThereAreTeacherFiles />}
    </div>)
}

export default MultifileRuntime