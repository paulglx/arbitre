import React from "react";
import { Routes, Route } from "react-router-dom";
import Course from "./components/Course";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Users from "./components/Users";
import Public from "./components/Public";
import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";
import Session from "./components/Session";
import Welcome from "./components/Welcome";
import Exercise from "./components/Exercise";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>

				{/* Public routes */}
				<Route index element={<Public/>} />
				<Route path="login" element={<Login/>} />
				<Route path="register" element={<Register/>} />
				<Route path="exercise/:id" element={<Exercise/>} />
				<Route path="session/:id" element={<Session/>} />
				<Route path="course/:id" element={<Course/>} />

				{/* Protected routes */}
				<Route element={<RequireAuth/>}>
					<Route path="welcome" element={<Welcome/>} />
					<Route path="users" element={<Users/>} />
				</Route>

			</Route>
		</Routes>
	);
}

export default App;
