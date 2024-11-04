import { useState } from "react";

const BlindContent = () => {
    const [search, setSearch] = useState("");
    const [response, setResponse] = useState(null);

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
                body: JSON.stringify({ query: search, display: "bool" }),
            });
            const data = await response.json();
            setResponse(data.result);
        } catch (error) {
            console.error("Error sending search data:", error);
        }
    };

    return (
        <>
            <div>Courses</div>
            <div>
                <p>Search for Courses</p>
                <input type="text" value={search} onChange={handleInputChange} />
                <button onClick={handleSubmit}>Submit</button>
                <p>Result:</p>
                <p>{response !== null && (response ? `Course exists in database!` : `Can't find course in database`)}</p>
            </div>
        </>
    );
};

export default BlindContent;
