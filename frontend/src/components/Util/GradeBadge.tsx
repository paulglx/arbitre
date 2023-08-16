const GradeBadge = (props: { grade: number, total: number }) => {
    if (props.total === null)
        return null;

    return (<span className="text-xs font-medium px-2">
        <span
            className=" text-blue-800"
        >
            {props.grade}
        </span>
        &nbsp;
        <span className="text-blue-800 opacity-50">
            /&nbsp;
            {props.total || "-"}
        </span>

    </span>)
}
export default GradeBadge