// React
import { useContext, useEffect, useState } from "react";
// Context
import { Context } from "../../context/Context";
// Firebase Config
import { db, auth } from "../../config/firebase";
// Firebase
import { doc, updateDoc, arrayRemove, arrayUnion, getDoc, onSnapshot, collection } from "firebase/firestore";

export const FriendRequst = () => {
    const { userData, setUserData } = useContext(Context);

    const [friendRequest, setFriendRequest] = useState(null);

    useEffect(() => {
        const getFriendRequestData = async () => {
            const temp = [];

            for (const id of userData.friendRequest) {
                const friendRef = doc(db, "users", id);
                const friendSnap = await getDoc(friendRef);
                const data = {
                    username: friendSnap.data().username,
                    userId: friendSnap.data().userId,
                    email: friendSnap.data().email,
                    profilePicture: friendSnap.data().profilePicture,
                };

                temp.push(data);
            }

            setFriendRequest(temp);
        };

        getFriendRequestData();
    }, [userData]);

    const acceptRequest = async (id) => {
        const currentUserRef = doc(db, "users", auth.currentUser.uid);
        const friendRef = doc(db, "users", id);

        // remove friendrequest
        await updateDoc(currentUserRef, {
            friendRequest: arrayRemove(id),
        });

        // add to friend array for user
        await updateDoc(currentUserRef, {
            friends: arrayUnion(id),
        });

        // add to friend array for friend
        await updateDoc(friendRef, {
            friends: arrayUnion(auth.currentUser.uid),
        });
    };

    const rejectRequest = async (id) => {
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
            friendRequest: arrayRemove(id),
        });
    };

    const FriendRequestUI = () => {
        if (!friendRequest || friendRequest.length < 1) {
            return <p className="text-xl font-bold">There are no friend request</p>;
        } else {
            return (
                <div>
                    {friendRequest.map((data) => (
                        <>
                            <div key={data.userId} className="flex items-center mb-3">
                                <div className="avatar w-[10%] lg:w-[10%]">
                                    <div className="rounded-full w-14">
                                        <img src={data.profilePicture} />
                                    </div>
                                </div>

                                <div className="ml-1 w-[60%] lg:w-[80%] lg:-ml-10">
                                    <p className="text-xl font-bold ">{data.username}</p>
                                    <p className="text-xs">{data.email}</p>
                                </div>

                                <div className="flex flex-row justify-center border2 border-red-500 ">
                                    <button className=" btn btn-sm btn-accent text-base-100 md:btn-md mr-2" onClick={() => acceptRequest(data.userId)}>
                                        Accept
                                    </button>

                                    <button className=" btn btn-error btn-sm  text-base-100  md:btn-md " onClick={() => rejectRequest(data.userId)}>
                                        Reject
                                    </button>
                                </div>
                            </div>
                            <div className="divider"></div>
                        </>
                    ))}
                </div>
            );
        }
    };

    return (
        <>
            <FriendRequestUI />
        </>
    );
};
