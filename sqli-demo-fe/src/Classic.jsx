import { useState } from "react";

const Classic = () => {
    const [search, setSearch] = useState("");

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
                body: JSON.stringify({ query: search }),
            });
            const data = await response.json();
            console.log("Response:", data);
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
            </div>
        </>
    );
};

export default Classic;
