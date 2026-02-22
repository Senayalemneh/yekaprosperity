import React from "react";
import Carousel from "../../components/Home/Carousel";
import Counter from "../../components/Home/Counter";
import DirectorMessage from "../../components/Home/DirectorMessage";
import Offices from "../../components/Home/Offices";
import News from "../../components/News/News";
import Contact from "../../components/Contact/ContactDesc";
import Banner from "../../components/Home/Banner";
import BuildingFloors from "../../components/Home/BuildingFloors";
import DataChart from "../../components/Home/DataChart ";
import OfficeDescription from "../../components/ManagementDD/Offices/OfficesDesc";
import Welcome2 from "../../components/Home/Welcome2";
import { useTranslation } from "react-i18next";
import OurTeam from "../../components/OurTeams/ourTeams";
import Locaton from "../../components/Contact/Location";
import OurParnter from "../../components/Home/PartnersPage"
import FAQ from "../../components/Home/FAQ";

function Home() {
  const { t } = useTranslation();
  return (
    <div>
      <Carousel />
      {/* <Welcome2 /> */}
      <DirectorMessage />
      <OurTeam />
      {/* <BuildingFloors /> */}
      <News />
      <Contact />
      <Locaton />
      <FAQ /> 
      <OurParnter />
    </div>
  );
}

export default Home;
