import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Header from "../Common/Header";
import { useNavigate } from "react-router-dom";

const NotFound = () => {

	const navigate = useNavigate();

	return (<>
		<div className="bg-white flex items-center justify-center h-screen w-screen">
			<div>
				<span className="text-sm font-medium text-blue-600 border border-blue-200 p-1 py-0.5 rounded-md bg-blue-50">404 error</span>
				<h1 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Page not found</h1>
				<p className="mt-2 text-gray-500 dark:text-gray-400">Sorry, the page you are looking for doesn't exist or has been moved.</p>

				<div className="flex items-center mt-6 gap-x-3">
					<button
						className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-gray-50 border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100"
						onClick={() => navigate(-1)}
					>
						<ArrowLeftIcon className="w-5 h-5" aria-hidden="true" />
						<span>Go back</span>
					</button>
				</div>
			</div>
		</div>
	</>)
}

export default NotFound