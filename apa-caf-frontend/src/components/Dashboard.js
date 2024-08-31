import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div>
            <nav>
                <Link to="/fund-request">Fund Request Form</Link>
                <Link to="/pending-requests">Pending Requests</Link>
                <Link to="/approved-requests">Approved Requests</Link>
                <Link to="/rejected-requests">Rejected Requests</Link>
                <Link to="/completed-requests">Completed Requests</Link>
            </nav>
            <h1>Dashboard</h1>
            {/* Render user requests here based on their status */}
        </div>
    );
}

export default Dashboard;
