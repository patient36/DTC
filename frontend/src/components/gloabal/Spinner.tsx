import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
            <FaSpinner className="animate-spin text-4xl text-cyan-400" />
        </div>
    );
}

export default LoadingSpinner;