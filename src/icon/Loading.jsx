import { DotSpinner } from "@uiball/loaders";

export const Loading = () => {
    return (
        <div className="w-full h-[80vh] flex justify-center items-center">
            <DotSpinner className="" size={40} speed={0.9} color="black" />
        </div>
    )
};
