const SessionSchedule = (props: any) => {

    const startDate = props.startDate;
    const setStartDate = props.setStartDate;
    const edit = props.edit;

    const isOwner = props.isOwner;

    return (<>
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
            {!edit ? <p className="text-xs mt-2 text-gray-500">Click Edit to change</p> : null}
            {!isOwner ? <p className="text-xs mt-2 text-gray-500">Only the owner can change this</p> : null}
        </div>
    </>)
}

export default SessionSchedule