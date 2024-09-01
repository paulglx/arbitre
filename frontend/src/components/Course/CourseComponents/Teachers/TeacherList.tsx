import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
    useAddOwnerMutation,
    useAddTutorMutation,
    useGetOwnersQuery,
    useGetTutorsQuery,
    useRemoveOwnerMutation,
    useRemoveTutorMutation,
} from "../../../../features/courses/courseApiSlice";
import { useEffect, useMemo, useState } from "react";
import {
    useGetTeachersQuery,
    useGetUsersQuery,
} from "../../../../features/users/usersApiSlice";

import UserSearch from "../../../Common/UserSearch";
import { pushNotification } from "../../../../features/notification/notificationSlice";
import { selectCurrentUser } from "../../../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const TeacherList = (props: any) => {
    const [addableUsers, setAddableUsers] = useState<any[]>([]);
    const [addOwner] = useAddOwnerMutation();
    const [addTutor] = useAddTutorMutation();
    const [ownerToAdd, setOwnerToAdd] = useState<any>("");
    const [removeOwner] = useRemoveOwnerMutation();
    const [removeTutor] = useRemoveTutorMutation();
    const [tutorToAdd, setTutorToAdd] = useState<any>("");
    const course_id: number = props?.courseId;
    const current_username = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const isOwner: boolean = props?.isOwner;

    const {
        data: owners,
        isLoading: isOwnersLoading,
        isSuccess: isOwnersSuccess,
    } = useGetOwnersQuery({ course_id });

    const {
        data: tutors,
        isLoading: isTutorsLoading,
        isSuccess: isTutorsSuccess,
    } = useGetTutorsQuery({ course_id });

    const sortedOwners = useMemo(() => {
        if (!isOwnersSuccess) return [];

        const ownersToSort = structuredClone(owners);
        const sortedOwners = ownersToSort.sort((a: any, b: any) => {
            return a.username.localeCompare(b.username);
        });
        return sortedOwners;
    }, [owners, isOwnersSuccess]);

    const sortedTutors = useMemo(() => {
        if (!isTutorsSuccess) return [];

        const tutorsToSort = structuredClone(tutors);
        const sortedTutors = tutorsToSort.sort((a: any, b: any) => {
            return a.username.localeCompare(b.username);
        });
        return sortedTutors;
    }, [tutors, isTutorsSuccess]);

    const {
        data: allUsers,
        isLoading: isUsersLoading,
        isSuccess: isUsersSuccess,
    } = useGetUsersQuery({});

    const {
        data: teachersData,
        isLoading: isTeachersLoading,
        isSuccess: isTeachersSuccess,
    } = useGetTeachersQuery({});

    useEffect(() => {
        if (isTeachersSuccess && teachersData) {
            const ownersIds = owners.map((o: any) => o.id);
            const tutorsIds = tutors.map((t: any) => t.id);
            setAddableUsers(
                teachersData?.filter(
                    (t: any) =>
                        !ownersIds.includes(t.id) && !tutorsIds.includes(t.id),
                ),
            );
        }
    }, [owners, tutors, teachersData, isTeachersSuccess]);

    const handleAddOwner = async (e: any) => {
        e.preventDefault();

        const user = allUsers.find((t: any) => t.username === ownerToAdd);

        if (!user) {
            dispatch(
                pushNotification({ message: "User not found", type: "error" }),
            );
            return;
        }

        const user_id = user?.id;

        if (user_id) {
            await addOwner({ course_id, user_id })
                .catch((err) => {
                    dispatch(
                        pushNotification({
                            message: err.data.message,
                            type: "error",
                        }),
                    );
                });
        }
    };

    const handleAddTutor = async (e: any) => {
        e.preventDefault();

        const user = allUsers.find((t: any) => t.username === tutorToAdd);

        if (!user) {
            dispatch(
                pushNotification({ message: "User not found", type: "error" }),
            );
            return;
        }

        const user_id = user?.id;

        if (user_id) {
            await addTutor({ course_id, user_id })
                .catch((err) => {
                    dispatch(
                        pushNotification({
                            message: err.data.message,
                            type: "error",
                        }),
                    );
                });
        }
    };

    const handleDeleteOwner = (user_id: number) => {
        removeOwner({ course_id: course_id, user_id: user_id })
            .catch((err) => {
                dispatch(
                    pushNotification({
                        message: "Something went wrong. Failed to remove owner",
                        type: "error",
                    }),
                );
            });
    };

    const handleDeleteTutor = (user_id: number) => {
        removeTutor({ course_id: course_id, user_id: user_id })
            .catch((err) => {
                dispatch(
                    pushNotification({
                        message: "Something went wrong. Failed to remove tutor",
                        type: "error",
                    }),
                );
            });
    };

    const OwnerList = () => {
        if (!isOwnersSuccess && !isOwnersLoading) {
            return <p>There was an error while trying to get owners.</p>;
        }
        if (isOwnersLoading) {
            return <p>Loading...</p>;
        }
        if (isOwnersSuccess) {
            return (
                <ul className="mt-4">
                    {sortedOwners.map((owner: any) => (
                        <li
                            key={owner.id}
                            className="flex items-center justify-between font-medium py-2 pl-4 pr-2 mt-2 first:mt-0 bg-gray-50 hover:bg-gray-100 border rounded-md"
                        >
                            {owner.username}
                            {isOwner ? (
                                owner.username !== current_username ? (
                                    <XMarkIcon
                                        className="text-red-500 border rounded-md bg-gray-100 hover:bg-gray-200 text-secondary cursor-pointer w-6 h-6"
                                        onClick={() =>
                                            handleDeleteOwner(owner.id)
                                        }
                                    />
                                ) : (
                                    <XMarkIcon
                                        className="text-gray-400 border rounded-md bg-gray-200 text-secondary cursor-default w-6 h-6"
                                        data-toggle="tooltip"
                                        title="You cannot remove yourself."
                                    />
                                )
                            ) : null}
                        </li>
                    ))}
                    {isOwner && (
                        <li className="flex items-center justify-between mt-2 w-full">
                            <form
                                onSubmit={handleAddOwner}
                                className="flex items-center w-full"
                            >
                                <UserSearch
                                    addableUsers={addableUsers}
                                    userToAdd={ownerToAdd}
                                    setUserToAdd={setOwnerToAdd}
                                    placeholder="Search teacher to add"
                                />
                                <PlusIcon
                                    aria-label="Add owner"
                                    className={`${ownerToAdd ? "text-gray-500 bg-gray-50 hover:bg-gray-100" : "text-gray-300 bg-gray-100"} w-10 h-10 p-1 border rounded-md`}
                                    onClick={handleAddOwner}
                                    role="button"
                                    type="submit"
                                />
                            </form>
                        </li>
                    )}
                </ul>
            );
        }
        return <></>;
    };

    const TutorList = () => {
        if (!isTutorsSuccess && !isTutorsLoading) {
            return <p>There was an error while trying to get tutors.</p>;
        }
        if (isTutorsLoading) {
            return <p>Loading...</p>;
        }
        if (isTutorsSuccess) {
            return (
                <ul className="mt-4">
                    {sortedTutors.map((tutor: any) => (
                        <li
                            key={tutor.id}
                            className="flex items-center justify-between font-medium py-2 pl-4 pr-2 mt-2 first:mt-0 bg-gray-50 hover:bg-gray-100 border rounded-md"
                        >
                            {tutor.username}
                            {isOwner ? (
                                tutor.username !== current_username ? (
                                    <XMarkIcon
                                        className="text-red-500 border rounded-md bg-gray-100 hover:bg-gray-200 text-secondary cursor-pointer w-6 h-6"
                                        onClick={() =>
                                            handleDeleteTutor(tutor.id)
                                        }
                                    />
                                ) : null
                            ) : null}
                        </li>
                    ))}
                    {isOwner && (
                        <li className="flex items-center justify-between mt-2 w-full">
                            <form
                                onSubmit={handleAddTutor}
                                className="flex items-center w-full"
                            >
                                <UserSearch
                                    addableUsers={addableUsers}
                                    userToAdd={tutorToAdd}
                                    setUserToAdd={setTutorToAdd}
                                    placeholder="Search teacher to add"
                                />
                                <PlusIcon
                                    aria-label="Add tutor"
                                    className={`${tutorToAdd ? "text-gray-500 bg-gray-50 hover:bg-gray-100" : "text-gray-300 bg-gray-100"} w-10 h-10 p-1 border rounded-md`}
                                    onClick={handleAddTutor}
                                    role="button"
                                    type="submit"
                                />
                            </form>
                        </li>
                    )}
                </ul>
            );
        }
        return <></>;
    };

    return (
        <div className="flex flex-wrap mt-6">
            {!isUsersLoading && !isUsersSuccess ? (
                <p className="text-sm px-2 py-1 border rounded-lg mb-4 bg-red-50 border-red-100 text-red-500">
                    There was an error while trying to get users.
                </p>
            ) : null}
            {!isTeachersLoading && !isTeachersSuccess ? (
                <p className="text-sm px-2 py-1 border rounded-lg mb-4 bg-red-50 border-red-100 text-red-500">
                    There was an error while trying to get teachers. You can
                    enter teacher usernames manually. Please make sure the users
                    you add are actually teachers.
                </p>
            ) : null}
            <div className="w-full md:w-1/2 p-0 md:pr-6 md:border-r">
                <div className="p-1">
                    <h2 className="text-2xl font-bold">Owners</h2>
                    <p className="text-gray-600">
                        Owners manage the sessions and exercises for this
                        course. They also manage students and view their
                        results.
                    </p>
                    <OwnerList />
                </div>
            </div>
            <div className="w-full md:w-1/2 p-0 md:pl-1 mt-6 md:mt-0">
                <div className="p-1 md:pl-6">
                    <h2 className="text-2xl font-bold">Tutors</h2>
                    <p className="text-gray-600">
                        Tutors can manage students and see their results.
                    </p>
                    <TutorList />
                </div>
            </div>
        </div>
    );
};

export default TeacherList;
