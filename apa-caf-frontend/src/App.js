import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import FundRequestForm from './components/FundRequestForm';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Login />} /> {/* Default route */}
            </Routes>
        </Router>
    );
}

export default App;
