// React
import React, { useContext, useEffect, useState } from "react";

// Context
import { Context } from "../../context/Context";

// Firebase Config
import { auth, db } from "../../config/firebase";

// Firebase
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";

import { Loading } from "../../icon/Loading";



export const ChatList = () => {
    const { activeChatRoom, setActiveChatRoom } = useContext(Context);
    const [chatList, setChatList] = useState([]);
    // const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const trimId = (id) => {
        return id.substring(0, 14);
    };

    const trimLongMessage = (msg) => {
        if (msg.length > 35 ) {
            return msg.substring(0, 35) + "..."
        } else {
            return msg;
        }
    }

    const selectChatRoom = async (friendData) => {
        const { userId, username, email, profilePicture } = friendData;

        const userTrimmedId = trimId(auth.currentUser.uid);
        const friendTrimmedId = trimId(userId);

        const possibleChatRoomId1 = userTrimmedId + friendTrimmedId;
        const possibleChatRoomId2 = friendTrimmedId + userTrimmedId;

        const chatRoom1Ref = doc(db, "chatrooms", possibleChatRoomId1);
        const chatRoom1Snap = await getDoc(chatRoom1Ref);

        const chatRoom2Ref = doc(db, "chatrooms", possibleChatRoomId2);
        const chatRoom2Snap = await getDoc(chatRoom2Ref);

        if (chatRoom1Snap.exists()) {
            setActiveChatRoom({
                userId,
                username,
                email,
                profilePicture,
                chatRoomId: possibleChatRoomId1,
            });
        } else if (chatRoom2Snap.exists()) {
            setActiveChatRoom({
                userId,
                username,
                email,
                profilePicture,
                chatRoomId: possibleChatRoomId2,
            });
        } else {
            setActiveChatRoom({
                userId,
                username,
                email,
                profilePicture,
                chatRoomId: possibleChatRoomId1,
            });
        }
    };

    useEffect(() => {
        const getFriendData = async (participant) => {
            try {
                const friendId = participant.filter((item) => item !== auth.currentUser.uid)[0];

                const friendRef = doc(db, "users", friendId);
                const friendSnap = await getDoc(friendRef);

                const username = friendSnap.data().username;
                const userId = friendSnap.data().userId;
                const email = friendSnap.data().email;
                const profilePicture = friendSnap.data().profilePicture;

                return {
                    username,
                    userId,
                    email,
                    profilePicture,
                };
            } catch (error) {
                console.log(error);
            }
        };

        const unsubscribe = onSnapshot(collection(db, "chatrooms"), async (snapshot) => {
            const updatedChatList = [];

            for (const doc of snapshot.docs) {
                const chatRoomData = doc.data();

                const unreadMsg = doc.data().messages.filter((msg) => {
                    return msg.senderId !== auth.currentUser.uid && msg.isRead === false;
                });

                if (chatRoomData.participant.includes(auth.currentUser.uid)) {
                    const friendData = await getFriendData(chatRoomData.participant);
                    updatedChatList.push({ ...chatRoomData, friendData, unreadMsg });
                }
            }

            setChatList(updatedChatList);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : chatList.length === 0 || !chatList ? (
                <h4>There are no chat</h4>
            ) : (
                <>
                    {chatList.map((chat, index) => (
                        <>
                            <div key={chat.friendData.userId} className="flex items-center ml-3" onClick={() => selectChatRoom(chat.friendData)}>
                                <div className="avatar w-[20%] lg:ml-3 lg:w-[10%]">
                                    <div className="rounded-full w-14">
                                        <img src={chat.friendData.profilePicture} />
                                    </div>
                                </div>

                                <div className="w-[70%] -ml-2  lg:-ml-12 lg:w-[80%]">
                                    <p className="text-xl font-bold ">{chat.friendData.username}</p>
                                    <p>{trimLongMessage(chat.messages[chat.messages.length - 1].text)}</p>
                                </div>

                                <div className={chat.unreadMsg.length < 1 ? "" : "w-5 h-5 p-4 flex items-center justify-center bg-accent rounded-full lg:ml-24"}  >
                                    <p className="text-base-100">{chat.unreadMsg.length < 1 ? "" : chat.unreadMsg.length}</p>
                                </div>
                            </div>
                            <div className="divider"></div>
                        </>
                    ))}
                </>
            )}
        </>
    );
};
