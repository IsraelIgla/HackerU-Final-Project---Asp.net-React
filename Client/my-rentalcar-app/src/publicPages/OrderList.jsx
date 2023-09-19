import { useState, useEffect } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
//import { useNavigate } from "react-router-dom";
import { getAPI, locationToString } from '../components/Utilities'
import { RiDeleteBin5Line } from 'react-icons/ri';
import { RentalCarWebAPI_URL } from "../utils/settings";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderList = () => {

    let [orders, setOrders] = useState([])
    let [users, setUsers] = useState([])
    let [userId, setUserId] = useState(0)
    let [rowsDeleted, setRowsDeleted] = useState(0)
    //const navigate = useNavigate();
    //var userId = 0;

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        getOrders()
    }, [userId, rowsDeleted])

    const getOrders = () => getAPI(`orders?userId=${userId}`).then((res) => {
        if (res.status === 200) {
            setOrders(res.data)
        } else {
            console.log(res)
        }
    })

    const getUsers = () => getAPI(`users`).then((res) => {
        if (res.status === 200) {
          
            setUsers(res.data)
        } else {
            console.log(res)
        }
    })

    async function deleteOrder(id) {
        try {
            const response = await axios({
                method: "delete",
                url: `${RentalCarWebAPI_URL}/orders/${id}`,
            });
            toast.success(`Succesfuly Removed Order # ${id} `, {
                position: toast.POSITION.TOP_CENTER
              });
            setRowsDeleted(rowsDeleted + 1)
        } catch (error) {
            console.log("error", error)
            if (error.response) {
                console.log(error.response.data)
            }
        }
    }
    function getToastContainer() {
        return <ToastContainer
          autoClose={1000}
          rtl={false}
        />
      }
    function confirmDeleteOrder(id) {
        confirmAlert({
            title: 'Confirm to Delete',
            message: `Are you sure you want to delete order #: ${id}?`,
            buttons: [
              {
                label: 'Yes',
                onClick: () => deleteOrder(id)
              },
              {
                label: 'No',
              }
            ]
          });
    }

    function getOrderListMainTitles() {
        return <>
            <div className="regMainTitle1">
                <h1>Order List</h1>
            </div>

            <hr />
        </>
    }

    function getFilterUI() {
        return <div style={{ textAlign: "center" }}>
            <label style={{ fontSize: "2vmin", fontWeight: "bold" }}>User Name</label>
            <select
                name="userId"
                style={{ marginLeft: "3vmin" }}
                value={userId}
                onChange={(e) => setUserId(e.target.value)} >
                <option value="0" key="0">All</option>
                {users.map((user) => <option value={user.userId} key={user.userId}>{user.userName}</option>)}
            </select>
        </div>
    }

    function getOrderTable() {
        return <table className="orderTable"  >
            <tbody>
                <tr>
                    <th>ID</th>
                    <th>Date & Time</th>
                    <th>Full Name</th>
                    <th>Make</th>
                    <th>Car Model</th>
                    <th>Location</th>
                    <th>Pick-up date</th>
                    <th>Return date</th>
                    <th>Total Price</th>
                    <th></th>
                </tr>

                {orders.map(obj => <tr key={obj.order.id}>
                    <td>{obj.order.id}</td>
                    <td>{obj.order.orderDate.split('T')[0].split('-').reverse().join('/')}</td>
                    <td>{obj.user.firstName + " " + obj.user.lastName}</td>
                    <td>{obj.carCompanyName.name}</td>
                    <td>{obj.carModel.name}</td>
                    <td>{locationToString(obj.location)}</td>
                    <td>{obj.order.startDate.split('T')[0].split("-").reverse().join("/")}</td>
                    <td>{obj.order.endDate.split('T')[0].split("-").reverse().join("/")}</td>
                    <td>{`$${obj.order.price}`}</td>
                    {/* <td><RiDeleteBin5Line size="4vmin" title="Delete"
                        onClick={() => deleteOrder(obj.order.id)} /></td> */}
                    <td><RiDeleteBin5Line size="4vmin" title="Delete"
                        onClick={() => confirmDeleteOrder(obj.order.id)} /></td>
                </tr>)}
            </tbody>
        </table>
    }

    return (
        <>
            {getOrderListMainTitles()}
            {getFilterUI()}
            <hr />
            {getOrderTable()}
            {getToastContainer()}
        </>
    )
}

export default OrderList;

