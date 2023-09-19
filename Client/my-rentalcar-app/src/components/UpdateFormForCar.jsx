import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getAPI, checkError } from './Utilities'
import { RentalCarWebAPI_URL } from "../utils/settings";
import axios from "axios";
import { RiDeleteBin5Line } from 'react-icons/ri';
import { IoMdSave } from 'react-icons/io';
import { GiCancel } from 'react-icons/gi';

const currentYear = new Date().getFullYear();
const minYear = 2000
const UpdateFormForCar = ({ mode, args }) => {
    let buttons, title, startState, onSubmit;
    const dictInputNameErrorKey = {
        "carModelId": "carModelError",
        "carImage": "imageError"
    }

    function checkModelChosen() {
        return checkError(setError, "carModelError", inputs.carModelId > 0,
            `${String.fromCharCode(0x26A0)} Choose a model`)
    }

    function checkImage(mode) {
        var valid = true
        var message = ""
        if (mode == "add") {
            if (!inputs.carImage) {
                valid = false;
                message = "Choose an image"
            }
        }
        if (inputs.carImage && inputs.carImage.name.length > 32) {
            valid = false;
            message = "The maximum allowed file name length is 32 characters"
        }
        else if (inputs.carImage && inputs.carImage.size > 1 * 1000 * 1024) {
            valid = false;
            message = "File size must not exceed 1MB"
        }
        return checkError(setError, "imageError", valid,
            `${String.fromCharCode(0x26A0)} ${message}`)
    }

    function getFormData(action) {
     
        const formData = new FormData();
        formData.append("id", action == "add" ? 0 : inputs.id);
        formData.append("modelid", inputs.carModelId);
        formData.append("priceperday", inputs.pricePerDay);
        formData.append("year", inputs.year);
        formData.append("image", inputs.carImage);
        formData.append("imagename", "noname");
        formData.append("imagedata", "nodata");
        return formData;
    }

    var addCar = async (e) => {
        e.preventDefault();
        let validationResults = [checkModelChosen()]
        validationResults.push(checkImage("add"))
        if (validationResults.some(r => r == false)) return;
        console.log("addCar", inputs)
        const formData = getFormData("add");
        try {
            const response = await axios({
                method: "post",
                url: `${RentalCarWebAPI_URL}/cars/withImage`,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            args.onSave();
        } catch (error) {
            if (error.response) {
                console.log(error.response.data)
                if (Array.isArray(error.response.data) && error.response.data[0] === "imageError")
                    setError(values => ({ ...values, ["imageError"]: error.response.data[1] }))
            }
        }
    }

    if (mode === "add") { //add mode
        const navigateTo = useNavigate();
        const goToList = () => {
            navigateTo("/CarList")
        }
        title = <h1>ADD NEW CAR</h1>;
        buttons = <div><input type="submit" title="Add" id="addButton" value="+" />
            <button type="button" title="Cancel" id="closeButton" onClick={goToList}><b>&times;</b></button></div>;
        startState = { carModelId: 0, year: minYear, pricePerDay: 100 };
        onSubmit = addCar;
    } else {  //edit mode
        title = <h1 className="editCar"> EDIT CAR</h1>;
        let { theCar, onSave, onClose, onDelete } = args;
        var deleteCar = async () => {
            try {
                const response = await axios({
                    method: "delete",
                    url: `${RentalCarWebAPI_URL}/cars/${theCar.car.id}`,
                });
                onClose();
                onDelete();
            } catch (error) {
                if (error.response) {
                    console.log(error.response.data)
                }
            }
        }

        startState = {
            id: theCar.car.id, carCompanyNameId: theCar.carCompanyName.id,
            carModelId: theCar.carModel.id, year: theCar.car.year, pricePerDay: theCar.car.pricePerDay
        };

        onSubmit = async (e) => {
            e.preventDefault();
            if (!checkImage("edit")) return;
            const formData = getFormData("edit");
            try {
                const response = await axios({
                    method: "put",
                    url: `${RentalCarWebAPI_URL}/cars/withImage`,
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" },
                });
                onClose();
                onSave();
            } catch (error) {
                if (error.response) {
                    if (Array.isArray(error.response.data) && error.response.data[0] === "imageError")
                        setError(values => ({ ...values, ["imageError"]: error.response.data[1] }))
                }
            }
        }

        buttons =
            <div>
                <IoMdSave size="4vmin" title="Save" id="saveButton" onClick={onSubmit} />
                <GiCancel size="4vmin" title="Cancel" id="cancelButton" onClick={onClose} />
                <RiDeleteBin5Line size="4vmin" title="Delete" id="deleteButton" onClick={deleteCar} />
            </div>
    }

    const [inputs, setInputs] = useState(startState);
    const [carCompanyNames, setCarCompanyNames] = useState([]);
    const [carModels, setCarModels] = useState([]);
    const [error, setError] = useState({ imageError: null, carModelError: null });



    useEffect(() => {
        getAllCarCompanyNames()
    }, []);

    useEffect(() => {
        getCarModelsByCarCompanyNameID()
    }, [inputs.carCompanyNameId])

    const handleChange = (event) => {
        const name = event.target.name;
        const value = name == "carImage" ? event.target.files[0] : event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
        setError(values => ({ ...values, [dictInputNameErrorKey[name]]: "" }))
    }

    const getAllCarCompanyNames = () => getAPI("carCompanyNames").then((res) => {
        if (res.status === 200) {
            setCarCompanyNames(res.data)
        } else {
            console.log(res)
        }
    })

    const getCarModelsByCarCompanyNameID = () => getAPI(`carModels/${inputs.carCompanyNameId || "0"}`).then((res) => {
        if (res.status === 200) {
            setCarModels(res.data)
            if (mode == "add")
                setInputs(values => ({ ...values, ["carModelId"]: 0 }))
            else
                setInputs(values => ({ ...values, ["carModelId"]: res.data[0].id }))
        } else {
            console.log(res)
        }
    })

    return (
        <div>
            {title}
            <form onSubmit={onSubmit}>
                <input
                    type="hidden"
                    name="id"
                    value={inputs.id || 0} />
                <table id="updateFormTable">
                    <tbody>
                        <tr>
                            <td><label>Make <span className="must">*</span></label></td>
                            <td>
                                <select
                                    name="carCompanyNameId"
                                    required
                                    value={inputs.carCompanyNameId || 0}
                                    onChange={handleChange}>
                                    {mode === "add" ? <option value="0" key="0">Select...</option> : ''}
                                    {carCompanyNames.map(carCompanyName => <option value={carCompanyName.id}
                                        key={carCompanyName.id}>{carCompanyName.name}</option>)}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            
                            <td><label>Model <span className="must">*</span></label></td>
                            <td>
                                <select
                                    name="carModelId"
                                    required
                                    value={inputs.carModelId || 0}
                                    onChange={handleChange}>
                                    {mode === "add" ? <option value="0" key="0">Select...</option> : ''}
                                    {carModels.map(carModel => <option value={carModel.id} key={carModel.id}>{carModel.name}</option>)}
                                </select>
                                <div className="text-danger">{error.carModelError}</div>
                            </td>
                        </tr>
                        <tr>
                        <td><label>Year <span className="must">*</span></label></td>
                           
                            <td>
                                <input
                                    type="number"
                                    min={minYear}
                                    max={currentYear}
                                    name="year"
                                    required
                                    value={inputs.year || ""}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                        <td><label>Price Per Day <span className="must">*</span></label></td>
                            
                            <td>
                                <input
                                    type="number"
                                    min={100}
                                    name="pricePerDay"
                                    required
                                    value={inputs.pricePerDay}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Image {mode=="edit"?'':<span className="must">*</span>}</label></td>
                            <td>
                                <input
                                    name="carImage"
                                    type="file"
                                    className="form-control"
                                    onChange={handleChange}
                                />
                                <div className="text-danger">{error.imageError}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {buttons}

            </form>
        </div>
    );
}

export default UpdateFormForCar
