import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';

const Home = () => {

  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate('/')
  } 

  return (
    <div>
        <h1>Home</h1>
        <Link to="/users">Users</Link>
        <br />
        <button onClick={signOut}>
          Sign out
        </button>
    </div>
  )
}

export default Home;