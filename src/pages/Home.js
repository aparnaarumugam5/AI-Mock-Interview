import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home(){

const navigate = useNavigate();

return(

<div className="home">

<h1>
🤖 AI Powered Mock Interview
</h1>

<p>
Improve your interview skills with AI Technology
</p>

<button
onClick={()=>navigate("/login")}
>
Get Ready
</button>

</div>

);

}

export default Home;