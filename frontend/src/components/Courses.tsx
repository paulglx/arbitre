import React from 'react'
import { Container, ListGroup } from 'react-bootstrap'
import { useGetAllCoursesQuery } from '../features/courses/courseApiSlice'
import { useSelector } from "react-redux";
import { selectCurrentUser } from '../features/auth/authSlice';
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

    return courseIsLoading ? (<></>) : (<>
        <Header />

        <br />

        <Container>

            <h1>{user}'s courses</h1>
            <ListGroup>
                {courses.map((course:any) => {
                    return <ListGroup.Item
                        action
                        variant="light"
                        href={"/course/"+course.id}
                    >
                        {course.title}
                    </ListGroup.Item>
                })}
            </ListGroup>
        </Container>
    </>)
}

export default Courses