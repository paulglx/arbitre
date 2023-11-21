const SessionSchedule = (props: any) => {

    const startDate = props.startDate;
    const setStartDate = props.setStartDate;
    const edit = props.edit;

    return (<>
        <div id="start_date_picker" className="p-2">
            <label
                htmlFor="start_date"
                className="text-sm font-medium text-gray-700"
            >
                Start Date
            </label>
            <input
                aria-label="Start Date Picker"
                type="datetime-local"
                name="start_date"
                id="start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={!edit}
                className={
                    edit ?
                        "p-2 mt-1 block rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" :
                        "p-2 mt-1 block rounded-md text-gray-600"}
            />
            {!edit ? <p className="text-xs mt-2 text-gray-500">Click Edit to change</p> : null}
        </div>
    </>)
}

export default SessionSchedule