import axios from "axios";
import { RentalCarWebAPI_URL } from "../utils/settings";
import validator from 'validator'

export const getAPI = async (url: string, data: any): Promise<any> => {
 
    return await axios({
        url: `${RentalCarWebAPI_URL}/${url}`
    }).then((response) => {
        return {
            status: response.status,
            data: response.data
        }
    }).catch((error) => {
        return error
    })
}

export function validatePassword(password) {
    if (!password) return "Required"
    let valid = validator.isStrongPassword(password, {
        minLength: 8, minLowercase: 0,
        minUppercase: 1, minNumbers: 1, minSymbols: 0
    })
    valid = valid || validator.isStrongPassword(password, {
        minLength: 8, minLowercase: 1,
        minUppercase: 0, minNumbers: 1, minSymbols: 0
    })
    if (valid) return "";
    return `Password must contain at least one letter, at least one digit, 
         and it's length must be at least 8`;
}

export function validateEmail(email) {
    if (!email) return "Required"
    return validator.isEmail(email) ? "" : "email address is not valid"
}

export function checkError(setError, errorType, validCondition, errorMessage) {
    if (validCondition) {
        setError(values => ({ ...values, [errorType]: "" }))
        return true;
    } else {
        setError(values => ({ ...values, [errorType]: errorMessage }))
        return false;
    }
}

export function formatDate(date, formatType) {
    const fullYear = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if (formatType == "yyyy-m-d")
        return `${fullYear}-${month}-${day}`
    if (formatType == "d/m/yyyy")
        return `${day}/${month}/${fullYear}`
    if(formatType == "d/m/yyyy hh:mm") {
        const _hours = date.getHours();
        const hours = (_hours < 10? "0" : "") + _hours
        const _minutes = date.getMinutes();
        const minutes = (_minutes < 10? "0" : "") + _minutes
        return `${date}/${month}/${fullYear} ${hours}:${minutes}`
    }
}

export function locationToString(location) {
    return `${location.city}, ${location.country}, ${location.airportCode}`
}

export function getValueFromDictionary(key){
    const dict = {
        businessName: "Rental Car",
        ownerName1: "Israel Israely",
        ownerName2: "Ploni Almoni",
        adminsmail: "email@gmail.com"
      }
      return dict[key] 

}

export default getAPI
