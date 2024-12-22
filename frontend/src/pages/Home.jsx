import Departments from "../components/Departments"
import HeroSection from "../components/HeroSection"
import MessageForm from "../components/MessageForm"
import Services from "../components/Services"


const Home = () => {
  return (
    <div>
      <HeroSection/>
      <Services/>
      <Departments/>
   <MessageForm/>
    </div>
  )
}

export default Home