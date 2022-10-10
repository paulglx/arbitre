import Home from './components/Home';
import Layout from './components/Layout';
import Login from './components/Login';
import Missing from './components/Missing';
import Register from './components/Register';
import Unauthorized from './components/Unauthorized';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* Protected routes */}
        <Route path="/" element={<Home />} />

        {/* Catch all */}
        <Route path="*" element={<Missing />} />

      </Route>
    </Routes>
  );
}

export default App;