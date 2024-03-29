import "./App.css";
import React, { useEffect, useState } from "react";
import { SearchResults } from "../SearchResults/SearchResults";
import { SearchBar } from "../SearchBar/SearchBar";
import { Playlist } from "../Playlist/Playlist";

import Spotify from "../../util/Spotify";

export default function App() {
    const [searchResults, setSearchResults] = useState([]);

    const [playlistName, setPlaylistName] = useState("New PLayList");
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

    const savePlaylist = async () => {
        const trackUris = playlistTracks.map((track) => track.uri);
        const result = await Spotify.savePlaylist(playlistName, trackUris);

        if (result.ok) {
            alert(
                `${playlistName} successfuly added. Launch Spotify to listen to it!`
            );
        } else {
            alert("Something went wrong. Playlist not added.");
        }

        setPlaylistName("New PLaylist");
        setPlaylistTracks([]);
    };

    const search = async (searchTerm) => {
        const result = await Spotify.search(searchTerm);
        setSearchResults(result);
    };

    useEffect(() => {
        Spotify.getAccessToken();
    }, []);

    return (
        <div>
            <h1>
                Spotify<span className="highlight"> Playlist </span>App
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
