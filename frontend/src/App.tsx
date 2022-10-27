import { Routes, Route } from "react-router-dom";
import Course from "./components/Course";
import Courses from "./components/Courses";
import CreateCourse from "./components/CreateCourse";
import CreateSession from "./components/CreateSession";
import Exercise from "./components/Exercise";
import Layout from "./components/Layout";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Public from "./components/Public";
import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";
import Session from "./components/Session";
import TestResult from "./components/TestResult";
import Users from "./components/Users";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>

				{/* Public routes */}
				<Route index element={<Public/>} />
				<Route path="login" element={<Login/>} />
				<Route path="register" element={<Register/>} />

				{/* Protected routes */}
				<Route element={<RequireAuth/>}>
					<Route path="users" element={<Users/>} />

					<Route path="course/" element={<Courses />} />
					<Route path="course/create" element={<CreateCourse/>} />
					<Route path="course/:id" element={<Course/>} />

					<Route path="session/:id" element={<Session/>} />
					<Route path="session/create" element={<CreateSession/>} />

					<Route path="exercise/:exercise_id" element={<Exercise/>} />
					<Route path="exercise/:exercise_id/results" element={<TestResult/>} />
				</Route>

				{/* 404 page when no routes match*/}
				<Route path="*" element={<NotFound />} />

			</Route>
		</Routes>
	);
}

export default App;
