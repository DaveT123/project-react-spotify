import "./SearchBar.css";
import { useState } from "react";

export function SearchBar(props) {
    const [term, setTerm] = useState("");

    const search = () => {
        props.onSearch(term);
    };

    const handleTermChange = (e) => {
        setTerm(e.target.value);
    };

    const handleEnter = (e) => {
        if (e.key !== "Enter") {
            return;
        }

        props.onSearch(term);
    };

    return (
        <div className="SearchBar">
            <input
                placeholder="Enter A Song, Album, or Artist"
                onChange={handleTermChange}
                onKeyDown={handleEnter}
            />
            <button className="SearchButton" onClick={search}>
                SEARCH
            </button>
        </div>
    );
}
