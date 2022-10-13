import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Public from "./components/Public";
import RequireAuth from "./components/RequireAuth";
import Welcome from "./components/Welcome";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>

				{/* Public routes */}
				<Route index element={<Public/>} />
				<Route path="login" element={<Login/>} />

				{/* Protected routes */}
				<Route element={<RequireAuth/>}>
					<Route path="welcome" element={<Welcome/>} />
				</Route>

			</Route>
		</Routes>
	);
}

export default App;
