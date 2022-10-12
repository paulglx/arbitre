import Home from './components/Home';
import Layout from './components/Layout';
import Login from './components/Login';
import Missing from './components/Missing';
import Register from './components/Register';
import Unauthorized from './components/Unauthorized';
import Users from './components/Users';

import PersistLogin from './components/PersistLogin';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="home" element={<Home />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* Protected routes. Codes : 1=student, 2=prof, 3=admin */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[1,2,3]} />}>
            <Route path="/" element={<Home />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Missing />} />

      </Route>
    </Routes>
  );
}

export default App;