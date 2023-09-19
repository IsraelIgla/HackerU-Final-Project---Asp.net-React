import { useContext, useState } from "react";
import AuthContext from "../contexts/LoginContext/AuthContext";
import React from 'react';
import 'reactjs-popup/dist/index.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RentalCarWebAPI_URL } from "../utils/settings";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validatePassword } from '../components/Utilities'
import { usePopup } from "../contexts/PopupContext/PopupContext";
import logo from "../assets/images/logo.png";
import {getValueFromDictionary} from "../components/Utilities";


const LoginPopup = () => {
  let [errorMessage, setErrorMessage] = useState("");
  let [enteredUserName, setEnteredUserName] = useState("");
  let [enteredPassword, setEnteredPassword] = useState("");
  let { isLoggedIn, roleId, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function onJoinNowClick() {
    onPopupClose()
  }

  function onPopupClose() {
    setErrorMessage("")
    setEnteredUserName("")
    setEnteredPassword("")
    closePopup()
  }

  function onChangeUserName(e) {
    setEnteredUserName(e.target.value)
    setErrorMessage("")
  }

  function onChangePassword(e) {
    setEnteredPassword(e.target.value)
    setErrorMessage("")
  }

  function setErrorAndToastify(message) {
    setErrorMessage(message);
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER
    });
  }

  function requestLogin() {
    return axios
      .post(RentalCarWebAPI_URL + "/users/login", {
        firstname: "a",
        lastname: "a",
        username: enteredUserName,
        password: enteredPassword,
        email: "a@a",
        imagename: "a",
        imagedata: "a"
      })
  }

  function onLogin() {
    let message = validatePassword(enteredPassword);
    if (message) {

      setErrorMessage(message == 'Required' ? 'Password required *' : "Invalid user name or password  \r\n please try again.");
      return;
    }

    if (enteredUserName) {
      requestLogin().then((response) => {
        if (response.data) {

          login(response.data);

          toast.success(`Welcome Back ${response.data.userResponse.firstName} ${response.data.userResponse.lastName}`, {
            position: toast.POSITION.TOP_CENTER, draggable: false
          });
          //toast.error(error.message, { draggable: false });
          onPopupClose()
          var userId = response.data.userResponse.userId
          roleId == 1 ? navigate("/CarList") : (roleId > 1 ? navigate("/Reservation") : '');
        } else throw Error("No response.data");
      })
        .catch((error) => {

          if (error.code == "ERR_NETWORK") {
            setErrorAndToastify(`Server is unavailable. \n Please contact your support.`)
            return;
          }

          if (error.response) {
            if (error.response.data)
              setErrorAndToastify(error.response.data)
            else
              setErrorAndToastify("Something went wrong. \n  Please contact your support.")
          }
        });
    } else {
      setErrorAndToastify('Must enter a User Name')
    }
  }

  function getToastContainer() {
    return <ToastContainer
      autoClose={1000}
      rtl={false}
    />
  }
  const [popupOpen, setPopupOpen] = useState(false)

  function getSignInUI() {
    return (<div className="popupLoginFrame"

      onClose={onPopupClose}>
      <div className="arrow-up"></div>
      <div className='popup-wrapper'>

        <div className="grid-container">
          <div className="item1 itemLeftBordered"><p><strong>Not a member yet?</strong></p></div>
          <div className="item2"><p><strong>Sign In to {getValueFromDictionary('businessName')}</strong></p></div>

          <div className="item3 itemLeftBordered"><div className="popUplogo"><img src={logo} alt="logo" /></div></div>

          <div className="item4"><input
            type="text"
            autoComplete="off"
            placeholder="User Name"
            name="username"
            value={enteredUserName}
            onChange={onChangeUserName}>
          </input></div>

       
          <div className="item6"><input
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            name="password"
            value={enteredPassword}
            onChange={onChangePassword}>
          </input>
            {errorMessage ? (
              <div className="text-danger new-line">{errorMessage}</div>
            ) : (
              ""
            )}</div>

          <div className="item7 itemLeftBordered"><div className='popoutButton joinNow'>
            <Link to="Registration" onClick={onJoinNowClick}>Join now</Link>
          </div></div>
          <div className="item8">
            <button variant="primary" className='popoutButton continue' type="button" onClick={onLogin}>
              Sign in
            </button>
          </div>
        </div>

      </div>

    </div>)
  }

  function onSignOut(e) {
    logout(e)
    navigate("/Home")
  }

  function getSignOutUI() {
    return <button className='signInOut' onClick={onSignOut}>SIGN OUT</button>
  }

  const { isPopupOpen, closePopup, openPopup } = usePopup()

  return (<>{getToastContainer()}
    {(isLoggedIn ? getSignOutUI() :
      <>
        <button className="signInOut" style={{ marginLeft: 'auto', zIndex: 9999 }} onClick={() => {
          isPopupOpen ? onPopupClose() : openPopup()
        }}>{isLoggedIn ? "Sign out" : "Join / Sign in"}</button>
        {isPopupOpen && getSignInUI()}
      </>)}

  </>)
};

export default LoginPopup;
