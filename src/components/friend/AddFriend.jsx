// React
import { useContext, useState } from "react";

// Context
import { Context } from "../../context/Context";

// Firebase Config
import { db, auth } from "../../config/firebase";

// Firebase
import { doc, updateDoc, collection, getDocs, query, where, arrayUnion, getDoc } from "firebase/firestore";

// UI
import { Alert } from "../../ui/Alert";

export const AddFriend = () => {
    const [addedEmail, setAddedEmail] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [isSuccess, setIsSuccess] = useState(false); 

    const onSubmit = async (e) => {
        e.preventDefault();
        const q = query(collection(db, "users"), where("email", "==", addedEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const currentUserRef = doc(db, "users", auth.currentUser.uid);
            const currentUserSnap = await getDoc(currentUserRef);
            const currentUserFriendRequest = currentUserSnap.data().friendRequest;

            const targetFriendDoc = querySnapshot.docs[0];
            const targetFriendId = targetFriendDoc.data().userId;

            const addOwnEmail = addedEmail == auth.currentUser.email ? true : false;
            const alreadySendRequest = targetFriendDoc.data().friendRequest.includes(auth.currentUser.uid);
            const alreadyFriend = targetFriendDoc.data().friends.includes(auth.currentUser.uid);
            const hasMatchingFriendRequest = currentUserFriendRequest.includes(targetFriendId);

            if (alreadySendRequest) {
                setAlertText("Already Send Friend Request");
                setShowAlert(true);
                return;
            }

            if (alreadyFriend) {
                setAlertText("Already Friend");
                setShowAlert(true);
                return;
            }

            if (hasMatchingFriendRequest) {
                // alert(`${targetFriendDoc.data().email} has sent friend request, please confirm.`);
                setAlertText(`${targetFriendDoc.data().email} has sent friend request, please confirm.`);
                setShowAlert(true);
                return;
            }

            if (addOwnEmail) {
                setAlertText("Cant Add Your Own Email");
                setShowAlert(true);
                return;
            }

            // update target friend request
            const targetFriendRef = doc(db, "users", targetFriendId);
            await updateDoc(targetFriendRef, {
                friendRequest: arrayUnion(auth.currentUser.uid),
            });

            setAlertText(`Friend request send to ${targetFriendDoc.data().email}`);
            setShowAlert(true);
            setIsSuccess(true);
            // alert(`Friend request send to ${targetFriendDoc.data().email}`);
            // <Dialog />;
        } else {
            setAlertText("No Matching Email Found");
            setShowAlert(true);
        }

        
    };

    return (
        <div className="form-control w-full ">
            <form className=" ">
                    <label className="label">
                        <span className="label-text">Add With Email</span>
                    </label>

                    <div className="flex items-center justify-between">
                        <input
                            onChange={(e) => {
                                setAddedEmail(e.target.value);
                            }}
                            value={addedEmail}
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered w-[70%] lg:w-[90%]"
                        />
                        <button onClick={onSubmit} className="btn btn-accent text-base-100">
                            Add
                        </button>
                    </div>

                    {showAlert && <Alert text={alertText} isSuccess={isSuccess}/>}
            </form>
        </div>
    );
};
