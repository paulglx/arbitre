import 'ace-builds/src-noconflict/ace';
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

import { useEffect, useState } from 'react';

import AceEditor from "react-ace";
import { useGetTestsOfExerciseQuery } from '../features/courses/testApiSlice';

const TestsRawEditor = (props:any) => {

    const {
        data: testsResponse,
    } = useGetTestsOfExerciseQuery({'exercise_id':props.exercise.id});

    const [rawTests, setRawTests] = useState("");

    useEffect(() => {
        setRawTests(JSON.stringify(testsResponse, null, 4));
    }, [testsResponse]);

    return (
        <AceEditor 
            mode="json"
            theme="tomorrow_night_eighties"
            name="tests-raw-editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            fontSize="14px"
            value={rawTests}
            onChange={(value) => setRawTests(value)}
        />
    )
}

export default TestsRawEditor