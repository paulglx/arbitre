import React from 'react'
import { Container, ListGroup } from 'react-bootstrap'
import { useGetAllCoursesQuery } from '../features/courses/courseApiSlice'
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentRoles } from '../features/auth/authSlice';
import Header from './Header'

const Courses = () => {

    const {
        data: courses,
        isLoading: courseIsLoading,
        isSuccess: courseIsSuccess,
        isError: courseIsError,
        error: courseError
    } = useGetAllCoursesQuery({});

    const user = useSelector(selectCurrentUser)
    const roles = useSelector(selectCurrentRoles)

    const teacherContent = (roles:number[]) => {
        return roles?.includes(2) ? (
            <ListGroup.Item
                action
                variant="light"
                href="/course/create"
                key='create'
            >
                &nbsp; Create Course
            </ListGroup.Item>
        ) : <></>
    }

    return courseIsLoading ? (<></>) : (<>
        <Header />

        <br />

        <Container>

            <h1>{user}'s courses</h1>
            <ListGroup>
                {courses.map((course:any, i:number) => {
                    return <ListGroup.Item
                        action
                        href={"/course/"+course.id}
                        key={i}
                    >
                        {course.title}
                    </ListGroup.Item>
                })}
                {teacherContent(roles)}
            </ListGroup>
        </Container>
    </>)
}

export default Courses