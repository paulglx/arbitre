import { ArchiveBoxIcon, ArrowDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

const ZipfileCodePreview = (props: any) => {

    const { fileContent } = props;

    const [blob, setBlob] = useState<Blob | null>(null);

    const humanFileSize = (size: number) => {
        const i: number = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1000));
        return Number((size / Math.pow(1000, i)).toFixed(2)) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    useEffect(() => {
        const base64_encoded_zip = fileContent.content;
        fetch(`data:application/zip;base64,${base64_encoded_zip}`).then(r => r.blob()).then(blob => {
            setBlob(blob);
        });
    }, [fileContent]);

    const downloadZip = async () => {
        const url = blob ? URL.createObjectURL(blob) : "";
        const a = document.createElement('a');
        a.href = url;
        a.download = fileContent.file.split("/").pop();
        a.click();
    }

    return (
        <div className="bg-gray-100 p-8">
            <div className="flex flex-col items-center text-center">
                <h2 className="flex flex-row text-gray-700 font-semibold items-center">
                    <ArchiveBoxIcon className="size-4 mr-1 text-gray-600" />
                    Zipped student files
                </h2>
                <p className="text-gray-500">This submission contains multiple files. Download the zip file to view the content.</p>
                {blob ? <>
                    <button
                        onClick={downloadZip}
                        className="flex flex-row items-center px-2 py-1 mt-4 border rounded-lg transition-all ease-in-out text-sm font-semibold
                        bg-gray-50 text-blue-700
                        hover:bg-blue-600  border-blue-500 hover:text-white"
                    >
                        <ArrowDownIcon className="size-3 mr-1" />
                        Download
                    </button>
                    <span className="text-xs text-gray-400 mt-1">{humanFileSize(blob.size)}</span>
                </> : <>
                    <p className="px-2 py-1 mt-4 border rounded-lg text-gray-400">Loading ...</p>
                    <span className="text-xs text-gray-300 mt-1">...</span>
                </>}
            </div>
        </div>
    )
}

export default ZipfileCodePreview