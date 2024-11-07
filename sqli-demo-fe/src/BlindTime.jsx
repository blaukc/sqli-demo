import { useState } from "react";
import ProtectionSelection from "./components/ProtectionSelection";

const BlindTime = () => {
    const [search, setSearch] = useState("");
    const [protection, setProtection] = useState("none");

    const handleInputChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: search, display: "none", protection: protection }),
            });
        } catch (error) {
            console.error("Error sending search data:", error);
        }
    };

    return (
        <>
            <div>Courses</div>
            <ProtectionSelection selectedOption={protection} setSelectedOption={setProtection} />
            <div>
                <p>Search for Courses</p>
                <input type="text" value={search} onChange={handleInputChange} style={{width: '1000px'}} />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </>
    );
};

export default BlindTime;
