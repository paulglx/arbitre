import { Route, Routes } from "react-router-dom";

import Course from "./components/Course/Course";
import Courses from "./components/Course/Courses";
import CreateCourse from "./components/Course/CreateCourse";
import CreateExercise from "./components/Exercise/CreateExercise";
import CreateSession from "./components/Session/CreateSession";
import Dashboard from "./components/Dashboard/Dashboard";
import Exercise from "./components/Exercise/Exercise";
import JoinCourse from "./components/Course/JoinCourse";
import Layout from "./components/Util/Layout";
import NotFound from "./components/Util/NotFound";
import Notification from "./components/Util/Notification";
import Public from "./components/Landing/Public";
import RequireAuth from "./components/Util/Auth/RequireAuth";
import Session from "./components/Session/Session";

function App() {

	return (<>

		<Notification />

		<Routes>

			<Route path="/" element={<Layout />}>

				{/* Public routes */}
				<Route index element={<Public />} />

				{/* Protected routes */}
				<Route element={<RequireAuth />}>
					<Route path="course/" element={<Courses />} />
					<Route path="course/create" element={<CreateCourse />} />
					<Route path="course/:id" element={<Course />} />

					<Route path="course/join" element={<JoinCourse />} />
					<Route path="course/join/:join_code" element={<JoinCourse />} />

					<Route path="session/:session_id" element={<Session />} />
					<Route path="session/:session_id/:tab" element={<Session />} />
					<Route path="session/create" element={<CreateSession />} />

					<Route path="exercise/:exercise_id/" element={<Exercise />} />
					<Route path="exercise/:exercise_id/:tab" element={<Exercise />} />
					<Route path="exercise/create" element={<CreateExercise />} />

					<Route path="dashboard" element={<Dashboard />} />
				</Route>

				{/* 404 page when no routes match*/}
				<Route path="*" element={<NotFound />} />

			</Route>
		</Routes>
	</>);
}

export default App;
