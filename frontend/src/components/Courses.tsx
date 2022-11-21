import { Container, ListGroup } from 'react-bootstrap'
import { selectCurrentUser, selectIsTeacher } from '../features/auth/authSlice';

import Error from './Error';
import Header from './Header'
import { useGetAllCoursesQuery } from '../features/courses/courseApiSlice'
import { useSelector } from "react-redux";

const Courses = () => {

    const {
        data: courses,
        isLoading: courseIsLoading,
        isSuccess: courseIsSuccess,
        isError: courseIsError,
        error: courseError
    } = useGetAllCoursesQuery({});

    const user = useSelector(selectCurrentUser)
    const isTeacher = useSelector(selectIsTeacher)

    const teacherContent = () => {
        return isTeacher ? (
            <ListGroup.Item
                action
                variant="light"
                href="/course/create"
                key='create'
                id='create-course'
            >
                +&nbsp; New course
            </ListGroup.Item>
        ) : <></>
    }

    return courseIsSuccess ? (<>
        <Header />

        <br />

        <Container>

            <h1 className='fw-bold'>Welcome back, {user}!</h1>
            <hr />
            <h2>Your courses</h2>
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
                {teacherContent()}
            </ListGroup>
        </Container>
    </>) : (<Error isError={courseIsError} error={JSON.stringify(courseError)} />)
}

export default Courses