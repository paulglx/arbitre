import { useEffect, useState } from "react";

import autosize from "autosize";

const EditableTitle = (props: any) => {

    const isOwner = props.isOwner;
    const [editTitle, setEditTitle] = useState(false);
    const [oldValue, setOldValue] = useState(props.title);

    useEffect(() => {
        window.addEventListener('keyup', (event) => {
            if (event.key === 'Enter' && editTitle) {
                handleUpdate();
            }
            if (event.key === 'Escape' && editTitle) {
                setEditTitle(false);
                props.setTitle(oldValue);
            }
        });
    });

    const handleUpdate = () => {
        setEditTitle(false);
        if (props.title !== oldValue) {
            props.handleUpdate();
        }
    }

    if (!isOwner || !editTitle) {
        return (
            <h1
                aria-label="Edit title"
                className={"text-3xl font-bold hover:bg-gray-200 " + (isOwner ? " teacher editable-title" : "") + (props.title ? "" : " text-gray-400")}
                id="title-editable"
                onFocus={() => {
                    if (!isOwner) return;
                    setEditTitle(true)
                    setOldValue(props.title)
                }}
                tabIndex={0} //allows focus
            >
                {props.title ? props.title : "Enter title"}
            </h1 >
        );
    } else if (isOwner && editTitle) {
        return (
            <input
                aria-label="Edit title"
                autoComplete="false"
                autoFocus
                className="w-full text-3xl font-bold rounded-md"
                id="title-input"
                onBlur={handleUpdate}
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