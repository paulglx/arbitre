import { Route, Routes } from "react-router-dom";

import Course from "./components/Course";
import Courses from "./components/Courses";
import CreateCourse from "./components/CreateCourse";
import CreateExercise from "./components/CreateExercise";
import CreateSession from "./components/CreateSession";
import Exercise from "./components/Exercise";
import JoinCourse from "./components/JoinCourse";
import Layout from "./components/Layout";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Notification from "./components/Notification";
import Public from "./components/Public";
import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";
import Results from "./components/Results";
import Session from "./components/Session";
import Users from "./components/Users";

function App() {
	return (<>

		<Notification />

		<Routes>

			<Route path="/" element={<Layout />}>

				{/* Public routes */}
				<Route index element={<Public />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />

				{/* Protected routes */}
				<Route element={<RequireAuth />}>
					<Route path="users" element={<Users />} />

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

					<Route path="results" element={<Results />} />
				</Route>

				{/* 404 page when no routes match*/}
				<Route path="*" element={<NotFound />} />

			</Route>
		</Routes>
	</>);
}

export default App;
