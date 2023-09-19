import React from 'react';
import { Link } from 'react-router-dom';


const NotFoundPage = () => {
    return <div>
        <div id='notFoundPage_MainDiv'>
            <h1><b>Error 404: Page Not Found</b></h1>
            <p>The page you entered does not exist. If you feel you have received this message in error, </p>
            <p>please try again or contact your travel manager.</p>
            <Link to="/Home"><h2 id="homepageLink">Visit the Homepage</h2></Link>
        </div>
    </div>
}

export default NotFoundPage;