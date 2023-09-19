import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RentalCarWebAPI_URL } from "../utils/settings";
import { validateEmail, validatePassword, checkError } from '../components/Utilities'
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import {getValueFromDictionary} from "../components/Utilities";

const Registration = () => {
    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");
    let [userName, setUserName] = useState("");
    let [password, setPassword] = useState("");
    let [mail, setMail] = useState("");
    let [confirmMail, setConfirmMail] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");
    let [image, setImage] = useState("");
    let [error, setError] = useState({
        firstNameError: null,
        lastNameError: null,
        emailError: null,
        confirmEmailError: null,
        userNameError: null,
        passwordError: null,
        confirmPasswordError: null,
        imageError: null
    })
    const navigate = useNavigate();

    useEffect(() => {
        setError(values => ({ ...values, ["emailError"]: "" }))
    }, [mail])

    useEffect(() => {
        setError(values => ({ ...values, ["confirmEmailError"]: "" }))
    }, [confirmMail, mail])

    useEffect(() => {
        setError(values => ({ ...values, ["passwordError"]: "" }))
    }, [password])

    useEffect(() => {
        setError(values => ({ ...values, ["confirmPasswordError"]: "" }))
    }, [confirmPassword, password])

    const handleChange = (value, fieldName) => {
        const result = value.replace(/[^a-z]/gi, '');
        if (fieldName == "firstName")
            setFirstName(result)
        if (fieldName == "lastName")
            setLastName(result)
    };

    function CheckMailIsValid(includeEmpty) {
        let message = validateEmail(mail);
        return checkError(setError, "emailError", (includeEmpty && !mail) || !message,
            `${String.fromCharCode(0x26A0)} ${message}`)
    }

    function CheckEmailAddressMatch() {
        return checkError(setError, "confirmEmailError", mail == confirmMail,
            `${String.fromCharCode(0x26A0)} Email Address does not match`)
    }

    function CheckPasswordIsValid(includeEmpty) {
        let message = validatePassword(password);
        return checkError(setError, "passwordError", (includeEmpty && !password) || !message,
            `${String.fromCharCode(0x26A0)} ${message}`)
    }

    function CheckPasswordMatch() {
        return checkError(setError, "confirmPasswordError", password == confirmPassword,
            `${String.fromCharCode(0x26A0)} Password does not match`)
    }

    function setBasicValidity(e, message) {
        e.target.setCustomValidity(e.target.value ? '' : message)
    }

    async function save(e) {
        e.preventDefault();
        let validationResults = [CheckMailIsValid()];
        validationResults.push(CheckEmailAddressMatch())
        validationResults.push(CheckPasswordIsValid())
        validationResults.push(CheckPasswordMatch())
        if (validationResults.some(r => r == false)) return;
        const formData = new FormData();
        formData.append("firstname", firstName);
        formData.append("lastname", lastName);
        formData.append("username", userName);
        formData.append("password", password);
        formData.append("email", mail);
        formData.append("image", image);
        formData.append("imagename", "image");
        formData.append("imagedata", "image");
        try {
            const response = await axios({
                method: "post",
                url: `${RentalCarWebAPI_URL}/users/withImage`,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("You have been successfully registered..."), {
                position: toast.POSITION.TOP_CENTER

            };
            navigate("/CarList");
        } catch (error) {
            var data = error.response.data
            if (Array.isArray(data)) {
                if (data[0] == "email") {
                    toast.error(data[1], {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                }
                else if (data[0] == "username") {
                    toast.error(data[1], {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                }
                if (data[0] == "imageError") {
                    console.log("imageError")
                    toast.error(data[1], {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                }

            }
            setError(error.response.data);
        }
    }

    function getRegistrationMainTitles() {
        return <>
            <div className="regMainTitle1">
                <h1>Create Your {getValueFromDictionary('businessName')} Plus Account</h1>
            </div>
            <div className="regMainTitle2">
                <p>  Required to complete your enrollment *</p>

            </div>
            <hr />
        </>
    }

    return (
        <>
            <ToastContainer
                autoClose={2000}
                rtl={false}
            />
            {getRegistrationMainTitles()}

            <form className="registerForm" onSubmit={save} method="post" encType="multipart/form-data">
                <div className="doubleInputContainer left">
                    <label>First Name <span className="must">*</span></label><br />
                    <input
                        type="text"
                        placeholder="Minimum 2 letters"
                        minLength={2}
                        required
                        value={firstName}
                        onInvalid={e => setBasicValidity(e, 'Enter First Name Here')}
                        onInput={e => e.target.setCustomValidity('')}
                        onChange={(e) => handleChange(e.target.value, "firstName")}
                    />
                    <span className="text-danger">{error.firstNameError}</span>
                </div>
                <div className="doubleInputContainer">
                    <label>Last Name<span className="must">*</span></label><br />
                    <input
                        type="text"
                        placeholder="Minimum 2 letters"
                        required
                        minLength={2}
                        value={lastName}
                        onInvalid={e => setBasicValidity(e, 'Enter Last Name Here')}
                        onInput={e => e.target.setCustomValidity('')}
                        onChange={(e) => handleChange(e.target.value, "lastName")}
                    />
                    <span className="text-danger">{error.lastNameError}</span>
                </div><br />
                <div className="singleInputContainer">
                    <label >Email Address <span className="must">*</span></label><br />
                    <input
                        type="email"
                        placeholder="e.g user@gmail.com"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                    />
                    <div className="text-danger">{error.emailError}</div>
                </div><br />
                <div className="singleInputContainer">
                    <label >Confirm Email Address <span className="must">*</span></label><br />
                    <input
                        type="email"
                        placeholder="e.g user@gmail.com"
                        value={confirmMail}
                        onChange={(e) => setConfirmMail(e.target.value)}
                    />
                    <div className="text-danger">{error.confirmEmailError}</div>
                </div><br />
                <div className="singleInputContainer">
                    <label >User Name <span className="must">*</span></label><br />
                    <input
                        type="text"
                        autoComplete="new-password"
                        placeholder="Minimum 2 letters"
                        required
                        minLength={2}
                        onInvalid={e => setBasicValidity(e, 'Enter User Name Here')}
                        onInput={e => e.target.setCustomValidity('')}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <span className="text-danger">{error.userNameError}</span>
                </div><br />
                <div className="singleInputContainer">
                    <label>Password <span className="must">*</span></label><br />
                    <input
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="text-danger">{error.passwordError}</span>
                </div>

                <div className="singleInputContainer passwordInfo">
                    <ul>
                        <li>Must be at least 8 characters</li>
                        <li>Must contain a letter</li>
                        <li>Must contain a number</li>
                    </ul>
                </div>

                <div className="singleInputContainer">
                    <label>Confirm Password <span className="must">*</span></label><br />
                    <input
                        type="password"
                        autoComplete="off"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span className="text-danger">{error.confirmPasswordError}</span>
                </div><br />

                <div className="singleInputContainer">
                    <label>Upload Profile Picture <span className="must">*</span></label><br />
                    <input
                        type="file"
                        required
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <span className="text-danger">{error.imageError}</span>
                </div>

                <button type="submit" className="singleInputContainer btnSave">
                    Save
                </button>

            </form>

        </>
    )
}

export default Registration;

