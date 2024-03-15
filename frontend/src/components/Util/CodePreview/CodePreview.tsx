import CodePreviewDownloadButton from "./CodePreviewDownloadButton";
import Editor from "@monaco-editor/react";
import ZipfileCodePreview from "./ZipfileCodePreview";
import { useGetSubmissionFileContentQuery } from '../../../features/submission/submissionApiSlice';

const CodePreview = (props: any) => {

    const submission_id = props.submissionId;

    const {
        data: fileContent,
        isLoading,
        isError
    } = useGetSubmissionFileContentQuery({ submission_id: submission_id });

    if (isError) {
        return <div className="p-4 text-red-700">An error occurred</div>
    }

    if (isLoading) {
        return <div className="p-4">Loading...</div>
    }

    if (fileContent.type === "not-found") {
        return <div className="p-4 text-red-600">Error: File(s) not found on the server</div>
    }

    return fileContent.type === "single" ? (<>
        <Editor
            defaultLanguage={fileContent.language}
            height={500}
            value={fileContent.content}
            options={
                {
                    readOnly: true,
                    theme: "vs",
                    scrollBeyondLastLine: false,
                }
            }
        />
        <CodePreviewDownloadButton fileContent={fileContent} />
    </>
    ) : (<>
        <ZipfileCodePreview fileContent={fileContent} />
    </>)
}

export default CodePreview