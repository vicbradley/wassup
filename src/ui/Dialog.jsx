export const Dialog = () => {
    return (
        // <dialog id="my_modal_1" className="modal">
        //     <div className="modal-box">
        //         <h3 className="font-bold text-lg">Hello!</h3>
        //         <p className="py-4">Press ESC key or click the button below to close</p>
        //         <div className="modal-action">
        //             <form method="dialog">
        //                 {/* if there is a button in form, it will close the modal */}
        //                 <button className="btn">Close</button>
        //             </form>
        //         </div>
        //     </div>
        // </dialog>

        <>
            {/* <button class="btn" onclick="my_modal_1.showModal()">
                open modal
            </button> */}
            <dialog id="my_modal_1" class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Hello!</h3>
                    <p class="py-4">Press ESC key or click the button below to close</p>
                    <div class="modal-action">
                        <form method="dialog">
                            <button class="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};