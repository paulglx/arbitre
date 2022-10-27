import { useParams } from "react-router-dom";
import { useGetSessionQuery } from "../features/courses/sessionApiSlice";
import { useGetExercisesOfSessionQuery } from "../features/courses/exerciseApiSlice";
import { Container, ListGroup, Breadcrumb } from "react-bootstrap";
import Header from "./Header";

const Session = () => {

    const { id }:any = useParams();

    const {
        data: session,
        isLoading: sessionIsLoading,
        isSuccess: sessionIsSuccess,
        isError: sessionIsError,
        error: sessionError
    } = useGetSessionQuery({id});

    const {
        data: exercises,
        isLoading: exercisesIsLoading,
        isSuccess: exercisesIsSuccess,
        isError: exercisesIsError,
        error: exercisesError
    } = useGetExercisesOfSessionQuery({session_id:id});

    const course = session?.course

    if(exercisesIsError || sessionIsError) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The session you are looking for doesn't exist, <br />or you aren't allowed to access it.<br/><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        )
    }

    return sessionIsLoading || exercisesIsLoading  ? (
        <></>
    ):(<>

    <Header />
        
    <Container>
        <Breadcrumb>
            <Breadcrumb.Item href="/course">
                Courses
            </Breadcrumb.Item>
            <Breadcrumb.Item href={"/course/"+course.id}>
                {course.title}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
                {session.title}
            </Breadcrumb.Item>
        </Breadcrumb>
    </Container>

    <br />

    <Container>
        <h1>{session.title}</h1>
        <blockquote>
            {session.description}
        </blockquote>

        <h2>Exercises</h2>
        <ListGroup>
            {exercises.map((exercise:any, i:number) => {
                return <ListGroup.Item
                    action
                    variant="light"
                    href={"/exercise/"+exercise.id}
                    key={i}
                >
                    {exercise.title}
                </ListGroup.Item>
            })}
        </ListGroup>

    </Container>
    </>)
}

export default Session