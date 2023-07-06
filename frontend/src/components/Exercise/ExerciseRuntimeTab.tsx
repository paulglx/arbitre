import Editor from "@monaco-editor/react";
import { useState } from 'react'
import { useUpdateExerciseMutation } from "../../features/courses/exerciseApiSlice";
import { ArrowPathIcon } from '@heroicons/react/24/solid';


const ExerciseRuntimeTab = (props: any) => {

    const { course, session, exercise, isOwner } = props

    const [prefix, setPrefix] = useState("");
    const [suffix, setSuffix] = useState("");
    const [updateExercise] = useUpdateExerciseMutation();
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState("");
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);


    const handleUpdateExercise = async () => {
        try {
            await updateExercise({
                id: exercise.id,
                title: exercise.title,
                description: exercise.description,
                session_id: session.id,
                prefix,
                suffix,
            });
            setNotificationMessage("The exercise has been updated");
            setNotificationType("success");
        } catch (error) {
            setNotificationMessage("There was an error updating the exercise.");
            setNotificationType("error");
        }
        setIsNotificationVisible(true);
    };

    const handleCloseNotification = () => {
        setIsNotificationVisible(false);
    };

    return (<>
        <div className="relative border bg-white rounded-2xl shadow-md p-4 mb-8">
            <h5 className="text-2xl font-bold mb-2">Prefix</h5>
            <p className="text-gray-600 mb-4">This will be appended before the student's code at runtime.</p>

            <div className="relative rounded-2xl">
                <Editor
                    className="h-48 p-2 border rounded-lg bg-white shadow-md mb-4 focus:ring-blue-500 focus:border-blue-500"
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
                {isOwner && (
                    <button
                        className="absolute top-2 right-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md py-2 px-4 transition-colors duration-300"
                        onClick={handleUpdateExercise}
                    >
                        <ArrowPathIcon className="w-6 h-6" />
                    </button>
                )}
            </div>

            <h5 className="text-2xl font-bold mt-6">Suffix</h5>
            <p className="text-gray-600 mb-4">This will be appended after the student's code at runtime.</p>

            <div className="relative rounded-2xl">
                <Editor
                    className="h-48 p-2 border rounded-lg bg-white shadow-md mb-4 focus:ring-blue-500 focus:border-blue-500"
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
                {isOwner && (
                    <button
                        className="absolute top-2 right-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md py-2 px-4 transition-colors duration-300"
                        onClick={handleUpdateExercise}
                    >
                        <ArrowPathIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
            {isNotificationVisible && (
                <div
                    className={`flex items-center justify-between px-4 py-2 mb-4 rounded ${notificationType === "error" ? "bg-red-500" : "bg-green-500"
                        } text-white`}
                >
                    <span>{notificationMessage}</span>
                    <button onClick={handleCloseNotification}>Close</button>
                </div>
            )}
        </div>

        <div className="border rounded-lg bg-white shadow-md p-4 mb-4">
            <h5 className="text-2xl font-bold mb-2">Code preview</h5>
            <p className="text-gray-600 mb-4">This is what the tested file will look like.</p>
            <pre className="border rounded-lg bg-gray-100 p-4">
                {prefix && (
                    <>
                        <span className="font-bold text-sm text-gray-600">{prefix}</span>
                        <br /><br />
                    </>
                )}
                <div className="rounded-md border-2 border-gray-300 p-4 bg-white">
                    <p className="text-gray-600 mb-0">
                        Student code goes here
                    </p>
                </div>
                {suffix && (
                    <>
                        <br />
                        <span className="font-bold text-sm text-gray-600">{suffix}</span>
                    </>
                )}
            </pre>
        </div>
    </>
    )
}

export default ExerciseRuntimeTab