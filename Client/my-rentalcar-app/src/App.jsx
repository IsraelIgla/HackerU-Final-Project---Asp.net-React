import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./publicPages/Home";
import CarList from "./publicPages/CarList";
import AboutUs from "./publicPages/AboutUs";
import AddCar from "./publicPages/AddCar";
import Layout from "./components/Layout";
import TermsOfUse from "./publicPages/TermsOfUse";
import Registration from "./publicPages/Registration";
import Reservation from "./publicPages/Reservation";
import OrderList from "./publicPages/OrderList";
import OrderReview from "./publicPages/OrderReview";
import NotFoundPage from "./publicPages/NotFoundPage";
import UnauthorizedPage from "./publicPages/UnauthorizedPage";
import { Keys, getItem, setLoginData, removeLoginData } from "./utils/storage";
import AuthContext from "./contexts/LoginContext/AuthContext";
import { RentalCarWebAPI_URL } from "./utils/settings";
import axios from "axios";
import { ProtectedRoute } from "./navigation/ProtectedRoute";
import './App.css';
import CookiePolicy from "./publicPages/CookiePolicy";
import PrivacyPolicy from "./publicPages/PrivacyPolicy";




function App() {
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [roleID, setRoleID] = useState(0);
  let timerID = useRef();

  useEffect(() => {
    //create a loop that refresh the tokens only if there is refreshToken
    if (getItem(Keys.refreshToken) && isNaN(timerID)) {
      setRefreshTokenInterval();
      refreshToken();
    }
  }, []);
  //
  function setRefreshTokenInterval() {
    if (isNaN(timerID)) {
      let expiresInSeconds = getItem(Keys.expiresInSeconds);
      let refreshInterval = expiresInSeconds
        ? Number(expiresInSeconds) / 2
        : 30;
      timerID = setInterval(refreshToken, refreshInterval * 1000);
    }
  }
  //
  function refreshToken() {
    axios
      .post(RentalCarWebAPI_URL + "/users/refreshToken", {
        refreshToken: getItem(Keys.refreshToken),
      })
      .then((response) => {
        login(response.data);
      })
      .catch((error) => {
        logout();
      });
  }
  function login(loginData) {
    setLoginData(loginData.userResponse, loginData.tokensData);
    setRefreshTokenInterval();
    setRoleID(loginData.userResponse[Keys.roleID]);
    setIsLoggedIn(true);
  }
  //
  function logout() {
    clearTimeout(timerID);
    removeLoginData();
    setRoleID(0);
    setIsLoggedIn(false);
  }


  return (
    <AuthContext.Provider value={{ isLoggedIn, roleID, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CarList />} />
            <Route path="Home" element={<Home />} />
            <Route path="AboutUs" element={<AboutUs />} />
            <Route path="Registration" element={<Registration />} />
            <Route path="Reservation" element={<Reservation />} />
            <Route path="OrderList" element={
              <ProtectedRoute>
                <OrderList />
              </ProtectedRoute>} />
            <Route path="OrderReview" element={<ProtectedRoute>
              <OrderReview />
            </ProtectedRoute>} />

            <Route
              path="CarList"
              element={<CarList />}
            />
            <Route
              path="AddCar"
              element={
                <ProtectedRoute>
                  <AddCar />
                </ProtectedRoute>
              }
            />
            <Route
              path="TermsOfUse"
              element={
                // <ProtectedRoute>
                  <TermsOfUse />
                // </ProtectedRoute>
              }
            />
            <Route
              path="CookiePolicy"
              element={
                // <ProtectedRoute>
                  <CookiePolicy />
                // </ProtectedRoute>
              }
            />
            <Route
              path="PrivacyPolicy"
              element={
                // <ProtectedRoute>
                  <PrivacyPolicy />
                // </ProtectedRoute>
              }
            />




            <Route path="Unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );

}

export default App
