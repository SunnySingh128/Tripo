import {  Routes, Route } from 'react-router-dom';
import Anime from './animations.jsx';
import Home from './homepage.jsx';
import './App.css';
import Rst from './Rest.jsx';
import Hotels from "./hotels.jsx"
import Activ from "./activity.jsx"
import Transp from "./transporation.jsx"
import Signup from './signup.jsx';
import User from "./userdetials.jsx"
import Group from "./group.jsx"
import First from "./firstpage.jsx"
import Profile from "./profile.jsx"
import ProtectedRoute from './protected.jsx';
import { AuthProvider } from './auth.jsx';
import TripoWrap from './tripowrap.jsx';
import Login from './login.jsx';
import Auth from './authe.jsx';
import Custom from "./customizepages.jsx"
function App() {
  return (
        <AuthProvider>
      <Routes>
        <Route path="/" element={<Anime />} />
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/Restaurants" element={<ProtectedRoute><Rst /></ProtectedRoute>} />  
        <Route path="/Hotels" element={<ProtectedRoute><Hotels /></ProtectedRoute>} />
        <Route path="/Transportation" element={<ProtectedRoute><Transp /></ProtectedRoute>} />
        <Route path="/Activities" element={<ProtectedRoute><Activ /></ProtectedRoute>} />
        <Route path="/TripoWrap" element={<ProtectedRoute><TripoWrap /></ProtectedRoute>}/>
        <Route path="/custom" element={<ProtectedRoute><Custom /></ProtectedRoute>} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/User" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/Group" element={<ProtectedRoute><Group /></ProtectedRoute>} />
        <Route path="/First" element={<First />} />
        <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
      </AuthProvider>
  );
}

export default App;

