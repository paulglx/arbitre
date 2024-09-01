import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useMemo, useState } from "react"

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"

const UserSearch = (props: any) => {
    const addableUsers = props.addableUsers
    const userToAdd = props.userToAdd
    const setUserToAdd = props.setUserToAdd
    const placeholder = props.placeholder
    const [query, setQuery] = useState('')

    const sortedAddableUsers = useMemo(() => {
        const studentsToSort = structuredClone(addableUsers)
        const sortedStudents = studentsToSort.sort((a: any, b: any) => { return a.username.localeCompare(b.username) })
        return sortedStudents
    }, [addableUsers])

    console.log(sortedAddableUsers)

    const filteredUsers =
        query === ''
            ? sortedAddableUsers
            : sortedAddableUsers.filter((user:any) => {
                return user.username.toLowerCase().includes(query.toLowerCase())
            })

    return (
        <Combobox value={userToAdd} onChange={setUserToAdd}>
            <ComboboxInput 
                className="w-full py-2 px-4 rounded-lg border me-2"
                aria-label='User to add'
                placeholder={placeholder}
                onChange={(event) => setQuery(event.target.value)}
            />
            <ComboboxOptions anchor="bottom start" className="min-w-44 mt-1 border empty:invisible rounded-lg divide-y bg-white">
                {filteredUsers.map((user:any) => (
                    <ComboboxOption key={user.username} value={user.username} className="px-2 py-1 first:rounded-t-lg last:rounded-b-lg data-[focus]:bg-blue-50 data-[focus]:text-blue-600 data-[focus]:font-semibold">
                        {user.username}
                    </ComboboxOption>
                ))}
            </ComboboxOptions>  
        </Combobox >
    )
}

export default UserSearch