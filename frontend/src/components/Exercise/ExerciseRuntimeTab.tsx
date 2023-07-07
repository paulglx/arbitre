import React, { useEffect } from 'react'

import { ArrowPathIcon } from '@heroicons/react/24/solid';
import Editor from "@monaco-editor/react";
import { pushNotification } from "../../features/notification/notificationSlice";
import { useDispatch } from 'react-redux';
import { useState } from 'react'
import { useUpdateExerciseMutation } from "../../features/courses/exerciseApiSlice";

const ExerciseRuntimeTab = (props: any) => {

    const { course, session, exercise, isOwner } = props

    const [prefix, setPrefix] = useState("");
    const [suffix, setSuffix] = useState("");
    const [updateExercise] = useUpdateExerciseMutation();
    const dispatch = useDispatch();


    useEffect(() => {
        setPrefix(exercise.prefix);
        setSuffix(exercise.suffix);
    }, [exercise])

    const handleUpdateExercise = async () => {
        try {
            await updateExercise({
                id: exercise.id,
                title: exercise.title,
                description: exercise.description,
                session_id: session.id,
                prefix, suffix
            });
            dispatch(pushNotification({
                message: "The exercise has been updated",
                type: "success"
            }));
        } catch (error) {
            dispatch(pushNotification({
                message: "There was an error updating the exercise.",
                type: "error"
            }));
        }
    }

    console.log(course?.language?.toLowerCase())

    return (<>
        <div className="my-4">
            <h5 className="text-2xl font-bold">Prefix</h5>
            <p className="text-gray-600 mb-4 text-sm">This will be appended before the student's code at runtime.</p>

            <div className="relative rounded-2xl">
                <Editor
                    className="h-48 p-2 border rounded-lg bg-white shadow mb-4 focus:ring-blue-500 focus:border-blue-500"
                    value={prefix}
                    onChange={(value, e) => { setPrefix(value as string) }}
                    language={course?.language?.toLowerCase()}
                    options={{
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        readOnly: !isOwner,
                        roundedSelection: false,
                        scrollbar: {
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                            useShadows: true,
                            vertical: "visible",
                            horizontal: "visible",
                        },
                        lineDecorationsWidth: 4,
                        glyphMargin: true,
                        renderLineHighlight: "none",
                        renderFinalNewline: false,
                        renderLineHighlightOnlyWhenFocus: false,
                        renderValidationDecorations: "on",
                        renderWhitespace: "none",
                    }}
                />
                {isOwner ? (
                    <button
                        className="absolute top-2 right-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md py-2 px-4 transition-colors duration-300"
                        onClick={handleUpdateExercise}
                    >
                        <ArrowPathIcon className="w-6 h-6" />
                    </button>
                ) : null}
            </div>

            <h5 className="text-2xl font-bold mt-2">Suffix</h5>
            <p className="text-gray-600 mb-4 text-sm">This will be appended after the student's code at runtime.</p>

            <div className="relative rounded-2xl">
                <Editor
                    className="h-48 p-2 border rounded-lg bg-white shadow mb-4 focus:ring-blue-500 focus:border-blue-500"
                    value={suffix}
                    onChange={(value, e) => { setSuffix(value as string) }}
                    language={course?.language?.toLowerCase()}
                    options={{
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        readOnly: !isOwner,
                        roundedSelection: false,
                        scrollbar: {
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                            useShadows: true,
                            vertical: "visible",
                            horizontal: "visible",
                        },
                        lineDecorationsWidth: 4,
                        glyphMargin: true,
                        renderLineHighlight: "none",
                        renderFinalNewline: false,
                        renderLineHighlightOnlyWhenFocus: false,
                        renderValidationDecorations: "on",
                        renderWhitespace: "none",
                    }}
                />
                {isOwner ? (
                    <button
                        className="absolute top-2 right-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md py-2 px-4 transition-colors duration-300"
                        onClick={handleUpdateExercise}
                    >
                        <ArrowPathIcon className="w-6 h-6" />
                    </button>
                ) : null}
            </div>
        </div>

        <div className="border rounded-lg bg-white shadow p-4 mb-4">
            <h5 className="text-2xl font-bold mb-2">Code preview</h5>
            <p className="text-gray-600 mb-4">This is what the tested file will look like.</p>
            <pre className="border rounded-lg bg-gray-100 p-4">
                {prefix ? (
                    <>
                        <span className="font-bold text-sm text-gray-600">{prefix}</span>
                        <br /><br />
                    </>
                ) : null}
                <div className="rounded-md border-2 border-gray-300 p-4 bg-white">
                    <p className="text-gray-600 mb-0">
                        Student code goes here
                    </p>
                </div>
                {suffix ? (
                    <>
                        <br />
                        <span className="font-bold text-sm text-gray-600">{suffix}</span>
                    </>
                ) : null}
            </pre>
        </div>
    </>
    )
}

export default ExerciseRuntimeTab