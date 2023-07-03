import { useEffect, useState } from "react";

import autosize from "autosize";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";

const EditableTitle = (props: any) => {

    const username = useSelector(selectCurrentUser);
    const ownersUsernames = props.course?.owners.map((owner: any) => owner.username);
    const isOwner = ownersUsernames?.includes(username);

    const [editTitle, setEditTitle] = useState(false);

    useEffect(() => {
        window.addEventListener('keyup', (event) => {
            if (event.key === 'Enter' && editTitle) {
                if (editTitle) {
                    (event.target as HTMLElement).blur();
                }
            }
            if (event.key === 'Escape' && editTitle) {
                //TODO revert to previous state
                (event.target as HTMLElement).blur();
            }
        });
    });

    if (!isOwner || !editTitle) {
        return (
            <h1
                aria-label="Edit title"
                className={"text-3xl font-bold text-center hover:bg-gray-200 " + (isOwner ? " teacher editable-title" : "") + (props.title ? "" : " text-gray-400")}
                id="title-editable"
                onFocus={() => isOwner ? setEditTitle(true) : null}
                tabIndex={0} //allows focus
            >
                {props.title ? props.title : "Untitled course"}
            </h1>
        );
    } else if (isOwner && editTitle) {
        return (
            <input
                autoComplete="false"
                autoFocus
                className="w-full text-3xl font-bold rounded-md"
                id="title-input"
                onBlur={() => {
                    if (props.title === "") {
                        props.setTitle("Untitled course");
                    }
                    setEditTitle(false)
                    props.handleUpdate();
                }}
                onChange={(e: any) => props.setTitle(e.target.value)}
                onFocus={(e) => autosize(e.target)}
                placeholder="Enter course title"
                type="text"
                value={props.title}
            />
        )
    }

    return null;
}

export default EditableTitle