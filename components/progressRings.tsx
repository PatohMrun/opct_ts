import { FaCheck } from "react-icons/fa6";
import { FaHourglassEnd } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

const ProgressRings = () => {
    return (  
        <div className="bg-white m-2 rounded-md">
            {/* status tracking progress rings */}
            <div>
                <h1 className="text-center uppercase font-poppins font-bold text-lg my-2">STATUS</h1>

                {/* Rings container */}
                <section
                className="font-poppins flex flex-col sm:flex-row justify-center items-center gap-4"
                >
                    {/* Ring one */}
                    <div className="text-[10px] flex flex-row sm:flex-col items-center gap-1 h-20">
                        <div className=" bg-green-500 rounded-full flex justify-center items-center w-10 h-10">
                            <FaCheck size={20} />
                        </div>
                        <h3 className="w-20 text-center">Application Submitted</h3>
                    </div>
                    <hr className="w-16 sm:w-40 border-black transform rotate-90 sm:transform-none"/>
                    {/* Ring two */}
                    <div className="text-[10px] flex flex-row sm:flex-col items-center gap-1 h-20">
                        <div className=" bg-green-400 rounded-full flex justify-center items-center w-10 h-10">
                            <FaHourglassEnd size={20} />
                        </div>
                        <h3 className="w-20 text-center">In <br /> Review</h3>
                    </div>
                    <hr className="w-16 sm:w-40 border-black transform rotate-90 sm:transform-none"/>
                    {/* Ring three */}
                    <div className="text-[10px] flex flex-row sm:flex-col items-center gap-1 h-20">
                        <div className=" bg-gray-400 rounded-full flex justify-center items-center w-10 h-10">
                            <IoMdTime size={20} />
                        </div>
                        <h3 className="w-20 text-center">Approved or Rejected</h3>
                    </div>

                </section>
            </div>
        </div>
    );
}
 
export default ProgressRings;