import "./App.css";
import React, { useState } from "react";
import { SearchResults } from "../SearchResults/SearchResults";
import { SearchBar } from "../SearchBar/SearchBar";
import { Playlist } from "../Playlist/Playlist";

import Spotify from "../../util/Spotify";

export default function App() {
    const [searchResults, setSearchResults] = useState([]);

    const [playlistName, setPlaylistName] = useState("My PLayList");
    const [playlistTracks, setPlaylistTracks] = useState([]);

    const addTrack = (track) => {
        let tracks = playlistTracks;
        if (!tracks.find((playlist) => playlist.id === track.id)) {
            tracks.push(track);
            setPlaylistTracks([...tracks]);
        }
    };

    const removeTrack = (track) => {
        let tracks = playlistTracks.filter((item) => {
            return item.id !== track.id;
        });
        setPlaylistTracks([...tracks]);
    };

    const updatePlaylistName = (name) => {
        setPlaylistName(name);
    };

    const savePlaylist = () => {
        const trackUris = playlistTracks.map((track) => track.uri);
        Spotify.savePlaylist(playlistName, trackUris).then((res) => {
            setPlaylistName("New PLaylist");
            setPlaylistTracks([]);
            if (res.ok) {
                alert(
                    `${playlistName} successfuly added. Launch Spotify to listen to it!`
                );
            } else {
                alert("Something went wrong. Playlist not added.");
            }
        });
    };

    const search = (searchTerm) => {
        Spotify.search(searchTerm).then((results) => {
            setSearchResults(results);
        });
    };

    return (
        <div>
            <h1>
                Ja<span className="highlight">mmm</span>ing
            </h1>
            <div className="App">
                <SearchBar onSearch={search} />
                <div className="App-playlist">
                    <SearchResults
                        searchResults={searchResults}
                        onAdd={addTrack}
                    />
                    <Playlist
                        playlistName={playlistName}
                        playlistTracks={playlistTracks}
                        onRemove={removeTrack}
                        onNameChange={updatePlaylistName}
                        onSave={savePlaylist}
                    />
                </div>
            </div>
        </div>
    );
}
