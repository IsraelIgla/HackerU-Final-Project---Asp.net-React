import { useState, useEffect } from "react";
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { getAPI } from '../components/Utilities'
import { checkError } from '../components/Utilities'
import { MuiAutocomplete } from '../components/MuiAutocomplete'
import { MuiDateRangePicker } from '../components/MuiDateRangePicker'
import { formatDate, locationToString } from '../components/Utilities'
import background from "../assets/images/rentalCar.jpg"
import { Grid } from '@mui/material'

const Reservation = () => {
    const [locations, setLocations] = useState(null);
    const [location, setLocation] = useState({});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const navigate = useNavigate();

    const today = new Date();

    let [error, setError] = useState({
        pickupLocationError: null,
        pickupDateError: null,
        returnDateError: null,
    })

    useEffect(() => {

        getLocations()
    }, []);

    useEffect(() => {
        setError(values => ({ ...values, ["pickupLocationError"]: "" }))
    }, [location])

    const getLocations = () => getAPI(`locations?searchText=${""}`).then((res) => {
        if (res.status === 200) {
            setLocations(res.data)
        } else {
            console.log(res)
        }
    })

    function onChangeStartDate(value) {
        setStartDate(value)
        setError(values => ({ ...values, ["pickupDateError"]: "" }))
    }
    function onChangeEndDate(value) {
        setEndDate(value)
        setError(function (values) {
            return ({ ...values, ["returnDateError"]: "" });
        })
    }

    function locationValidation() {
        return checkError(setError, "pickupLocationError", location.id,
            `${String.fromCharCode(0x26A0)} Must fill out pickup location`)
    }

    function startDateValidation() {
        var goodStartDate = startDate && startDate?.getDate() >= today.getDate()
        return checkError(setError, "pickupDateError", goodStartDate,
            `${String.fromCharCode(0x26A0)} Pickup Date can't be in the past`)
    }

    function returnDateValidation() {
        return checkError(setError, "returnDateError", endDate > startDate,
            `${String.fromCharCode(0x26A0)} Return date must be later than pickup date`)
    }

    async function browseCars(e) {
        e.preventDefault();

        let validationResults = [locationValidation()];
        validationResults.push(startDateValidation());
        validationResults.push(returnDateValidation());

        if (validationResults.some(r => r == false)) return;

        let formattedStartDate = formatDate(startDate, "yyyy-m-d")
        let formattedEndDate = formatDate(endDate, "yyyy-m-d")

        navigate('/CarList', {
            state: {
                location,
                type: `reservation:${location.id},${formattedStartDate},${formattedEndDate}`
            }
        });

    }

    function getReservationMainTitles() {
        return <>
            <div className="regMainTitle1">
                <h1>Reserve a Car</h1>
            </div>
            <div className="regMainTitle2">
                <p>Pick-up & Return Location (ZIP, City or Airport)*</p>
            </div>
          
        </>
    }

    function getLocationsAutocomplete() {
        return <div className="rLocation" >
            {locations ? <MuiAutocomplete options={locations.map(l => { return { id: l.id, text: locationToString(l) } })}
                label={"Provide a Location"}
                onChange={setLocation} /> : "Loading..."}
            <span className="text-danger">{error.pickupLocationError}</span>
        </div>
    }

    return (
        <div id='reservationMainContainer' style={{
            backgroundImage: `url(${background})`,
            height: '70vh'
        }}>
            {getReservationMainTitles()}
            <form className="reservationForm" onSubmit={browseCars}>

                <div style={{ backgroundColor: "#f3f3f3", width: "90vmin", padding: 20, margin: "auto" }}>
                    <Grid container>
                        <Grid item xs={12}>
                            {getLocationsAutocomplete()}
                        </Grid>
                        <Grid item xs={12}>
                            <MuiDateRangePicker
                                onChangeStartDate={onChangeStartDate}
                                onChangeEndDate={onChangeEndDate}
                                labelStartDate={"Pick-up*"}
                                labelEndDate={"Return*"}
                                errorMessageStartDate={error.pickupDateError}
                                errorMessageEndDate={error.returnDateError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <button type="browseCars" className="btnBrowseCars">Browse Cars</button>
                        </Grid>
                    </Grid>
                </div>

            </form>
        </div>
    )
}

export default Reservation;