// React
import { useContext, useEffect, useState } from "react";

// Firebase Config
import { auth, storage, db } from "../../config/firebase";

// Context
import { Context } from "../../context/Context";

// Firebase
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";

// Icon
import { Edit } from "../../icon/Edit";
import { FinishEdit } from "../../icon/FinishEdit";

export const Setting = () => {
    const { userData, setUserData } = useContext(Context);
    const [profileData, setProfileData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const [newUsername, setNewUserName] = useState("");
    const [newBio, setNewBio] = useState("");

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);

    const [fileUpload, setFileUpload] = useState(null);

    useEffect(() => {
        const getProfileData = () => {
            const { username, bio, profilePicture } = userData;

            const data = { username, bio, profilePicture };

            setProfileData(data);

            setIsLoading(false);

            setNewUserName(username);
            setNewBio(bio);
        };

        getProfileData();

        console.log(profileData);
    }, [userData]);

    const updateUsername = async (e) => {
        e.preventDefault();
        const userRef = doc(db, "users", auth.currentUser.uid);

        await updateDoc(userRef, {
            username: newUsername,
        });

        setIsEditingUsername(false);
    };

    const updateBio = async (e) => {
        e.preventDefault();
        const userRef = doc(db, "users", auth.currentUser.uid);

        await updateDoc(userRef, {
            bio: newBio,
        });

        setIsEditingBio(false);
    };

    const uploadFile = async () => {
        if (!fileUpload) return;

        const metadata = {
            contentType: "image/jpeg",
        };

        const storageRef = ref(storage, "profilePictures/" + fileUpload.name);
        const uploadTask = uploadBytesResumable(storageRef, fileUpload, metadata);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case "storage/unauthorized":
                        // User doesn't have permission to access the object
                        break;
                    case "storage/canceled":
                        // User canceled the upload
                        break;

                    // ...

                    case "storage/unknown":
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const userRef = doc(db, "users", auth.currentUser.uid);
                    await updateDoc(userRef, {
                        profilePicture: downloadURL,
                    });
                });
            }
        );
    };

    return (
        <div className="h-[80vh] flex flex-col items-center   ">
            <h1 className="text-2xl font-bold  ">Update Profile</h1>

            {isLoading ? ( // Menampilkan pesan loading jika isLoading adalah true
                <p>Loading...</p>
            ) : (
                <div className="p-5 lg:p-3 w-full">
                    {/* Konten profil yang ditampilkan setelah data dimuat */}
                    <div className="avatar  w-full ">
                        <div className=" w-36 mx-auto rounded-full">
                            <img src={profileData.profilePicture} alt="Profile" />
                        </div>
                    </div>

                    {isEditingUsername ? (
                        <form className="border-2 border-red-500">
                            <p className="text-2xl font-bold text-accent">Your Name</p>
                            <input
                                placeholder={profileData.username}
                                onChange={(e) => {
                                    setNewUserName(e.target.value);
                                }}
                                value={newUsername}
                                className="text-lg font-bold input input-bordered input-success w-[90%] mr-2 lg:w-[95%]"
                            />
                            <button onClick={updateUsername}>
                                <FinishEdit />
                            </button>
                        </form>
                    ) : (
                        <>
                            <p className="text-2xl font-bold text-accent">Your Name</p>
                            <div className="flex justify-between">
                                <p className="text-lg font-bold">{userData.username}</p>
                                <div onClick={() => setIsEditingUsername(!isEditingUsername)}>
                                    <Edit />
                                </div>
                            </div>
                        </>
                    )}

                    {isEditingBio ? (
                        <form className="mt-5">
                            <p className="text-2xl font-bold text-accent">Your Bio</p>
                            <input
                                placeholder={profileData.bio}
                                onChange={(e) => {
                                    setNewBio(e.target.value);
                                }}
                                value={newBio}
                                className="text-lg font-semibold input input-bordered input-success w-[90%] mr-2"
                            />
                            <button onClick={updateBio}>
                                <FinishEdit />
                            </button>
                        </form>
                    ) : (
                        <div className="mt-5">
                            <p className="text-2xl font-bold text-accent">Your Bio</p>
                            <div className="flex justify-between">
                                <p className="text-lg font-semibold break-words  border-blue-500 w-[80%]">{userData.bio}</p>
                                <div onClick={() => setIsEditingBio(!isEditingBio)}>
                                    <Edit />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <p className="text-2xl font-bold text-accent">Change Profile Picture</p>
                        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
                        <button className="bg-accent p-2 rounded text-base-100 mt-2" onClick={uploadFile}>
                            Upload File
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
