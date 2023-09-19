import React, { useMemo } from 'react'
import ReactDom from 'react-dom'
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/LoginContext/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import { usePopup } from "../contexts/PopupContext/PopupContext";
import { AiFillCloseCircle } from "react-icons/ai";
import { GiGearStickPattern } from "react-icons/gi";
import { BsFillPersonFill } from "react-icons/bs";
import { GiSuitcase } from "react-icons/gi";


export default function RentCar({ rentIndex, car, routerLocationState, onClose }) {
    if (rentIndex == -1) return null

    const [showMoreDetails, setShowMoreDetails] = useState(false)
    let { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    var location = routerLocationState?.location

    const [pickupDate, returnDate, delta] = useMemo(() => {
        var routerLocationParams2 = routerLocationState?.type?.split(',') ?? ["location:N/a", 0, 0]
        var pickupDate = new Date(routerLocationParams2[1]);
        var returnDate = new Date(routerLocationParams2[2]);
        var delta = 1 + (returnDate - pickupDate) / 86400000;

        return [pickupDate, returnDate, delta]
    }, [routerLocationState])

    const { closePopup } = usePopup()

    async function onSubmit(e) {
        e.preventDefault()

        if (!isLoggedIn) {
            onClose()
            closePopup()
            toast.info('Please Sign-In / Register', {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }

        navigate('/OrderReview', {
            state: {
                location,
                pickupDate,
                returnDate,
                delta,
                car
            }
        });
    }

    return ReactDom.createPortal(
        <>
            <ToastContainer
                autoClose={2000}
                rtl={false}
            />

            <div className="overlayStyles" />
            <div className="modalStyles" >

                <div style={{ marginBottom: '1vmin' }}>
                    <form onSubmit={onSubmit}>
                        <table id="rentalTable">
                            <tbody>

                                <tr>
                                    <td>
                                        <AiFillCloseCircle className='closeBtn' title="Close" onClick={onClose} />

                                        <h2 className="renth2Style">{car.carCompanyName.name} {car.carModel.name} </h2>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <table>
                                            <tbody>
                                                <tr id="info1tr">
                                                    <td><GiGearStickPattern size="3vmin" color="black" title="Transmission" />{car.transmissionAndDrive.description}</td>
                                                    <td><BsFillPersonFill size="3vmin" color="black" title="Passengers" />{car.carModel.numberOfPeople}</td>
                                                    <td><GiSuitcase size="3vmin" color="black" title="Suitcase" />{car.carModel.numberOfSsuitcases}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td><img className='carImage' src={car.car.imageData} alt={`${car.carCompanyName.name} ${car.carModel.name}`}></img></td>
                                </tr>

                                <tr>
                                    <td><span>Price Per Day  <sup>$</sup>{car.car.pricePerDay} </span> <span className="price"> Total <sup>$</sup>{car.car.pricePerDay * delta}</span></td>
                                </tr>
                            
                               
                                <tr><td>

                                    <td><h4 id='moreInfo' href="#!" onClick={() => setShowMoreDetails(!showMoreDetails)} >Click For More Details </h4> </td>
                              

</td></tr>
                             
                                
                              

                                {showMoreDetails &&
                                    <>

                                        <tr>
                                            <td><b>Fuel & AC:</b> {car.fuelAndAC.description}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Number Of Doors:</b> {car.carModel.numberOfDoors}</td>
                                        </tr>
                                    </>
                                }

                                <tr>
                                    <td><button id="btnReviewOrder" type="submit">Review Order</button></td>

                                </tr>

                            </tbody>
                        </table>

                    </form>

                </div>
            </div>
        </>,
        document.getElementById('portal')
    )
}