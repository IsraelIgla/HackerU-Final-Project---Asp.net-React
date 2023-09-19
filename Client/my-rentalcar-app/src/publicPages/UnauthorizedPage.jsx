import React from 'react';
import { Link } from 'react-router-dom';
const UnauthorizedPage = () => {
    return <div>
        <p style={{ textAlign: "center" }}>
            <Link to="/Home">Go to Home </Link>
        </p>
    </div>
}

export default UnauthorizedPage;