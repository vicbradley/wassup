import { useState } from 'react';

import { FriendList } from './FriendList';
import { AddFriend } from './AddFriend';
import { FriendRequst } from './FriendRequest';

export const FriendMenu = () => {
    return (
        <>
            <div className="collapse collapse-arrow bg-base-200">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium">FriendList</div>
                <div className="collapse-content">
                    <FriendList />
                </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium">Add Friend</div>
                <div className="collapse-content">
                    <AddFriend />
                </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium">Friend Request</div>
                <div className="collapse-content">
                    <FriendRequst />
                </div>
            </div>
        </>
    );
};
