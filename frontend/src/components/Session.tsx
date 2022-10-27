import { useNavigate, useParams } from "react-router-dom";
import { useDeleteSessionMutation, useGetSessionQuery } from "../features/courses/sessionApiSlice";
import { useGetExercisesOfSessionQuery } from "../features/courses/exerciseApiSlice";
import { Container, ListGroup, Breadcrumb, Popover, Button, OverlayTrigger } from "react-bootstrap";
import Header from "./Header";
import { useSelector } from "react-redux";
import { selectCurrentRoles } from "../features/auth/authSlice";
import ReactMarkdown from "react-markdown";

const Session = () => {

    const { id }:any = useParams();
    const roles = useSelector(selectCurrentRoles);
    const [deleteSession] = useDeleteSessionMutation();
    const navigate = useNavigate();

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

    const handleDelete = (e:any) => {
        e.preventDefault();
        try {
            deleteSession(id);
            navigate(`/course/${course.id}`);
        } catch (e) {
            console.log(e);
        }
    }

    const deletePopover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Are you sure?</Popover.Header>
            <Popover.Body>
            This will <strong>remove permanently</strong> this session and all its exercises. <br /><br />
            <Button onClick={handleDelete} type="submit" size="sm" variant="danger">Delete session</Button>
            </Popover.Body>
        </Popover>
    )

    const teacherActionsContent = () => {
        return roles?.includes(2) ? (
            <div className="d-flex justify-content-end">
                <Button variant="light border" href={"/session/"+course.id+"/edit"}>Edit</Button> &nbsp;
                <OverlayTrigger trigger="click" rootClose={true} placement="auto" overlay={deletePopover}>
                    <Button variant="light border border-danger text-danger">Delete</Button>
                </OverlayTrigger>
            </div>
        ) : <></>
    }

    const exerciseListTeacherContent = () => {
        return roles?.includes(2) ? (
            <ListGroup.Item action href={"/exercise/create?session_id="+id}>
                        + Create Session
            </ListGroup.Item>
        ) : (<></>)
    }

    const exerciseListTeacherContentNoSessions = () => {
        return roles?.includes(2) ? (
            <Button variant="light mb-3 border" href={"/exercise/create?session_id="+id}>
                + Create session
            </Button>
        ) : (<></>)
    }

    const exercisesContent = () => {
        if (exercisesIsLoading) {
            return (
                <p>Loading sessions...</p>
            )
        }
        else if (exercisesIsSuccess && exercises.length === 0) {
            return (
                <ListGroup>
                    <ListGroup.Item className="text-muted text-center dashed-border">
                        <br />
                        <p>This course doesn't have any sessions.</p>
                        {exerciseListTeacherContentNoSessions()}
                    </ListGroup.Item>
                </ListGroup>
            )
        }
        else if (exercisesIsSuccess) {
            return (
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
                {exerciseListTeacherContent()}
                </ListGroup>
            )
        }
    }

    if(exercisesIsError || sessionIsError) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <h3>The session you are looking for doesn't exist, <br />or you aren't allowed to access it.<br/><a href="/course" className='text-decoration-none'>⬅ Back to courses</a></h3>
            </div>
        )
    }

    return sessionIsLoading || exercisesIsLoading  ? (
        <></>
    ) : (
        <>
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

                <br />

                {teacherActionsContent()}

                <h1>{session.title}</h1>
                <blockquote className="border rounded p-3">
                    <ReactMarkdown
                        children={session.description}
                        className="markdown"
                    />
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
        </>
    )
}

export default Session