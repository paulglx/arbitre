import Header from './Header'

const DummyBreadcrumb = () => {
    return (<>
        <div className="hidden md:flex py-3 mt-2 md:mt-6 w-full text-gray-700 rounded-lg" aria-label="Breadcrumb">
            <span className="bg-gray-100 px-4 py-2 rounded-lg flex items-center text-blue-600 w-2/6" aria-current="page">&nbsp;</span>
        </div >
        <div className="flex md:hidden">
            <span className="flex bg-gray-100 px-4 py-2 rounded-lg items-center text-gray-600 hover:bg-gray-100">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
        </div >
    </>)
}

const DummyTitle = () => {
    return (<>
        <div
            className={"text-3xl font-bold bg-gray-100 border-0 rounded-lg"}
        >
            &nbsp;
        </div >
    </>)
}

const DummyDescription = () => {
    return (<>
        <div
            className={"my-4 px-4 rounded-lg bg-gray-100 w-full overflow-x-auto"}
        >
            &nbsp; <br />
            &nbsp; <br />
            &nbsp; <br />
            &nbsp; <br />
            &nbsp;
        </div>
    </>)
}

const CSELoading = (props: any) => {

    return (<>
        <Header />

        <br />

        <div className="container mx-auto animate-pulse select-none">

            <DummyBreadcrumb />

            <br />

            <div className="flex items-center justify-between">
                <div className="w-full">
                    <DummyTitle />
                </div>
            </div>

            <DummyDescription />

        </div>
    </>)
}

export default CSELoading