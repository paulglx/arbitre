import Markdown from "../../Util/Markdown";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

const DescriptionContent = (props: any) => {
    const username = useSelector(selectCurrentUser);
    const ownersUsernames = props.course?.owners.map((owner: any) => owner.username);
    const isOwner = ownersUsernames?.includes(username);

    const [editDescription, setEditDescription] = useState(false);
    const [expanded, setExpanded] = useState(false);

    if (!isOwner || !editDescription) {
        return (

            <blockquote
                className={"mt-4 md:mt-6 mb-4 md:mb-6 p-4 md:p-6 bg-gray-200 border rounded-xl bg-gray-200 w-full text-justify" + (isOwner ? " teacher editable-description" : "")}
                onFocus={() => setEditDescription(true)}
                tabIndex={0}
            >
                <Markdown
                    children={props.description}
                />
            </blockquote>
        )
    } else if (isOwner && editDescription) {
        return (
            <form>
                <div className="mt-4 md:mt-6 mb-4 md:mb-6 p-2 md:p-4">
                    <textarea
                        autoFocus
                        className="teacher description-input w-full p-4 rounded-lg border border-gray-300"
                        onBlur={() => {
                            if (props.description === "") {
                                props.setDescription("No description");
                            }
                            setEditDescription(false);
                            props.handleUpdate();
                        }}
                        onChange={(e) => props.setDescription(e.target.value)}
                        placeholder="Enter course description. Markdown is supported."
                        value={props.description}
                    />
                    <p className="text-sm bg-blue-100 text-blue-800 py-2 px-4 rounded-md">
                        <svg className="inline-block w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        You are editing the description - Markdown supported!
                    </p>
                </div>
            </form>
        )
    }

    return null;
}

export default DescriptionContent;