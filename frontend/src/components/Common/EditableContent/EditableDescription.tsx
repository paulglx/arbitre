import { useEffect, useState } from "react";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Markdown from "../../Util/Markdown";
import autosize from "autosize";

const EditableDescription = (props: any) => {
    const [editDescription, setEditDescription] = useState(false);
    const [oldValue, setOldValue] = useState(props.description);
    const isOwner = props.isOwner;

    useEffect(() => {
        window.addEventListener('keyup', (event) => {
            if (event.key === 'Escape' && editDescription) {
                props.setDescription(oldValue);
                (event.target as HTMLElement).blur();
            }
        });
    });

    if ((!isOwner || !editDescription)) {
        return (
            <blockquote
                className={"my-4 p-4 border rounded-lg bg-gray-50 w-full text-justify overflow-x-auto" + (isOwner ? " teacher hover:border-dashed" : "") + (props.description ? "" : " text-gray-400")}
                onFocus={() => {
                    if (!isOwner) return;
                    setEditDescription(true)
                    setOldValue(props.description)
                }}
                tabIndex={0}
            >
                <Markdown
                    children={props.description ? props.description : "Enter course description."}
                />
            </blockquote>
        )
    } else if (isOwner && editDescription) {
        return (
            <form className="py-4">
                <textarea
                    autoFocus
                    aria-label="Course description"
                    className="teacher description-input w-full p-4 rounded-lg border border-gray-300"
                    onBlur={() => {
                        if (props.description === "") {
                            props.setDescription("No description");
                        }
                        setEditDescription(false);
                        if (props.description !== oldValue) {
                            props.handleUpdate();
                        }
                    }}
                    onFocus={(e) => autosize(e.target)}
                    onChange={(e) => props.setDescription(e.target.value)}
                    placeholder="Enter course description."
                    value={props.description}
                />
                <p className="text-sm bg-blue-100 text-blue-800 py-2 px-4 rounded-md">
                    <InformationCircleIcon className="inline-block w-4 h-4 mr-1" />
                    You are editing the description - Markdown and Katex supported!
                </p>
            </form>
        )
    }

    return null;
}

export default EditableDescription;