import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [empcode, setEmpcode] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [territory, setTerritory] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/signup', { email, empcode, name, password, territory });
            navigate('/login');
        } catch (error) {
            console.error("Error signing up", error);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Empcode" 
                    value={empcode}
                    onChange={(e) => setEmpcode(e.target.value)}
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Territory" 
                    value={territory}
                    onChange={(e) => setTerritory(e.target.value)}
                    required 
                />
                <button type="submit">Sign Up</button>
            </form>
            <button onClick={() => navigate('/login')}>Login</button>
        </div>
    );
}

export default Signup;
