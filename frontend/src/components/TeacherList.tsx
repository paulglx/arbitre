import { DashCircleFill, PlusCircleFill } from 'react-bootstrap-icons';
import { Form, ListGroup } from "react-bootstrap"
import { useAddOwnerMutation, useGetOwnersQuery, useRemoveOwnerMutation } from "../features/courses/courseApiSlice"
import { useEffect, useState } from "react";

import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetTeachersQuery } from '../features/users/usersApiSlice';
import { useSelector } from 'react-redux';

const TeacherList = (props:any) => {

    const [addOwner] = useAddOwnerMutation()
    const [owners, setOwners] = useState<any[]>([])
    const [addableUsers, setAddableUsers] = useState<any[]>([])
    const [userToAdd, setUserToAdd] = useState<any>("")
    const [removeOwner] = useRemoveOwnerMutation()
    const course_id:number = props?.courseId
    const current_username = useSelector(selectCurrentUser)

    const {
        data: ownersData,
        isSuccess: isOwnersSuccess,
        isLoading: isOwnersLoading,
        isError: isOwnersError,
        error: ownersError
    } = useGetOwnersQuery({course_id: course_id})

    const {
        data: teachersData,
        isSuccess: isTeachersSuccess,
        isLoading: isTeachersLoading,
        isError: isTeachersError,
        error: teachersError
    } = useGetTeachersQuery({})

    useEffect(() => {
        if (isOwnersSuccess) {
            setOwners(ownersData.owners)
        }
    }, [ownersData, isOwnersSuccess])

    useEffect(() => {
        if (isTeachersSuccess && teachersData) {
            const ownersIds = owners.map((o:any) => o.id)
            setAddableUsers(
                teachersData?.filter((t:any) => !ownersIds.includes(t.id))

            )
        }
    }, [owners, teachersData, isTeachersSuccess])

    const handleAddOwner = async (e:any) => {
        e.preventDefault()

        const user_id = teachersData.find((t:any) => t.username === userToAdd)?.id
        if (user_id) {
            await addOwner({course_id, user_id})
            setUserToAdd("")
            setOwners([...owners, teachersData.find((t:any) => t.username === userToAdd)])
        }
        else if (owners.map((o:any) => o.id).includes(user_id)) {
            alert("User is already an owner")
        }
        else {
            alert("User not found")
        }
    }

    const handleDeleteOwner = (user_id:number) => {
        removeOwner({course_id: course_id, user_id: user_id})
        setOwners(owners.filter((o:any) => o.id !== user_id))
    }

    return isOwnersSuccess && isTeachersSuccess ? (<div className="bg-light p-3 border-0 rounded-5">
        <h3>Owners</h3>
        <p className="text-muted">Owners can see, edit and delete courses.</p>
        <ListGroup className="w-25 rounded-4">
            {owners.map((owner:any) => (
                <ListGroup.Item key={owner.id} className="d-flex align-items-center justify-content-between">
                    &nbsp;
                    {owner.username}

                    <DashCircleFill className="text-secondary" role="button" onClick={() => handleDeleteOwner(owner.id)}/>

                </ListGroup.Item>
            ))}

            <ListGroup.Item className="d-flex align-items-center justify-content-between">

                <Form onSubmit={handleAddOwner}>
                    <Form.Control
                        type="text"
                        placeholder="Add teacher"
                        list="teacherOptions"
                        value={userToAdd}
                        onChange={(e:any) => setUserToAdd(e.target.value)}
                        onSubmit={handleAddOwner}
                    />
                    <datalist id="teacherOptions">
                        {addableUsers && addableUsers.map((user:any) => (
                            <option key={user.id} value={user.username}/>
                        ))}
                    </datalist>
                </Form>

                <PlusCircleFill role="button" className={userToAdd !== "" ? "text-primary" : "text-secondary"} onClick={handleAddOwner} type="submit" />

            </ListGroup.Item>

        </ListGroup>
        </div>
    ) : (<></>)
}

export default TeacherList