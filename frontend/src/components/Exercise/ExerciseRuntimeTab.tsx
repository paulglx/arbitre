import React, { useEffect } from 'react'

import Editor from "@monaco-editor/react";
import { useState } from 'react'

const ExerciseRuntimeTab = (props: any) => {

    const { edit, course, exercise, isOwner } = props

    const [prefix, setPrefix] = useState("");
    const [suffix, setSuffix] = useState("");

    useEffect(() => {
        setPrefix(exercise.prefix);
        setSuffix(exercise.suffix);
    }, [exercise])

    const getContentHeight = (content: string) => {
        return (content.split("\n").length + 1) * 20 + 20;
    }

    return (<>
        <div className="my-4">
            <h5 className="text-2xl font-bold">Prefix</h5>
            <p className="text-gray-600 mb-4 text-sm">This will be appended before the student's code at runtime.</p>

            <div className="relative rounded-2xl">
                <Editor
                    className="p-2 rounded-lg bg-white border mb-4 focus:ring-blue-500 focus:border-blue-500"
                    value={prefix}
                    height={getContentHeight(prefix) + "px"}
                    onChange={(value, e) => { setPrefix(value as string) }}
                    language={course?.language?.toLowerCase()}
                    options={{
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        readOnly: !isOwner || !edit,
                        renderLineHighlight: "none",
                        renderFinalNewline: false,
                        renderLineHighlightOnlyWhenFocus: false,
                        renderValidationDecorations: "on",
                        renderWhitespace: "none",
                        scrollBeyondLastLine: false,
                    }}
                />
            </div>

            <h5 className="text-2xl font-bold mt-2">Suffix</h5>
            <p className="text-gray-600 mb-4 text-sm">This will be appended after the student's code at runtime.</p>

            <div className="relative rounded-2xl">
                <Editor
                    className="p-2 rounded-lg bg-white border mb-4 focus:ring-blue-500 focus:border-blue-500"
                    value={suffix}
                    height={getContentHeight(suffix) + "px"}
                    onChange={(value, e) => { setSuffix(value as string) }}
                    language={course?.language?.toLowerCase()}
                    options={{
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        readOnly: !isOwner || !edit,
                        renderLineHighlight: "none",
                        renderFinalNewline: false,
                        renderLineHighlightOnlyWhenFocus: false,
                        renderValidationDecorations: "on",
                        renderWhitespace: "none",
                        scrollBeyondLastLine: false,
                        scrollBeyondLastColumn: 0,
                    }}
                />
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