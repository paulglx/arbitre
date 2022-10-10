import Admin from './components/Admin';
import Editor from './components/Editor';
import Home from './components/Home';
import Layout from './components/Layout';
import Login from './components/Login';
import Missing from './components/Missing';
import Register from './components/Register';
import RequireAuth from './components/RequireAuth';
import Unauthorized from './components/Unauthorized';
import Users from './components/Users';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="users" element={<Users />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* Protected routes. Codes : 1=student, 2=prof */}
        <Route element={<RequireAuth allowedRoles={[1,2,3]}/>}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[2,3]}/>}>
          <Route path="editor" element={<Editor />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[3]}/>}>
          <Route path="admin" element={<Admin />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Missing />} />

      </Route>
    </Routes>
  );
}

export default App;