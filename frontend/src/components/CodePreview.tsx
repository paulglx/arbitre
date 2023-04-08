import Editor from "@monaco-editor/react";
import { useGetSubmissionFileContentQuery } from '../features/submission/submissionApiSlice';

const CodePreview = (props: any) => {

    const submission_id = props.submissionId;

    const {
        data: fileContent,
        isSuccess,
    } = useGetSubmissionFileContentQuery({ submission_id: submission_id });

    return isSuccess ? (
        <Editor
            defaultLanguage={fileContent.language}
            height={500}
            value={fileContent.content}
            theme="vs-dark"
            options={
                {
                    readOnly: true,
                    theme: "vs",
                }
            }
        />
    ) : (<></>)
}

export default CodePreview