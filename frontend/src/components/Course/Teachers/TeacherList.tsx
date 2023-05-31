import { Col, Form, ListGroup, OverlayTrigger, Row, Tooltip } from "react-bootstrap"
import { DashCircle, DashCircleFill, PlusCircleFill } from 'react-bootstrap-icons';
import { useAddOwnerMutation, useAddTutorMutation, useGetOwnersQuery, useGetTutorsQuery, useRemoveOwnerMutation, useRemoveTutorMutation } from "../../../features/courses/courseApiSlice"
import { useEffect, useState } from "react";

import { selectCurrentUser } from '../../../features/auth/authSlice';
import { useGetTeachersQuery } from '../../../features/users/usersApiSlice';
import { useSelector } from 'react-redux';

const TeacherList = (props: any) => {

    const [addableUsers, setAddableUsers] = useState<any[]>([])
    const [addOwner] = useAddOwnerMutation()
    const [addTutor] = useAddTutorMutation()
    const [owners, setOwners] = useState<any[]>([])
    const [ownerToAdd, setOwnerToAdd] = useState<any>("")
    const [removeOwner] = useRemoveOwnerMutation()
    const [removeTutor] = useRemoveTutorMutation()
    const [tutors, setTutors] = useState<any[]>([])
    const [tutorToAdd, setTutorToAdd] = useState<any>("")
    const course_id: number = props?.courseId
    const current_username = useSelector(selectCurrentUser)
    const isOwner: boolean = props?.isOwner

    const {
        data: ownersData,
        isSuccess: isOwnersSuccess,
    } = useGetOwnersQuery({ course_id })

    const {
        data: tutorsData,
        isSuccess: isTutorsSuccess,
    } = useGetTutorsQuery({ course_id })

    const {
        data: teachersData,
        isSuccess: isTeachersSuccess,
    } = useGetTeachersQuery({})

    useEffect(() => {
        if (isOwnersSuccess) {
            setOwners(ownersData.owners)
        }
    }, [ownersData, isOwnersSuccess])

    useEffect(() => {
        if (isTutorsSuccess) {
            setTutors(tutorsData.tutors)
        }
    }, [tutorsData, isTutorsSuccess])

    useEffect(() => {
        if (isTeachersSuccess && teachersData) {
            const ownersIds = owners.map((o: any) => o.id)
            const tutorsIds = tutors.map((t: any) => t.id)
            setAddableUsers(
                teachersData?.filter((t: any) => !ownersIds.includes(t.id) && !tutorsIds.includes(t.id))
            )
        }
    }, [owners, tutors, teachersData, isTeachersSuccess])

    const handleAddOwner = async (e: any) => {
        e.preventDefault()

        const user_id = teachersData.find((t: any) => t.username === ownerToAdd)?.id
        if (user_id) {
            await addOwner({ course_id, user_id })
            setOwnerToAdd("")
            setOwners([...owners, teachersData.find((t: any) => t.username === ownerToAdd)])
        }
        else if (owners.map((o: any) => o.id).includes(user_id)) {
            alert("User is already an owner")
        }
        else {
            alert("User not found")
        }
    }

    const handleAddTutor = async (e: any) => {
        e.preventDefault()

        const user_id = teachersData.find((t: any) => t.username === tutorToAdd)?.id
        if (user_id) {
            await addTutor({ course_id, user_id })
            setTutorToAdd("")
            setTutors([...tutors, teachersData.find((t: any) => t.username === tutorToAdd)])
        }
        else if (tutors.map((t: any) => t.id).includes(user_id)) {
            alert("User is already a tutor")
        }
        else {
            alert("User not found")
        }
    }

    const handleDeleteOwner = (user_id: number) => {
        removeOwner({ course_id: course_id, user_id: user_id })
        setOwners(owners.filter((o: any) => o.id !== user_id))
    }

    const handleDeleteTutor = (user_id: number) => {
        removeTutor({ course_id: course_id, user_id: user_id })
        setTutors(tutors.filter((t: any) => t.id !== user_id))
    }

    return isOwnersSuccess && isTeachersSuccess ? (<Row>
        <Col md>
            <div className="bg-light p-3 border rounded-4">
                <h2 className="h3">Owners</h2>
                <p className="text-muted">Owners manage sessions and exercises on this course.<br />They also manage students and see their results.</p>
                <ListGroup className="rounded">
                    {owners.map((owner: any) => (
                        <ListGroup.Item key={owner.id} className="d-flex align-items-center justify-content-between">
                            &nbsp;
                            {owner.username}

                            {isOwner ?
                                (owner.username !== current_username ? (
                                    <DashCircleFill className="text-secondary" role="button" onClick={() => handleDeleteOwner(owner.id)} />
                                ) : (
                                    <OverlayTrigger placement='right' overlay={
                                        <Tooltip id="tooltip-disabled">
                                            You cannot remove yourself.
                                        </Tooltip>
                                    }>
                                        <DashCircle className='text-muted' />
                                    </OverlayTrigger>
                                )) : (
                                    <></>
                                )}

                        </ListGroup.Item>
                    ))}

                    {isOwner ? (

                        <ListGroup.Item className="d-flex align-items-center justify-content-between">

                            <Form onSubmit={handleAddOwner}>
                                <Form.Control
                                    type="text"
                                    placeholder="Add owner"
                                    list="teacherOptions"
                                    value={ownerToAdd}
                                    onChange={(e: any) => setOwnerToAdd(e.target.value)}
                                    onSubmit={handleAddOwner}
                                />
                                <datalist id="teacherOptions">
                                    {addableUsers && addableUsers.map((user: any) => (
                                        <option key={user.id} value={user.username} />
                                    ))}
                                </datalist>
                            </Form>

                            <PlusCircleFill role="button" className={ownerToAdd !== "" ? "text-primary" : "text-secondary"} onClick={handleAddOwner} type="submit" />

                        </ListGroup.Item>

                    ) : (
                        <></>
                    )}

                </ListGroup>
            </div>

            <br />
        </Col>

        <Col lg>
            <div className="bg-light p-3 border rounded-4">
                <h2 className="h3">Tutors</h2>
                <p className="text-muted">Tutors can manage students and see their results.</p>
                <ListGroup className="rounded">
                    {tutors.map((tutor: any) => (
                        <ListGroup.Item key={tutor.id} className="d-flex align-items-center justify-content-between">
                            &nbsp;
                            {tutor.username}

                            {isOwner ? (
                                <DashCircleFill className="text-secondary" role="button" onClick={() => handleDeleteTutor(tutor.id)} />
                            ) : (
                                <></>
                            )}

                        </ListGroup.Item>
                    ))}

                    {isOwner ? (
                        <ListGroup.Item className="d-flex align-items-center justify-content-between">

                            <Form onSubmit={handleAddTutor}>
                                <Form.Control
                                    type="text"
                                    placeholder="Add tutor"
                                    list="teacherOptions"
                                    value={tutorToAdd}
                                    onChange={(e: any) => setTutorToAdd(e.target.value)}
                                    onSubmit={handleAddTutor}
                                />
                                <datalist id="teacherOptions">
                                    {addableUsers && addableUsers.map((user: any) => (
                                        <option key={user.id} value={user.username} />
                                    ))}
                                </datalist>
                            </Form>

                            <PlusCircleFill role="button" className={tutorToAdd !== "" ? "text-primary" : "text-secondary"} onClick={handleAddTutor} type="submit" />

                        </ListGroup.Item>
                    ) : (
                        <></>
                    )}

                </ListGroup>
            </div>
        </Col>

    </Row>) : (<></>)
}

export default TeacherList