import { DocumentArrowDownIcon } from '@heroicons/react/24/solid';

const CodePreviewDownloadButton = (props: any) => {

    const fileContent = props.fileContent;

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([fileContent.content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = fileContent.file.split("/").pop();
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    return (
        <button onClick={handleDownload} className="flex flex-row items-center p-4 text-gray-700 text-sm font-normal mr-2">
            <DocumentArrowDownIcon className="inline w-4 h-4 text-gray-800" />
            &nbsp;
            Download
        </button>
    )
}

export default CodePreviewDownloadButton