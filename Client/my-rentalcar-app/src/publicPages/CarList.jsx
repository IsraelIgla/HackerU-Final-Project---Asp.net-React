import '../App.css'
import React from 'react';
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EditCar from './EditCar'
import RentCar from './RentCar'
import { getAPI, formatDate } from '../components/Utilities'
import { BsSearch } from "react-icons/bs";
import { LuFilterX } from "react-icons/lu";
import { BiFilterAlt } from "react-icons/bi";
import AuthContext from "../contexts/LoginContext/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import { usePopup } from '../contexts/PopupContext/PopupContext';


const CarList = () => {
  const [carPopupIndex, setCarPopupIndex] = useState(-1)
  const [inputs, setInputs] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchTextHasChanged, setSearchTextHasChanged] = useState(false);
  const [searchKeyPressed, setSearchKeyPressed] = useState(false);
  const [carListDisplayPage, setCarListDisplayPage] = useState([]);
  let carChosen = carListDisplayPage.find(obj => obj.car.id === carPopupIndex)
  const [carCompanyNames, setCarCompanyNames] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [carsPerPage, setCarsPerPage] = useState(3);
  const [carsCount, setCarsCount] = useState(3);
  const [paginationButtonGroupIndex, setPaginationButtonGroupIndex] = useState(1);
  const navigate = useNavigate();
  let { isLoggedIn, roleID } = useContext(AuthContext);
  const routerLocation = useLocation();
  var routerLocationState = routerLocation.state
  var location = routerLocationState?.location

  var routerLocationParams2 = routerLocationState?.type?.split(',') ?? ["all", 0, 0]

  var pickupDate = new Date(routerLocationParams2[1]);
  var returnDate = new Date(routerLocationParams2[2]);

  const paginationButtonGroupSize = 4;
  const pagesCount = Math.ceil(carsCount / carsPerPage)

  const paginationButtonGroupsCount = Math.ceil(pagesCount / paginationButtonGroupSize)

  const getCarsCount = () => getAPI(`cars/carscount?type=${routerLocation.state?.type}&carCompanyNameID=${inputs.carCompanyName || "0"}
    &carModelID=${inputs.carModel || "0"}&searchText=${searchText}`).then((res) => {
    if (res.status === 200) {
      setCarsCount(res.data)
    } else {
      console.log(res)
    }
  })

  const getCarsDisplayPage = () => getAPI(`cars?type=${routerLocation.state?.type}&carCompanyNameID=${inputs.carCompanyName || "0"}
      &carModelID=${inputs.carModel || "0"}&searchText=${searchText}&pageIndex=${pageIndex}
      &carsPerPage=${carsPerPage}`).then((res) => {
    if (res.status === 200) {
      setCarListDisplayPage(res.data)
    } else {

      toast.error("SERVER IS DOWN !", {
        position: toast.POSITION.BOTTOM_CENTER
      });

    }
  })

  const getAllCarCompanyNames = () => getAPI("carCompanyNames").then((res) => {
    if (res.status === 200) {
      setCarCompanyNames(res.data)
    } else {
      console.log(res)
    }
  })

  const getCarModelsByCarCompanyNameID = () => getAPI(`carModels/${inputs.carCompanyName || "0"}`).then((res) => {
    if (res.status === 200) {
      setCarModels(res.data)
    } else {
      console.log(res)
    }
  })

  useEffect(() => {
    getAllCarCompanyNames()
  }, []);

  useEffect(() => {
    getCarsCount()
  }, [carsPerPage, inputs]);

  useEffect(() => {
    getCarModelsByCarCompanyNameID()
  }, [inputs.carCompanyName])

  useEffect(() => {
    getCarsDisplayPage()
  }, [pageIndex, carsPerPage, carsCount, inputs])

  useEffect(() => {
    if (searchTextHasChanged && searchKeyPressed) {
      setPaginationButtonGroupIndex(1);
      setPageIndex(1)
      getCarsCount()
      getCarsDisplayPage()
    }
    setSearchTextHasChanged(false)
    setSearchKeyPressed(false)
  }, [searchKeyPressed])

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  }

  const addCar = () => {
    navigate("/AddCar");
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchKeyPressed(true)
    }
  }


  const { openPopup } = usePopup()


  useEffect(() => {
    if (carPopupIndex != -1) {
      openPopup()
    }
  }, [carPopupIndex])

  function getRentPopup() {
    if (!isLoggedIn) {
      if (carPopupIndex != -1)
        navigate("/Reservation")
      return null
    }

    return <RentCar rentIndex={carPopupIndex} car={carChosen} routerLocationState={routerLocation.state}
      onClose={() => setCarPopupIndex(-1)} />
  }

  function onCardClick(id) {

    if (roleID > 1 && !routerLocation.state)
      navigate("/Reservation")
    setCarPopupIndex(id)
  }

  function resetFilter() {
    setInputs({})
    setSearchText('')
  }

  if (carListDisplayPage == null)
    return ''

  function getUpperPanel() {
    return <table style={{ borderBottom: "1px solid #c3c3c3", width: "100%" }}>
      <tbody>
        <tr>
          <td>
            {getFilterPanel()}
          </td>
          {routerLocationState?.type && routerLocationParams2[0].split(':')[0] == 'reservation' &&
            <td>
              {getReservationInfo()}
            </td>
          }
        </tr>
      </tbody>
    </table>
  }

  function getReservationInfo() {
    return <table id="reservationInfoInCarList">
      <tbody>
        <tr><td><b>Location: </b>{location.text}</td></tr>
        <tr><td><b>Pickup Date: </b>{formatDate(pickupDate, "d/m/yyyy")}</td></tr>
        <tr><td><b>Return Date: </b>{formatDate(returnDate, "d/m/yyyy")}</td></tr>
      </tbody>
    </table>
  }

  function getFilterPanel() {
    return <div className="filterContainer">
      <table>
        <tbody>
          <tr>
            <td style={{ lineHeight: "0" }}><label><strong> &nbsp; Make</strong></label></td>
            <td>
              <select
                style={{ width: "10vmin" }}
                name="carCompanyName"
                value={inputs.carCompanyName || ""}
                onChange={handleChange} >
                <option value="0" key="0">All</option>
                {carCompanyNames.map((carCompanyName) => <option value={carCompanyName.id}
                  key={carCompanyName.id}>{carCompanyName.name}</option>)}
              </select>
            </td>
            <td><label>  <strong> &nbsp;&nbsp;Model </strong></label></td>
            <td>
              <select
                style={{ width: "10vmin" }}
                name="carModel"
                value={inputs.carModel || ""}
                onChange={handleChange} >
                <option value="0" key="0">All</option>
                {carModels.map((carModel) => <option value={carModel.id} key={carModel.id}>{carModel.name}</option>)}
              </select>
            </td>

            <td> &nbsp;
              {inputs.carCompanyName || inputs.carModel || searchText ? <LuFilterX size="2.2vmin" title='Clear Filter' onClick={() => resetFilter()} /> :
                < BiFilterAlt size="2.2vmin" title='Filter' />}
            </td>

            {/* <th style={{ paddingLeft: "10vw" }}><p style={{ fontSize: "1vw", whiteSpace: "nowrap" }}>Search text</p></th> */}
            <th>Search text</th>
            <td>
              <input
                style={{ width: "20vmin" }}
                type="text"
                title='Press enter to submit'
                onKeyDown={handleSearchKeyDown}
                name="searchText"
                required
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setSearchTextHasChanged(true) }}
              />
            </td>
            <td>
              
              <BsSearch size="2vmin"  onClick={() => setSearchKeyPressed(true)} />
            </td>
     
            {roleID == 1 ?
              <td>
                <div title="Add Car" className={"addCarButton"}
                  onClick={addCar}>+</div>
              </td> : ''}
          </tr>
        </tbody>
      </table>
    </div>
  }

  function getCarPopup() {
    if (!isLoggedIn)
      return getRentPopup()

    if (roleID == 1)
      return <EditCar theCar={carChosen}
        editIndex={carPopupIndex} onSave={getCarsDisplayPage}
        onClose={() => setCarPopupIndex(-1)} onDelete={() => {
          let _carsCount = carsCount - 1
          setCarsCount(_carsCount)
        }}
      />
    else if (roleID > 1)
      return getRentPopup()

    return ''
  }

  function getCards() {
    return <div className="cardsContainer">
      {carListDisplayPage.map(car => {
        return (
          <div className="card" key={car.car.id} onClick={() => onCardClick(car.car.id)}>

            <div className="container">
              <h2 className="h2Style">{car.carCompanyName.name} </h2>
              <h3 className="h2Style">{car.carModel.name} </h3>

              <img src={car.car.imageData} alt={`${car.carCompanyName.name} ${car.carModel.name}`}></img>
              <h4 className="h4List">Price Per Day:  <span>${car.car.pricePerDay}</span> </h4>
            </div>
          </div>)
      })}

      {getCarPopup()}

    </div>
  }

  function getPagination() {
    return <>
      <div key={"<"}
        className={`paginationButton paginationButtonRL`} onClick={() => {
          if (paginationButtonGroupIndex > 1) {
            setPaginationButtonGroupIndex(paginationButtonGroupIndex - 1)
            setPageIndex((paginationButtonGroupIndex - 2) * paginationButtonGroupSize + 1)
          }

        }}><div>&laquo;</div></div>

      {Array.from(Array(Math.min(paginationButtonGroupSize,
        pagesCount - paginationButtonGroupSize * (paginationButtonGroupIndex - 1))), (e, i) => {
          let _i = i + 1 + paginationButtonGroupSize * (paginationButtonGroupIndex - 1);
          return (
            <div key={_i} className={`paginationButton${_i == pageIndex ? ' paginationButtonCurrent' : ''}`}
              onClick={() => setPageIndex(_i)}><div>{_i}</div></div>
          )
        })}

      <div key={">"}
        className={`paginationButton paginationButtonRL`} onClick={() => {
          if (paginationButtonGroupIndex < paginationButtonGroupsCount) {
            setPaginationButtonGroupIndex(paginationButtonGroupIndex + 1)
            setPageIndex(paginationButtonGroupIndex * paginationButtonGroupSize + 1)
          }

        }}><div>&raquo;</div></div>
    </>
  }

  function getCardsPerPageField() {
    return <table style={{ float: "right", marginRight: "18vmin", marginTop: "3vmin" }}>
      <tbody>
        <tr>
          <th style={{ paddingLeft: "10vw" }}><p style={{ fontSize: "2.5vmin", whiteSpace: "nowrap" }}>Cards Per Page</p></th>
          <td>
            <input
              style={{ width: "2vw", float: "right" }}
              type="number"
              min="1"
              max="6"
              name="carsPerPage"
              required
              value={carsPerPage}
              onChange={(e) => {
                setCarsPerPage(e.target.value);
                setPaginationButtonGroupIndex(1);
                setPageIndex(1);
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  }

  function getToastContainer() {
    return <ToastContainer
      autoClose={3000}
      rtl={false}
    />
  }

  return <>
    {getToastContainer()}
    {getUpperPanel()}
    {getCards()}
    {getPagination()}
    {getCardsPerPageField()}
  </>
};

export default CarList
