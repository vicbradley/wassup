import { useContext } from "react";
import { auth, provider, db } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";
import Cookies from "universal-cookie";
import { Context } from "../context/Context";

const cookies = new Cookies();

const style = {
    height: "100vh",
    backgroundColor: "#ffffff",
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c4c1c8\' fill-opacity=\'0.95\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
}

export const Auth = () => {
    const { setIsDoneSignIn, setIsAuth } = useContext(Context);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            // setIsAuth(cookies.set("auth-token", result.user.refreshToken));
            cookies.set("auth-token", result.user.refreshToken);
            setIsDoneSignIn(true);

			const docRef = doc(db, "users", auth.currentUser.uid);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				await setDoc(docRef, {
					userId: auth.currentUser.uid,
					username: auth.currentUser.displayName,
					email: auth.currentUser.email,
                    profilePicture: auth.currentUser.photoURL,
                    bio: "Hello World!",
                    friends: [],
                    friendRequest: [],
				});
			}
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="auth flex justify-center flex-col items-center" style={style}>
            <p className="text-4xl text-green-400 font-bold"> Sign In To Continue</p>
            {/* <button onClick={signInWithGoogle}> Sign In With Google </button> */}
            <button onClick={signInWithGoogle} className="btn btn-primary">Sign in With Google</button>
        </div>
    );
};
