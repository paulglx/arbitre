import Header from "../Common/Header"

const Error = (props: any) => {

    const isError = props.isError
    const error = props.error ? JSON.parse(props.error) : {}

    const errorExplained = (status: any) => {
        switch (status) {
            case 'FETCH_ERROR':
                return 'There was an error fetching the data from the server. Please try again later.'
            case 'PARSING_ERROR':
                return 'There was an error parsing the data from the server. The database might be corrupted.'
            default:
                return 'There was an unknown error.'
        }
    }

    return isError && error ? (<>

        <div className="container mx-auto items-center p-3 mt-6 w-1/2 bg-red-50 border border-red-200 rounded-lg">
            <span className="font-bold">Error</span>
            <div className="text-sm text-gray-500">
                <span>{errorExplained(error.status)}</span>
            </div>
        </div>
    </>) : (<></>)
}

export default Error