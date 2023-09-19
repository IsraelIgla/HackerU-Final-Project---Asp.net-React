import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RentalCarWebAPI_URL } from "../utils/settings";
import { Keys, getItem } from "../utils/storage";
import { formatDate } from '../components/Utilities';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const OrderReview = () => {
    const [enableSubmit, setEnableSubmit] = useState(true)
    const routerLocation = useLocation();
    const navigate = useNavigate();
    let { location, pickupDate, returnDate, delta, car } = routerLocation.state
    let pickupDateFormated = formatDate(pickupDate, "yyyy-m-d")
    let returnDateFormated = formatDate(returnDate, "yyyy-m-d")
    var now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const date = now.getDate();
    const _hours = now.getHours();
    const hours = (_hours < 10 ? "0" : "") + _hours
    const _minutes = now.getMinutes();
    const minutes = (_minutes < 10 ? "0" : "") + _minutes
    function getFormData() {
        const formData = new FormData();
        formData.append("id", 0);
        formData.append("userid", getItem(Keys.userId));
        formData.append("carid", car.car.id);
        formData.append("locationid", location.id);
        formData.append("startdate", pickupDateFormated);
        formData.append("enddate", returnDateFormated);
        formData.append("price", car.car.pricePerDay);
        return formData;
    }

    async function submitOrder() {
        const formData = getFormData();
        try {
            const response = await axios({
                method: "post",
                url: `${RentalCarWebAPI_URL}/orders/postOrder`,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success('Order successfully completed!', {
                position: toast.POSITION.TOP_CENTER
            });
            setEnableSubmit(false)
        } catch (error) {
            console.log(error.response)
            if (error.response) {
                console.log(error.response.data)
            }
        }
    }

    function cancelOrder() {
    
        navigate('/CarList', {
            state: {
                location,
                type: `reservation:${location.id},${pickupDateFormated},${returnDateFormated}`
            }
        });
    }

    function getOrderReviewMainTitles() {
        return <>
            <div className="regMainTitle1">
                <h1>Order Review</h1>
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
            {getOrderReviewMainTitles()}
            <div id="orderReviewMain">

                {/* <div id="orderReview"> */}

                    <table className="orderReview">
                        <tbody>

                            <tr style={{ backgroundColor: "#AAAAAA" }}>

                                <th>Date & Time</th>
                                <th>Full Name</th>
                                <th>Make</th>
                                <th>Car Model</th>
                                <th>Location</th>
                                <th>Pick-up date</th>
                                <th>Return date</th>
                                <th>Total Price</th>
                            </tr>

                            <tr>
                                <td>{`${month}/${date}/${year} ${hours}:${minutes}`}</td>
                                <td>{getItem(Keys.firstName) + " " + getItem(Keys.lastName)}</td>
                                <td>{car.carCompanyName.name}</td>
                                <td>{car.carModel.name}</td>
                                <td>{location.text}</td>
                                <td>{formatDate(pickupDate, "yyyy-m-d")}</td>
                                <td>{formatDate(returnDate, "yyyy-m-d")}</td>

                                <td>${car.car.pricePerDay * delta}</td>

                            </tr>
                          
                        </tbody>
                    </table>
                    <button id="btnCancelOrder" onClick={cancelOrder}>Back</button>
                    { enableSubmit && <button id="btnSubmitOrder" onClick={submitOrder}>Reserve Now</button> }
                </div>
            {/* </div> */}
        </>

    )
}

export default OrderReview;

