import Hero from "@/components/hero";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <Hero photo={"/images/hero.png"} alt={"hero image"} head={"OLDER PERSONS CASH TRANSFER SYSTEM"} desc={"\"Empowering Elders, Securing Futures\""} buttonName={"Register Now"}/>

      <section className="mx-auto my-4 px-4 bg-white flex flex-col-reverse md:flex-row items-center rounded-2xl w-[90vw]">
        <div className="w-full md:w-[70%]  px-4 my-2 font-poppins">
          <p className="text-[18px]">
          Welcome to the Older Persons Cash Transfer Application System. This platform is dedicated to empowering Kenya’s elderly citizens, providing them with the financial support they need to live dignified lives. Join us in our mission to reduce poverty and promote social justice for our seniors.
          </p>
          <button className="bg-secondary p-2 rounded-lg m-2 ">Learn&nbsp;More</button>
        </div>

        <div className="mb-2 w-full">
          <Image src={"/images/elder.png"} 
          alt={"elder image"} 
          width={640} 
          height={360}
          // layout="responsive"
          />
        </div>
      </section>

      <section className="mx-auto my-4 px-4 bg-white flex flex-col md:flex-row items-center  sm:text-lg rounded-2xl w-[90vw]">
      <div className="mb-2 w-full">
          <Image src={"/images/eligibility.png"} 
          alt={"eligibity image"} 
          width={640} 
          height={360}
          // layout="responsive"
          />
        </div>

        <div className="w-full md:w-[70%]  px-4 my-2 font-poppins">
          <div className="text-[15px]">
            <h1 className="text-3xl font-bold">Eligibility</h1>
            <ol className="list-decimal">
              <li>The applicant must be a Kenyan citizen.</li>
              <li>The applicant must be 65 years and above.</li>
              <li>The applicant must not be receiving a pension.</li>
              <li>The applicant must not be enrolled in any other cash transfer program.</li>
              <li>The applicant must have been residing in a particular location for more than a year.</li>
              <li>The applicant must be a low-income earner.</li>
              <li>No member in the applicant&apos;s household should be receiving regular income.</li>
            </ol>
          </div>
        </div>
        
      </section>


      
    </main>
  );
}
