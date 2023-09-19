import { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import { Keys, getItem } from "../utils/storage";
import logo from "../assets/images/logo.png";
import Footer from './Footer';
import LoginPopup from './LoginPopup';
import 'reactjs-popup/dist/index.css';
import AuthContext from "../contexts/LoginContext/AuthContext";
import {getValueFromDictionary} from "./Utilities";

const Layout = () => {
    let { isLoggedIn, roleID, login, logout } = useContext(AuthContext);
    let firstName = getItem(Keys.firstName);
    let lastName = getItem(Keys.lastName);
    // let fullName = `${getItem(Keys.firstName)} ${getItem(Keys.lastName)}`;

    function getUserInfo() {
        let marginTop = "4vmin"
        return <>
            <span style={{ fontSize: "1.5vmin", margin: "auto", marginTop: `${marginTop}` }}>
                {`Hello, ${firstName} ${lastName}`}
            </span>

        </>
    }

    return (

        <div className="fill-window">
        <div className="mainDiv">
            <AuthContext.Provider value={{ isLoggedIn, roleID, login, logout }}>
                <div className="topContainer">
                    <div className="logo">
                        <img src={logo} alt="logo" />
                        <h1>{getValueFromDictionary('businessName')} </h1>
                    </div>
                    {isLoggedIn && getUserInfo()}
                    <LoginPopup />
                </div>

                <div className="topnav">
                    <Link to="/Home">Home</Link>
                    {getGuardedLinks()}
                    {(!isLoggedIn || roleID != 1) && <Link to="/Reservation">Reservation</Link>}
                    <Link to="/AboutUs">About Us</Link>
                </div>

                <div className="outletcontainer">
                    <Outlet />
                </div>
                <Footer />
            </AuthContext.Provider>
        </div></div> 
    )

    function getGuardedLinks() {
        if (isLoggedIn) {
            return <>
                {roleID == 1 ? <>
                    <Link to="/OrderList">All Orders</Link></> : ''}
            </>
        } else {
            return "";
        }
    }
};

export default Layout;