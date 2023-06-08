import { Button, Container } from 'react-bootstrap'
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
    const dispatch = useDispatch();
    const [updateExercise] = useUpdateExerciseMutation();

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
                type: "light"
            }));
        } catch (error) {
            dispatch(pushNotification({
                message: "There was an error updating the exercise.",
                type: "danger"
            }));
        }
    }

    return (<>

        <h5>Prefix</h5>
        <p className="text-muted mb-1">This will be appended before the student's code at runtime.</p>

        <Container className="border rounded m-0 mb-1">
            <Editor
                className="p-0 m-0 mt-2"
                value={prefix}
                onChange={(value, e) => { setPrefix(value as string) }}
                language={course?.language?.toLowerCase()}
                height="150px"
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
        </Container>

        <Button variant={prefix !== exercise.prefix ? "primary" : "light"} size="sm" onClick={handleUpdateExercise}>
            Update
        </Button>

        <h5 className="mt-3">Suffix</h5>
        <p className="text-muted mb-1">This will be appended after the student's code at runtime.</p>

        <Container className="border rounded m-0 mb-1">
            <Editor
                className="p-0 m-0 mt-2"
                value={suffix}
                onChange={(value, e) => { setSuffix(value as string) }}
                language={course?.language?.toLowerCase()}
                height="150px"
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
        </Container>

        <Button variant={suffix !== exercise.suffix ? "primary" : "light"} size="sm" onClick={handleUpdateExercise}>
            Update
        </Button>

        <hr />

        <h5>Code preview</h5>
        <p className="text-muted mb-1">This is what the tested file will look like.</p>

        <pre className="border rounded bg-light p-2">
            {prefix !== "" ? (<>{prefix}<br /><br /></>) : (<></>)}
            <div className="rounded border-0 m-1 student-code-preview">
                <br />
                &nbsp;&nbsp;<span className="bg-light p-1 rounded">Student code goes here</span> <br />
                <br />
            </div>
            {suffix !== "" ? (<><br />{suffix}</>) : (<></>)}
        </pre>

    </>)
}

export default ExerciseRuntimeTab