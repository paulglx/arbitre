const GradeBadge = (props: { grade: number, total: number }) => {
    return (
        <span
            className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-600 ml-4"
        >
            {props.grade} / {props.total || "-"}
        </span>
    )
}
export default GradeBadge