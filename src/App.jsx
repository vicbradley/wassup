// React
import { useContext, useEffect, useState } from "react";

// Firebase
import { signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

// Firebase Config
import {auth,db} from "./config/firebase"

// Context
import { Context } from "./context/Context";

// Components
import { Auth } from "./components/Auth";
import { ChatList } from "./components/chat/ChatList";
import { FriendMenu } from "./components/friend/FriendMenu";
import { Setting } from "./components/setting/Setting";

// UI
import { Navbar } from "./ui/Navbar";
import { BottomNavigation } from "./ui/BottomNavigation";
import { ChatRoom } from "./ui/Chatroom";

// Cookies
import Cookies from "universal-cookie";
const cookies = new Cookies();


function App() {
    const { 
        isAuth, setIsAuth, 
        isDoneSignIn,
        userData,setUserData,
        isChatMenuActive, setIsChatMenuActive, 
        isFriendMenuActive, setIsFriendMenuActive,  
        isSettingActive, setIsSettingActive,
        activeChatRoom, setActiveChaRoom
    } = useContext(Context);

    const [ isInitialized, setIsInitialized ] = useState(false);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuth(cookies.get('auth-token'));
            } else {
                setIsAuth(false);
            }

        });

        
        return () => {
            unsubscribe();
        }; 
    },[isDoneSignIn]);


    useEffect(() => {
        if (isAuth) {
            const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), async (document) => {
                setUserData(document.data());
                setIsInitialized(true);
            });

            return () => unsubscribe();
        }    

        
        return
    },[isAuth])
    

    if (isAuth && isInitialized) {
        
        if (activeChatRoom) {
            return <ChatRoom />
        } else {
            return (
                <div className="container">
                <Navbar />
                {isChatMenuActive && <ChatList />}
                {isFriendMenuActive && <FriendMenu />}
                {isSettingActive && <Setting />}
                <BottomNavigation />
            </div>
            )
        }
        
        // (
        //     <div className="container">
        //         <Navbar />
        //         {isChatMenuActive && <ChatList />}
        //         {isFriendMenuActive && <FriendMenu />}
        //         {isSettingActive && <SettingMenu />}

        //         <ChatRoom />

        //         <BottomNavigation />
        //     </div>
        // );
    } else if (isAuth && !isInitialized) {
        return <h2>Loading...</h2>;
    } else {
        return <Auth />;
    }
    
};

export default App;