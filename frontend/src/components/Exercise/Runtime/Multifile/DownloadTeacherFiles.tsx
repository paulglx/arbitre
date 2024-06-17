import { ArrowDownTrayIcon } from '@heroicons/react/20/solid'
import { useLazyGetTeacherFilesQuery } from '../../../../features/courses/exerciseApiSlice'

const DownloadTeacherFiles = (props: any) => {

    const { exercise } = props;

    const [getTeacherFiles, _] = useLazyGetTeacherFilesQuery();

    const handleDownload = async (e: any) => {
        e.preventDefault();

        await getTeacherFiles({
            id: exercise.id,
            base64: true
        })
            .unwrap()
            .then(async (response) => {
                const base64response = await fetch(`data:application/zip;base64,${response}`);
                const blob = await base64response.blob();

                const url = URL.createObjectURL(blob);
                const a = Object.assign(document.createElement('a'), {
                    href: url,
                    download: 'teacher_files.zip',
                });
                a.click();
                URL.revokeObjectURL(url);
            })
    }

    return (
        <button
            className="inline p-1 ml-1 text-gray-500 border bg-gray-50 hover:text-blue-800 hover:border-blue-300 hover:bg-blue-50 transition-all rounded-md"
            onClick={handleDownload}
            aria-label='Download teacher files'
        >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span className="sr-only">Download teacher files</span>
        </button>
    )
}

export default DownloadTeacherFiles