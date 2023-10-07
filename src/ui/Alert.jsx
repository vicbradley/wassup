export const Alert = (props) => {
    const {text, isSuccess} = props;

    const alertColor = isSuccess ? "bg-green-500" : "bg-red-500";

    return (
        <div className={`w-full p-2 text-base-100 rounded mt-3 text-center flex items-center ${alertColor}`}>
            {text}
        </div>
    )
}