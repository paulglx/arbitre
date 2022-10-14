import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Users from "./components/Users";
import Public from "./components/Public";
import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";
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

				{/* Protected routes */}
				<Route element={<RequireAuth/>}>
					<Route path="welcome" element={<Welcome/>} />
					<Route path="users" element={<Users/>} />
					<Route path="exercise/:id" element={<Exercise/>} />
				</Route>

			</Route>
		</Routes>
	);
}

export default App;
