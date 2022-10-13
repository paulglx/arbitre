import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";

const Users = () => {
	const [users, setUsers] = useState();
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();
	const logout = useLogout();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getUsers = async () => {
			try {
				const response = await axiosPrivate.get('api/auth/users', {
					signal: controller.signal
				});
				isMounted && setUsers(response.data); //if isMounter : set users...
			} catch (err) {
				console.error(err);
				navigate('/login', { state: { from: location }, replace: true }) //Back to login with history preservation
			}
		}

		getUsers();

		return () => {
			isMounted = false;
			//controller.abort();
		}
	}, [axiosPrivate, location, navigate])

	const signOut = async () => {
		await logout();
		navigate('/')
	} 

	return (
		<article>
			<h2>Users List</h2>
			{users?.length ? (
				<ul>
					{users.map((user, i) => (
						<li key={i}>{user?.username}</li>
					))}
				</ul>
			) : (
				<p>No users to display</p>
			)}
			<Link to="/home">Home</Link>
			<button onClick={signOut}>
				Sign out
			</button>
		</article>
	);
};

export default Users;
