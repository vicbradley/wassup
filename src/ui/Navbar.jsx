// react
import { useContext, useEffect } from "react";

// context
import { Context } from "../context/Context";

export const Navbar = () => {
    const { userData } = useContext(Context);

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <div className="btn btn-ghost normal-case">
                <p className=" text-3xl lg:text-4xl font-bold">Was<span className="text-accent">sup!</span></p>
                </div>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end mr-4">
                    <p className="text-lg font-bold">{userData.username}</p>
                </div>

                <div className="dropdown dropdown-end">
                    <div className="avatar" tabIndex={0} >
                        <div className="rounded-full w-14">
                            <img src={userData.profilePicture} />
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li>
                            <a>Settings</a>
                        </li>
                        <li>
                            <a>Logout</a>
                        </li>
                    </ul>
                </div>

                <div className="dropdown dropdown-end">
                    {/* <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 w-28 rounded-full">
                            <img src={userData.profilePicture} />
                        </div>
                    </label> */}
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li>
                            <a>Settings</a>
                        </li>
                        <li>
                            <a>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
