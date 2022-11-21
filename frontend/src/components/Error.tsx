import { Container, ListGroup } from "react-bootstrap"

import Header from "./Header"

const Error = (props:any) => {

    const isError = props.isError
    const error = props.error ? JSON.parse(props.error) : {}

    const errorExplained = (status:any) => {
        switch (status) {
            case 'FETCH_ERROR':
                return 'There was an error fetching the data from the server. Please try again later.'
            case 'PARSING_ERROR':
                return 'There was an error parsing the data from the server. The database might be corrupted.'
            default:
                return 'There was an unknown error.'
        }
    }

    return isError && error ? (<>

        <Header />

        <Container className="d-flex align-items-center min-vh-100">
            <Container className=" w-75 p-3">
                <ListGroup>
                    <ListGroup.Item variant="danger d-flex justify-content-between">
                        <span className="fw-bold">Error</span>
                        <span className="text-muted text-end">{error.status}</span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <span>{errorExplained(error.status)}</span>
                        <br />
                        <span className="text-muted">{error.error}</span>
                    </ListGroup.Item>
                </ListGroup>
            </Container>
        </Container>
        </>) : (<></>)
}

export default Error