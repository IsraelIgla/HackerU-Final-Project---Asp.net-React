import aboutCar  from "../assets/images/aboutCar.png";
import {getValueFromDictionary} from "../components/Utilities";

const AboutUs = () => {
  return <div className="aboutUsMainContainer">

    <div className="aboutUsTopContainer">
      <h1>ABOUT {getValueFromDictionary('businessName').toUpperCase() }</h1>
      <h2>
        What's the {getValueFromDictionary('businessName')} Way? Taking care of our customers,   <br />
        our communities, our employees and our environment.
      </h2>


    </div>

    <div className="aboutUsLeftContainer">
    <img src= {aboutCar}  alt="aboutCar"/>
     

    </div>
    <div className="aboutUsMiddleContainer">
      <h2>Culture and hard work created Enterprise</h2>
      <p>
      {getValueFromDictionary('businessName')} is an ongoing Israeli success story. Our guiding principles, and humble beginning, revolve around personal honesty and integrity. We believe in strengthening our communities one neighborhood at a time, serving our customers as if they were our family, and rewarding hard work. These things are as true today as they were when we were founded in 2022.
        <br /><br />
        Today, our massive network means Enterprise is the largest transportation solutions provider. We offer car and truck rentals, as well as car sharing and car sales. We're there when you need us with over 8,000 locations worldwide.
        <br /><br />
        We take an active role in sustainability, not only because it’s smart for our business, but because we believe in making the world a better place for future generations. Because of our size, we are in a unique position to foster innovation, advance research and test market-driven solutions.
      </p>
    </div>
     <div className="aboutUsRightContainer">
      <h2>Did you know?</h2>
      <p>
        Founders {getValueFromDictionary('ownerName2')} & {getValueFromDictionary('ownerName1')} selected the name {getValueFromDictionary('businessName')} as a salute to the WWII aircraft carrier he served on. Today, the “{getValueFromDictionary('businessName')}” name is synonymous with the leadership and vision of the business.
      </p>
    </div>


    <div className="aboutUsBottomContainer">
      <p>MILESTONES</p>

      <h1>2022</h1>
      <p id="p2">

        With seven cars and a hunch that customers will<br />
        embrace the novel concept of leasing automobiles, <br />
        {getValueFromDictionary('ownerName2')} & {getValueFromDictionary('ownerName1')} founds Executive Leasing Company in Israel.
      </p>
    </div>
  </div>


};

export default AboutUs
