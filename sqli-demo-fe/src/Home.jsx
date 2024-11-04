import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Welcome to budget NUS Mods</h1>
            <p>Search for your courses here:</p>
            <Link to="/classic">Classic SQLi</Link>
            <br />
            <Link to="/blind-content">Blind SQLi (content based)</Link>
            <br />
            <Link to="/blind-time">Blind SQLi (time based)</Link>
        </div>
    )
}

export default Home;