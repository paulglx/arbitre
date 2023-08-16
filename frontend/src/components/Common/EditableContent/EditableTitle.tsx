import { useEffect, useState } from "react";

import autosize from "autosize";

const EditableTitle = (props: any) => {

    const isOwner = props.isOwner;
    const [editTitle, setEditTitle] = useState(false);
    const [oldValue, setOldValue] = useState(props.title || "");

    const handleKeyDown = (event: any) => {
        if (!isOwner) return;
        if (editTitle && event.key === 'Escape') {
            props.setTitle(oldValue);
            setEditTitle(false);
            event.target.blur();
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', (event: any) => {
            handleKeyDown(event);
        });

        return () => {
            window.removeEventListener('keydown', (event: any) => {
                handleKeyDown(event);
            });
        }
    });

    const updateIfNeeded = () => {
        if (props.title !== oldValue) {
            props.handleUpdate();
            setOldValue(props.title);
        }
    }

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
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    updateIfNeeded()
                    setEditTitle(false)
                }}
            >
                <input
                    aria-label="Edit title"
                    autoComplete="off"
                    autoFocus
                    className="w-full text-3xl font-bold rounded-md"
                    id="title-input"
                    data-testid={props.dataTestId}
                    onChange={(e: any) => props.setTitle(e.target.value)}
                    onFocus={(e) => autosize(e.target)}
                    onBlur={(e) => {
                        updateIfNeeded()
                        setEditTitle(false)
                    }}
                    placeholder="Enter title"
                    type="text"
                    value={props.title}
                />
            </form>
        )
    }

    return null;
}

export default EditableTitle