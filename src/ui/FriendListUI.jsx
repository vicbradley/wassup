export const FriendListUI = (props) => {
    const {friends} = props;

    if (!friends || friends.length === 0) {
        return <p className="text-xl font-bold">There are no friends</p>;
    } else {
        return (
            <div>
                {friends.map((friend) => (
                    <div key={friend.userId} className="flex items-center justify-around">
                        <div className="avatar">
                            <div className="rounded-full w-14">
                                <img src={friend.profilePicture} />
                            </div>
                        </div>
                        <p className="text-xl font-bold -ml-4">{friend.username}</p>
                        <button onClick={() => selectChatRoom(friend)} className="btn btn-xs btn-accent text-base-100 sm:btn-sm md:btn-md lg:btn-lg">
                            Chat Now
                        </button>
                    </div>
                ))}
            </div>
        );
    }
};
