import { createContext, useContext, useState } from "react";

const PopupContext = createContext(null)

const PopupContextProvider = ({ children }) => {
    const [isPopupOpen, setPopupOpen] = useState(false)
    const openPopup = () => setPopupOpen(true)
    const closePopup = () => setPopupOpen(false)

    return <PopupContext.Provider value={{ isPopupOpen, openPopup, closePopup }}>
        {children}
    </PopupContext.Provider>
}

const usePopup = () => {
    const context = useContext(PopupContext)
    if (!context)
        throw new Error("Popup context was not provided!")
    return context
}

export { PopupContextProvider, usePopup }