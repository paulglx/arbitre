const round = (value: number, decimals: number) => {
    return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

const GradeBadge = (props: { grade: number, total: number }) => {
    if (props.total === null)
        return null;

    return (<span className="text-xs font-medium px-2">
        <span
            className=" text-blue-800"
        >
            {round(props.grade, 1)}
        </span>
        &nbsp;
        <span className="text-blue-800 opacity-50">
            /&nbsp;
            {round(props.total, 1) || "-"}
        </span>

    </span>)
}
export default GradeBadge