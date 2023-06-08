import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {

	const navigate = useNavigate();

	const handleBack = () => {
		navigate(-1)
	}
	return (<>
		<div className="d-flex align-items-center justify-content-center vh-100 bg-light">
			<h1 className="display-1 fw-bold"><Button onClick={handleBack} className='btn-light h1 border' size="lg">⟵</Button> 404</h1>
		</div>
	</>)
}

export default NotFound