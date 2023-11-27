import { ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

import moment from "moment";

const SessionSchedule = (props: any) => {

    const startDate = props.startDate;
    const setStartDate = props.setStartDate;

    const deadline = props.deadline;
    const setDeadline = props.setDeadline;

    const deadlineType = props.deadlineType;
    const setDeadlineType = props.setDeadlineType;

    const edit = props.edit;

    const isOwner = props.isOwner;

    const IncorrectDateWarning = () => {
        return (<div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 mb-2 rounded-lg text-sm flex items-center mt-4">
            <ExclamationTriangleIcon className="w-4 h-4 mr-1 inline" />
            Incorrect dates: The deadline is before the start date.
        </div>);
    }

    const SessionScheduleInfo = () => {

        const sessionDuration = moment.duration(moment(deadline).diff(moment(startDate)));

        let infoString = "";

        if (moment(deadline).isBefore(moment(startDate))) {
            return <IncorrectDateWarning />
        }

        if (startDate) {
            if (moment(startDate).isBefore(moment())) {
                infoString += `started ${moment(startDate).fromNow()}`;
            } else {
                infoString += `starts ${moment(startDate).fromNow()}`;
            }
        }

        if (startDate && deadline) {
            infoString += " and";
        }

        if (deadline) {
            if (moment(deadline).isBefore(moment())) {
                infoString += ` ended ${moment(deadline).fromNow()}`;
            } else {
                infoString += ` ends ${moment(deadline).fromNow()}`;
            }
        }

        if (sessionDuration.asSeconds() > 0) {

            if (moment(deadline).isBefore(moment())) {
                infoString += `. It lasted ${sessionDuration.humanize()}`;
            } else {
                infoString += `. It will last ${sessionDuration.humanize()}`;
            }
        }

        if (deadline) {

            if (deadlineType === "soft") {
                if (moment(deadline).isBefore(moment())) {
                    infoString += ". Students can still submit, but will be marked as late.";
                } else {
                    infoString += ". Students will be able to submit after the deadline, but will be marked as late.";
                }

            } else if (deadlineType === "hard") {
                if (moment(deadline).isBefore(moment())) {
                    infoString += ". Students can no longer submit.";
                } else {
                    infoString += ". Students will not be able to submit after the deadline.";
                }
            }

        } else {

            if (moment(startDate).isBefore(moment())) {
                infoString += ". Students can submit at any time.";
            } else {
                infoString += ". Until then, students can't submit.";
            }
        }

        if (!startDate && !deadline) {
            infoString = "has no schedule. Students can submit at any time.";
        }

        return (<div className="bg-gray-50 border border-gray-100 text-gray-600 px-4 py-2 mb-2 rounded-lg text-sm flex items-center mt-4">
            <InformationCircleIcon className="w-4 h-4 mr-1 inline" />
            This session {infoString}
        </div>)

    }

    return (<>

        <SessionScheduleInfo />

        {!isOwner ? (<div className="bg-blue-50 border border-blue-100 text-blue-600 px-4 py-2 mb-2 rounded-lg text-sm flex items-center mt-4">
            <InformationCircleIcon className="w-4 h-4 mr-1 inline" />
            Only course owners can edit the schedule.
        </div>) : null}

        <div id="start_date_picker" className="p-2">
            <label
                id="start_date_label"
                htmlFor="start_date"
                className="font-semibold text-gray-900"
            >
                Start Date
            </label>
            <label htmlFor="start_date_label" className="block text-sm text-gray-600 mb-2">
                The date and time that the session will start. Before this time, the session will be hidden from students.
            </label>
            <input
                aria-label="Start Date Picker"
                type="datetime-local"
                name="start_date"
                id="start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={!edit || !isOwner}
                className={
                    edit ?
                        "p-2 mt-1 block rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" :
                        "p-2 mt-1 block rounded-md text-gray-600"}
            />
        </div>

        <hr className="my-4" />

        <div id="deadline_picker" className="p-2">
            <label
                id="deadline_label"
                htmlFor="deadline"
                className="font-semibold text-gray-900"
            >
                Deadline
            </label>
            <label htmlFor="deadline_label" className="block text-sm text-gray-600 mb-2">
                The date and time that the session will end.
            </label>
            <input
                aria-label="Deadline Picker"
                type="datetime-local"
                name="deadline"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                disabled={!edit || !isOwner}
                className={
                    edit ?
                        "p-2 mt-1 block rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" :
                        "p-2 mt-1 block rounded-md text-gray-600"}
            />

        </div>

        <div id="deadline_type_radio" className="p-2">

            <label
                id="deadline_type_label"
                htmlFor="deadline_type"
                className="font-semibold text-gray-900"
            >
                Deadline Type
            </label>

            <label htmlFor="deadline_type_label" className="block text-sm text-gray-600 mb-2">
                The type of deadline that the session will have.
            </label>

            <div className="flex">

                <div className="flex items-center h-5">
                    <input
                        id="deadline_type"
                        name="deadline_type"
                        type="radio"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        checked={deadlineType === "soft"}
                        onChange={() => setDeadlineType("soft")}
                        disabled={!edit || !isOwner}
                    />
                </div>
                <div className="ms-2 text-sm">
                    <label htmlFor="deadline_type" className="font-semibold text-gray-900">
                        Soft deadline
                    </label>
                    <label htmlFor="deadline_type" className="block text-sm text-gray-600 mb-2">
                        Students will be able to submit after the deadline, but will be marked as late.
                    </label>
                </div>

            </div>

            <div className="flex">

                <div className="flex items-center h-5">
                    <input
                        id="deadline_type"
                        name="deadline_type"
                        type="radio"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        checked={deadlineType === "hard"}
                        onChange={() => setDeadlineType("hard")}
                        disabled={!edit || !isOwner}
                    />
                </div>
                <div className="ms-2 text-sm">
                    <label htmlFor="deadline_type" className="font-semibold text-gray-900">
                        Hard deadline
                    </label>
                    <label htmlFor="deadline_type" className="block text-sm text-gray-600 mb-2">
                        Students will not be able to submit after the deadline.
                    </label>
                </div>
            </div>

        </div>

        {isOwner && !edit ? <p className="text-sm mt-4 text-gray-700">Note: Click Edit to change the schedule</p> : null}

    </>)
}

export default SessionSchedule