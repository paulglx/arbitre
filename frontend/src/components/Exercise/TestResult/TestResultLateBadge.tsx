const TestResultLateBadge = (props: any) => {

    const submission = props.submission;

    return submission?.late ? <span className="bg-amber-50 text-amber-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-amber-300 cursor-default">
        Late <span className='hidden lg:inline'>submission</span>
    </span> : <></>
}

export default TestResultLateBadge