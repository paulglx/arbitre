import { useMemo, useState } from "react"

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"

const UserSearch = (props: any) => {

    const [listIsOpen, setListIsOpen] = useState(false)

    const addableUsers = props.addableUsers
    const userToAdd = props.userToAdd
    const setUserToAdd = props.setUserToAdd
    const placeholder = props.placeholder

    const sortedAddableStudents = useMemo(() => {
        const studentsToSort = structuredClone(addableUsers)
        const sortedStudents = studentsToSort.sort((a: any, b: any) => { return a.username.localeCompare(b.username) })
        return sortedStudents
    }, [addableUsers])

    const searchResults = useMemo(() => {
        if (userToAdd) {
            return sortedAddableStudents.filter((u: any) => u.username.toLowerCase().includes(userToAdd.toLowerCase()))
        } else {
            return sortedAddableStudents
        }
    }, [userToAdd, sortedAddableStudents])

    return (
        <div className="relative w-full pr-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <MagnifyingGlassIcon className="w-4 h-4 ml-1 text-gray-500" />
            </div>
            <input
                aria-label="Search users"
                autoComplete="off"
                type="text"
                className="w-full border border-gray-300 rounded-md shadow-sm pl-8 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={placeholder}
                value={userToAdd}
                onChange={(e) => {
                    setUserToAdd(e.target.value)
                    setListIsOpen(true)
                }}
                onFocus={
                    () => {
                        setListIsOpen(true)
                    }
                }
                onBlur={() => {
                    setListIsOpen(false)
                }}
            />
            {listIsOpen && addableUsers?.length === 0 ? (
                <div className="absolute z-40 w-full mt-1 bg-white rounded-md shadow-lg">
                    <ul
                        tabIndex={-1}
                        role="listbox"
                        aria-labelledby="studentOptions"
                        aria-activedescendant="studentOptions-0"
                        className="z-40 max-h-60 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm divide-y"
                    >
                        <li
                            key="noUsers"
                            id="studentOptions-0"
                            className="bg-gray-50 text-gray-600 select-none relative py-2 pr-4"
                        >
                            <div className="flex items-center">
                                <span className="ml-3 block font-normal truncate">
                                    No users to add
                                </span>
                            </div>
                        </li>
                    </ul>
                </div >
            ) : (<></>)}
            {
                listIsOpen && addableUsers?.length > 0 ? (
                    <div className="absolute z-40 w-full mt-1 bg-white rounded-md shadow-lg
                ">
                        <ul
                            tabIndex={-1}
                            role="listbox"
                            aria-labelledby="studentOptions"
                            aria-activedescendant="studentOptions-0"
                            className="z-40 max-h-60 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm divide-y"
                        >
                            {searchResults ? (searchResults.map((u: any, i: number) => (
                                <li
                                    key={i}
                                    id={`studentOptions-${i}`}
                                    className="z-40 text-gray-900 select-none relative py-2 pr-4 hover:bg-gray-50 cursor-pointer"
                                    onMouseDown={(e) => e.preventDefault()} //Prevents onBlur firing before onClick
                                    onClick={() => {
                                        setUserToAdd(u.username)
                                        setListIsOpen(false)
                                    }}
                                >
                                    <div className="z-40 flex items-center">
                                        <span className="ml-3 block font-normal truncate">
                                            { // Bold the part of the username that matches the search
                                                u.username.split(new RegExp(`(${userToAdd})`, "gi")).map((part: string, i: number) => (
                                                    <span key={i} className={part.toLowerCase() === userToAdd.toLowerCase() ? "font-semibold" : ""}>
                                                        {part}
                                                    </span>
                                                ))
                                            }
                                        </span>
                                    </div>
                                </li>
                            ))) : (
                                <li className="text-gray-900 select-none relative py-2 pr-4 hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-center">
                                        <span className="ml-3 block font-normal truncate">
                                            No results
                                        </span>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                ) : (<></>)
            }
        </div >
    )
}

export default UserSearch