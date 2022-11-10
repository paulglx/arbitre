import { Link } from "react-router-dom";
import React from "react";
import { useGetUsersQuery } from "../features/users/usersApiSlice";

const Users = () => {

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery({});

    let content:JSX.Element;
    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        content = (
            <section className="users">
                <h1>Users</h1>

                <ul>
                    {users.map((user:any, i:number) => {
                        return <li key={i}>{user.username}</li>
                    })}
                </ul>
                <Link to="/welcome">Back to Welcome page</Link>
            </section>
        );
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    } else {
        content = <p>Query error</p>
    }

    return content;

}

export default Users