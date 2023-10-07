// React
import { useContext, useEffect, useState } from "react";

// Firebase Config
import { auth, db } from "../../config/firebase";

// Firebase
import { doc, getDoc, onSnapshot } from "firebase/firestore";

// Context
import { Context } from "../../context/Context";
// import { FriendListUI } from "../../ui/FriendListUI";

export const FriendList = () => {
    const { friends, setFriends, activeChatRoom, setActiveChatRoom, userData, setUserData } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true); // Tambahkan state untuk status loading

    const trimId = (id) => {
        return id.substring(0, 14);
    };

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
                isNotFoundInDB: true,
            });
        }
    };

    useEffect(() => {
        const getFriendData = async () => {
            try {
                const temp = [];

                for (const id of userData.friends) {
                    const friendRef = doc(db, "users", id);
                    const friendSnap = await getDoc(friendRef);
                    const data = {
                        username: friendSnap.data().username,
                        userId: friendSnap.data().userId,
                        email: friendSnap.data().email,
                        profilePicture: friendSnap.data().profilePicture,
                        bio: friendSnap.data().bio,
                    };

                    temp.push(data);
                }

                setFriends(temp);
            } catch (error) {
                console.log(error);
            }
        };

        getFriendData();
    }, [userData]);

    const FriendsUI = () => {
        if (!friends || friends.length === 0) {
            return <p className="text-xl font-bold">There are no friends</p>;
        } else {
            return (
                <div>
                    {friends.map((friend) => (
                        <>
                            <div key={friend.userId} className="flex items-center ">
                                <div className="avatar w-[20%]  lg:w-[10%]">
                                    <div className="rounded-full w-14">
                                        <img src={friend.profilePicture} />
                                    </div>
                                </div>

                                <div className="w-[85%] pl-2 lg:-ml-10">
                                    <p className="text-xl font-bold ">{friend.username}</p>
                                    <p className="text-xs">{friend.bio}</p>
                                </div>
                                
                                <button onClick={() => selectChatRoom(friend)} className="btn btn-xs btn-accent text-base-100 sm:btn-sm md:btn-md ">
                                    Chat Now
                                </button>
                            </div>
                            <div className="divider"></div>
                        </>
                    ))}
                </div>
            );
        }
    };

    return <FriendsUI />;
};
