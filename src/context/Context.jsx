import React, { useState } from "react";
import { createContext } from "react";
import Cookies from "universal-cookie";

export const Context = createContext(null);

const cookies = new Cookies();

export const ContextProvider = (props) => {
    const [ isAuth, setIsAuth ] = useState();

    const [ isDoneSignIn, setIsDoneSignIn ] = useState(false);
    
    const [ userData, setUserData ] = useState();

    const [ isChatMenuActive, setIsChatMenuActive ] = useState(true);
    const [ isFriendMenuActive, setIsFriendMenuActive ] = useState(false);
    const [ isSettingActive, setIsSettingActive ] = useState(false);

    const [ friends, setFriends ] = useState();

    const [ activeChatRoom, setActiveChatRoom ] = useState();

  

    const contextValue = {
        isAuth, setIsAuth, 
        isDoneSignIn, setIsDoneSignIn,
        userData, setUserData,
        isChatMenuActive, setIsChatMenuActive,
        isFriendMenuActive, setIsFriendMenuActive,
        isSettingActive, setIsSettingActive,
        friends, setFriends,
        activeChatRoom, setActiveChatRoom
    }

    return <Context.Provider value={contextValue}>{props.children}</Context.Provider>
}