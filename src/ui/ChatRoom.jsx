import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../context/Context";
import { auth, db } from "../config/firebase";
import { doc, updateDoc, arrayUnion, setDoc, getDoc, onSnapshot, collectionGroup } from "firebase/firestore";
import date from "date-and-time";
import {Send} from "../icon/Send";
import {Back}  from "../icon/Back";


export const ChatRoom = () => {
    const { activeChatRoom, setActiveChatRoom } = useContext(Context);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [isThereANewMessage, setIsThereANewMessage] = useState(false);

    const messageContainerRef = useRef(null);

    const handleBackButton = () => {
        setActiveChatRoom(false);
    };

    // Mengatur isKeyboardOpen saat input mendapatkan fokus
    const handleInputFocus = () => {
        setIsKeyboardOpen(true);
    };

    // Mengatur isKeyboardOpen saat input kehilangan fokus
    const handleInputBlur = () => {
        setIsKeyboardOpen(false);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === "") return;
        const now = new Date();

        // Create a copy of the updated messageObject
        const updatedMessageObject = {
            senderId: auth.currentUser.uid,
            senderDisplayName: auth.currentUser.email,
            createdAt: date.format(now, "HH:mm:ss"),
            text: newMessage,
            isRead: false,
        };

        if (activeChatRoom.isNotFoundInDB) {
            await setDoc(doc(db, "chatrooms", activeChatRoom.chatRoomId), {
                participant: [auth.currentUser.uid, activeChatRoom.userId],
                messages: arrayUnion(updatedMessageObject),
                chatRoomId: activeChatRoom.chatRoomId,
            });

            const userRef = doc(db, "users", auth.currentUser.uid);
            const friendRef = doc(db, "users", activeChatRoom.userId);

            await updateDoc(userRef, {
                chatRooms: arrayUnion(activeChatRoom.chatRoomId),
            });

            await updateDoc(friendRef, {
                chatRooms: arrayUnion(activeChatRoom.chatRoomId),
            });

            const { isNotFoundInDB, ...removeNotFoundInDb } = activeChatRoom;

            setActiveChatRoom(removeNotFoundInDb);

            alert("chatroom tidak ada, chatroom dibuat di db");
        } else {
            const chatRoomRef = doc(db, "chatrooms", activeChatRoom.chatRoomId);

            await updateDoc(chatRoomRef, {
                messages: arrayUnion(updatedMessageObject),
            });

            setIsThereANewMessage(true);
        }

        setNewMessage("");
    };

    useEffect(() => {
        setMessages([]);

        if (!activeChatRoom) {
            return;
        }

        const unsub = onSnapshot(doc(db, "chatrooms", activeChatRoom.chatRoomId), async (document) => {
            if (document.data().messages.length < 1) {
                return;
            }

            const messagesFromDb = document.data().messages;

            messagesFromDb.forEach((msg) => {
                if (msg.senderId !== auth.currentUser.uid && msg.isRead === false) {
                    console.log(msg.isRead);
                    msg.isRead = true;
                }
            });

            const docRef = doc(db, "chatrooms", activeChatRoom.chatRoomId);
            await updateDoc(docRef, {
                messages: messagesFromDb,
            });

            setMessages(messagesFromDb);
        });

        return () => unsub();
    }, [activeChatRoom]);

    useEffect(() => {
        if ((messageContainerRef.current && !isKeyboardOpen) || (messageContainerRef.current && isThereANewMessage)) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }

    }, [messages, isKeyboardOpen]);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Navbar */}
            <div className="h-[10vh] lg:h-[13vh] bg-[#f2f2f2] flex items-center">
                <button className="font-bold ml-3" onClick={handleBackButton}>
                    <Back />
                </button>

                <div className="avatar w-[20%] lg:w-[10%] ml-1 lg:ml-3">
                    <div className="rounded-full w-14">
                        <img src={activeChatRoom.profilePicture} alt="Profile" />
                    </div>
                </div>

                <p className="text-xl font-bold -ml-3 lg:-ml-10">{activeChatRoom.username}</p>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-2" ref={messageContainerRef}>
                {messages.map((message) => (
                    <div key={message.createdAt} className={`chat ${message.senderId === auth.currentUser.uid ? "chat-end" : "chat-start"}`}>
                        <div className="chat-bubble bg-base-300 text-slate-800 font-semibold mt-3 flex items-center">
                            <div className="message-text" style={{ maxWidth: "35vw", wordBreak: "break-word" }}>
                                {message.text}
                            </div>
                            <span className="text-xs text-slate-500 font-thin mt-6 ml-5">{message.createdAt}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <form className={`p-2 ${isKeyboardOpen ? "translate-y-[-5px]" : ""} ${isThereANewMessage ? "translate-y-[-5px]" : ""} flex items-center justify-between`}>
                <input
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                    }}
                    value={newMessage}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-[80%] lg:w-[90%] lg:ml-4"
                />
                <button className="btn btn-md btn-accent text-base-100 lg:mr-3" onClick={onSubmit}>
                    <Send />
                </button>
            </form>
        </div>
    );
};
