import React from 'react'
import { useSetAutoGroupsMutation } from '../../../../features/courses/courseApiSlice'
import { useState } from 'react'

const StudentGroups = (props: any) => {

    const course = props.course
    const setCourse = props.setCourse

    const [autoGroups, setAutoGroups] = useState<any>(course.auto_groups)
    const [autoGroupsNumber, setAutoGroupsNumber] = useState<any>(course.auto_groups_number)

    const [changeAutoGroups] = useSetAutoGroupsMutation()

    const handleToggleAutoGroups = async () => {
        await changeAutoGroups({ course_id: course.id, auto_groups: !autoGroups })
            .unwrap()
            .catch((e) => {
                console.log(e)
            })
            .then((res) => {
                setAutoGroups(res.auto_groups)
            })
    }

    const handleAutoGroupsNumberChange = async (i: number) => {
        setAutoGroupsNumber(autoGroupsNumber + i)
        await changeAutoGroups({ course_id: course.id, auto_groups_number: autoGroupsNumber + i })
            .unwrap()
            .catch((e) => {
                console.log(e)
            })
            .then((res) => {
                setCourse(res)
            })
    }


    const Container = (props: any) => {
        return (
            <div className="flex flex-row items-center justify-between px-4 py-2 mb-4 bg-gray-50 border rounded-lg">
                {props.children}
            </div>
        )
    }

    const Toggle = (props: any) => {
        return (
            <div className="flex flex-row items-center">
                <input
                    type="checkbox"
                    className="mr-2"
                    checked={autoGroups}
                    onChange={handleToggleAutoGroups}
                />
                <label>Auto groups</label>
            </div>
        )
    }

    return autoGroups ? (<Container>
        <Toggle />
        <div className="flex flex-row items-center">
            <label className="mr-2">Number of groups:</label>
            <button
                className='font-mono px-2 font-bold border rounded-full mr-2 bg-gray-100 align-middle'
                onClick={() => handleAutoGroupsNumberChange(-1)}
                disabled={autoGroupsNumber === 1}
            >
                -
            </button>
            <span className='font-bold'>{autoGroupsNumber}</span>
            <button
                className='font-mono px-2 font-bold border rounded-full ml-2 bg-gray-100 align-middle'
                onClick={() => handleAutoGroupsNumberChange(1)}
                disabled={autoGroupsNumber === course.students.length}
            >
                +
            </button>

        </div>
    </Container>) : (<Container>
        <Toggle />
    </Container>)
}

export default StudentGroups