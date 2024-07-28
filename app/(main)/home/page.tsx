"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/hero";
import ProgressRings from "@/components/progressRings";
import Updates from "@/components/updates";

const Dashboard = () => {
  const router = useRouter();

  const handleHeroButtonClick = () => {
    router.push("/applicationForm");
  };

  return (
    <div>
      <div className="text-center">
        <Hero
          photo={"/images/hero.png"}
          alt={"hero image"}
          head={"APPLY NOW FOR OLDER PERSONS CASH TRANSFER BENEFITS"}
          desc={
            '"Secure financial support. Apply now and experience the benefits quickly!"'
          }
          buttonName={"Apply Now"}
          onButtonClick={handleHeroButtonClick}
        />
      </div>

      <ProgressRings />
      <Updates />
    </div>
  );
};

export default Dashboard;
