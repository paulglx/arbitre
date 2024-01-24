import React from 'react'
import TeacherFilesField from './TeacherFilesField'

const MultifileRuntime = (props: any) => {
    return (<div className='p-1'>
        <h3 className="font-semibold mt-2">Teacher Files</h3>
        <p className='text-sm text-gray-500'>
            Select a zip file. Its content will be added at the root of the directory where the student code is executed.
        </p>

        <TeacherFilesField exercise={props.exercise} />
    </div>)
}

export default MultifileRuntime