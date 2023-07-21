import { useEffect, useState } from "react";

import autosize from "autosize";

const EditableTitle = (props: any) => {

    const isOwner = props.isOwner;
    const [editTitle, setEditTitle] = useState(false);
    const [oldValue, setOldValue] = useState(props.title);

    useEffect(() => {
        window.addEventListener('keyup', (event: any) => {
            if (!isOwner) return;
            if (event.key === 'Enter' && editTitle) {
                setEditTitle(false);
            }
            if (event.key === 'Escape' && editTitle) {
                props.setTitle(oldValue);
                setEditTitle(false);
                event.target.blur();
            }
        });
    });

    useEffect(() => {
        console.log("useEffect. editTitle,", editTitle, "props.title,", props.title, "oldValue,", oldValue, "isOwner,", isOwner)
        if (isOwner && !editTitle && props.title && oldValue && oldValue !== props.title) {
            console.log("updating title")
            props.handleUpdate();
            setOldValue(props.title);
        }
    }, [editTitle, props, oldValue, isOwner]);

    if (!isOwner || !editTitle) {
        return (
            <h1
                aria-label="Edit title"
                className={"text-3xl font-bold bg-white border-0 rounded-lg" + (isOwner ? " border hover:ring hover:bg-gray-100" : "") + (props.title ? "" : " text-gray-400")}
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
                onBlur={() => { setEditTitle(false); }}
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