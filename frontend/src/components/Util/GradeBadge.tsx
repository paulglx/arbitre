const round = (value: number, decimals: number) => {
    return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

const GradeBadge = (props: { grade: number, total: number, late?: boolean }) => {
    if (props.total === null)
        return null;

    return (<span className="text-xs font-medium px-2">
        <span
            className={`${props.late ? "text-amber-600" : "text-blue-800"}`}
        >
            {round(props.grade, 2)}
        </span>
        &nbsp;
        <span className={`${props.late ? "text-amber-600" : "text-blue-800"} opacity-75`}>
            /&nbsp;
            {round(props.total, 2) || "-"}
        </span>

    </span>)
}
export default GradeBadge