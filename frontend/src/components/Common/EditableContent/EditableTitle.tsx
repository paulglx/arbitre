import autosize from "autosize";

const EditableTitle = (props: any) => {

    const isOwner = props.isOwner;
    const editTitle = props.edit;

    if (!isOwner || !editTitle) {
        return (
            <h1
                aria-label="Edit title"
                className={"text-3xl font-bold bg-white border-0 rounded-lg" + (props.title ? "" : " text-gray-400")}
                id="title-editable"
            >
                {props.title ? props.title : "Enter title"}
            </h1 >
        );
    } else if (isOwner && editTitle) {
        return (
            <input
                aria-label="Edit title"
                autoComplete="off"
                className="p-1 w-full text-3xl border border-gray-300 font-bold rounded-md"
                id="title-input"
                onChange={(e: any) => props.setTitle(e.target.value)}
                onFocus={(e) => autosize(e.target)}
                placeholder="Enter title"
                type="text"
                value={props.title}
            />
        )
    }

    return null;
}

export default EditableTitle