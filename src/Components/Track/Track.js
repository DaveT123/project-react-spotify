import React from "react";
import "./Track.css";

export function Track(props) {
    const renderAction = () => {
        if (props.isRemoval) {
            return (
                <button className="Track-action" onClick={removeTrack}>
                    -
                </button>
            );
        } else {
            return (
                <button className="Track-action" onClick={addTrack}>
                    +
                </button>
            );
        }
    };

    const addTrack = () => {
        props.onAdd(props.track);
    };

    const removeTrack = () => {
        props.onRemove(props.track);
    };

    return (
        <div className="Track">
            <div className="Track-information">
                <h3>{props.track.name}</h3>
                <p>
                    {props.track.artists} | {props.track.album}
                </p>
            </div>
            {renderAction()}
        </div>
    );
}
