import React from 'react'
import TeacherFilesField from './TeacherFilesField'

const MultifileRuntime = (props: any) => {

    const { exercise } = props;

    const ThereAreTeacherFiles = () => {
        return (
            <div className='text-sm p-3 border rounded-lg bg-green-50 border-green-400'>
                <p className='font-semibold text-green-800'>Teacher files set</p>
                <p className='text-green-700'>The teacher files are set for this exercise. To change them, submit a new zip file below.</p>
            </div>
        )
    }

    const ThereAreNoTeacherFiles = () => {
        return (
            <div className='text-sm p-3 border rounded-lg bg-yellow-50 border-yellow-400'>
                <p className='font-semibold text-yellow-800'>No teacher files yet</p>
                <p className='text-yellow-700'>Submit a zip file containing the teacher files below. They must include a&nbsp;
                    <span className='font-mono font-semibold'>run</span> file, and an additional&nbsp;
                    <span className='font-mono font-semibold'>compile</span> file for compiled languages.</p>
            </div>
        )
    }

    return (<div className='p-1'>

        {exercise.teacher_files === null ? <ThereAreNoTeacherFiles /> : <ThereAreTeacherFiles />}

        <h3 className="font-semibold mt-4">Teacher Files</h3>
        <p className='text-sm text-gray-500'>
            Select a zip file. Its content will be added at the root of the directory where the student code is executed.
        </p>

        <TeacherFilesField exercise={props.exercise} />
    </div>)
}

export default MultifileRuntime