import Hero from "@/components/hero";
import ProgressRings from "@/components/progressRings";
import Updates from "@/components/updates";

const Dashboard = () => {
    return ( 
        <div>
            <div className="text-center">
            <Hero photo={"/images/hero.png"} alt={"hero image"} head={"APPLY NOW FOR OLDER PERSONS CASH TRANSFER BENEFITS"} desc={"\"Secure financial support. Apply now and experience the benefits quickly!\""} buttonName={"Apply Now"}/>
            </div>

            <ProgressRings />
            <Updates />
        </div>

        

     );
}
 
export default Dashboard;   