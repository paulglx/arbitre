import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';

const Home = () => {

  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <div>
        <h1>Home</h1>
        <Link to="/users">Users</Link>
        <br />
    </div>
  )
}

export default Home;