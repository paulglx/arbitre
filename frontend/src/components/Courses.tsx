import { Container, ListGroup } from 'react-bootstrap'
import { selectCurrentUser, selectIsTeacher } from '../features/auth/authSlice';

import { BoxArrowInDownRight } from 'react-bootstrap-icons';
import Error from './Error';
import Header from './Header'
import { useGetAllCoursesQuery } from '../features/courses/courseApiSlice'
import { useSelector } from "react-redux";

const Courses = () => {

    const {
        data: courses,
        isSuccess: courseIsSuccess,
        isError: courseIsError,
        error: courseError
    } = useGetAllCoursesQuery({});

    const user = useSelector(selectCurrentUser)
    const isTeacher = useSelector(selectIsTeacher)

    const teacherContent = () => {
        return isTeacher ? (
            <ListGroup className='rounded-4 mt-3 '>
                <ListGroup.Item
                    action
                    variant="light"
                    href="/course/create"
                    key='create'
                    id='create-course'
                >
                    +&nbsp; New course
                </ListGroup.Item>
            </ListGroup>) : <></>
    }

    return courseIsSuccess ? (<>
        <Header />

        <Container>

            <br />

            <h1 className='fw-bold'>Welcome back, {user}!</h1>
            <hr />
            <h2>Your courses</h2>
            <ListGroup className='rounded-4'>
                {courses.map((course: any, i: number) => {
                    return <ListGroup.Item
                        action
                        href={"/course/" + course.id}
                        key={i}
                    >
                        {course.title}
                    </ListGroup.Item>
                })}
            </ListGroup>

            <ListGroup className='rounded-4 mt-3'>
                <ListGroup.Item>
                    <BoxArrowInDownRight className='mb-1' /> &nbsp; Join a course
                </ListGroup.Item>
            </ListGroup>

            {teacherContent()}



        </Container>
    </>) : (<Error isError={courseIsError} error={JSON.stringify(courseError)} />)
}

export default Courses