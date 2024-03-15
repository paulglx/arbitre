import Editor from "@monaco-editor/react";
import React from 'react'

const SinglefileRuntime = (props: any) => {
    const { edit, course, isOwner, prefix, setPrefix, suffix, setSuffix } = props

    const getContentHeight = (content: string) => {
        return (content.split("\n").length + 2) * 18;
    }

    return (<>
        <div className="my-4">
            <h3 className="text-md font-semibold">Prefix</h3>
            <p className="text-gray-600 mb-2 text-sm">This will be appended before the student's code at runtime.</p>

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
                    renderFinalNewline: "off",
                    renderLineHighlightOnlyWhenFocus: false,
                    renderValidationDecorations: "on",
                    renderWhitespace: "none",
                    scrollBeyondLastLine: false,
                    scrollbar: {
                        vertical: "hidden",
                        alwaysConsumeMouseWheel: false,
                    },
                }}
            />

            <h3 className="text-md font-semibold">Suffix</h3>
            <p className="text-gray-600 mb-4 text-sm">This will be appended after the student's code at runtime.</p>

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
                    renderFinalNewline: "off",
                    renderLineHighlightOnlyWhenFocus: false,
                    renderValidationDecorations: "on",
                    renderWhitespace: "none",
                    scrollBeyondLastLine: false,
                    scrollBeyondLastColumn: 0,
                    scrollbar: {
                        vertical: "hidden",
                        alwaysConsumeMouseWheel: false,
                    },
                }}
            />
        </div >

        <div className="p-1 mb-4">
            <h3 className="text-md font-bold">Code preview</h3>
            <p className="text-gray-500 mb-2 text-sm">This is what the tested file will look like.</p>

            <pre className="border rounded-lg text-xs bg-gray-100 p-4">
                {prefix ? (
                    <>
                        <span className="text-xs text-gray-600">{prefix}</span>
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
                        <span className="text-xs text-gray-600">{suffix}</span>
                    </>
                ) : null}
            </pre>
        </div>
    </>
    )
}

export default SinglefileRuntime