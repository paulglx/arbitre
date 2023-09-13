import { ArrowsPointingInIcon, ArrowsPointingOutIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';
import React, { useEffect } from 'react'

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

    const [prefixTall, setPrefixTall] = useState(false);
    const [suffixTall, setSuffixTall] = useState(false);

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

    return (<>
        <div className="my-4">
            <h5 className="text-2xl font-bold">Prefix</h5>
            <p className="text-gray-600 mb-4 text-sm">This will be appended before the student's code at runtime.</p>

            <div className="relative rounded-2xl">
                <Editor
                    className="p-2 rounded-lg bg-white border mb-4 focus:ring-blue-500 focus:border-blue-500"
                    value={prefix}
                    height={prefixTall ? "840px" : "254px"}
                    onChange={(value, e) => { setPrefix(value as string) }}
                    language={course?.language?.toLowerCase()}
                    options={{
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        readOnly: !isOwner,
                        renderLineHighlight: "none",
                        renderFinalNewline: false,
                        renderLineHighlightOnlyWhenFocus: false,
                        renderValidationDecorations: "on",
                        renderWhitespace: "none",
                    }}
                />
                {isOwner ? (
                    <div className='absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity duration-200'>
                        <div className='flex flex-row'>
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white rounded-md p-2 mr-2"
                                onClick={() => { setPrefixTall(!prefixTall); }}
                            >
                                {prefixTall ?
                                    <ArrowsPointingInIcon className="h-5 w-5" />
                                    :
                                    <ArrowsPointingOutIcon className="h-5 w-5" />
                                }
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md p-2"
                                onClick={handleUpdateExercise}
                            >
                                <DocumentCheckIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>

            <h5 className="text-2xl font-bold mt-2">Suffix</h5>
            <p className="text-gray-600 mb-4 text-sm">This will be appended after the student's code at runtime.</p>

            <div className="relative rounded-2xl">
                <Editor
                    className="p-2 rounded-lg bg-white border mb-4 focus:ring-blue-500 focus:border-blue-500"
                    value={suffix}
                    height={suffixTall ? "840px" : "254px"}
                    onChange={(value, e) => { setSuffix(value as string) }}
                    language={course?.language?.toLowerCase()}
                    options={{
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        readOnly: !isOwner,
                        renderLineHighlight: "none",
                        renderFinalNewline: false,
                        renderLineHighlightOnlyWhenFocus: false,
                        renderValidationDecorations: "on",
                        renderWhitespace: "none",
                    }}
                />
                {isOwner ? (
                    <div className='absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity duration-200'>
                        <div className='flex flex-row'>
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white rounded-md p-2 mr-2"
                                onClick={() => { setSuffixTall(!suffixTall); }}
                            >
                                {suffixTall ?
                                    <ArrowsPointingInIcon className="h-5 w-5" />
                                    :
                                    <ArrowsPointingOutIcon className="h-5 w-5" />
                                }
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md p-2"
                                onClick={handleUpdateExercise}
                            >
                                <DocumentCheckIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div >

        <div className="p-1 mb-4">
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