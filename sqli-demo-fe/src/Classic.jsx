import { useState } from "react";
import ProtectionSelection from "./components/ProtectionSelection";

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

const Classic = () => {
    const [search, setSearch] = useState("");
    const [response, setResponse] = useState("");
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
                body: JSON.stringify({ query: search, display: "rows", protection: protection }),
            });
            const data = await response.json();
            setResponse(data);
        } catch (error) {
            console.error("Error sending search data:", error);
        }
    };

    return (
        <>
            <div>Courses</div>
            <ProtectionSelection selectedOption={protection} setSelectedOption={setProtection} />
            <div>
                <h2>Search for Courses</h2>
                <input type="text" value={search} onChange={handleInputChange} />
                <button onClick={handleSubmit}>Submit</button>
                <p>Result:</p>
                {isArray(response) 
                    ? response.map(row => (
                        <p>{Object.values(row)}</p>
                    ))
                    : (<p>{JSON.stringify(response)}</p>)}
            </div>
        </>
    );
};

export default Classic;
