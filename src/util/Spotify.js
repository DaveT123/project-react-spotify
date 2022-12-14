const clientId = "57714d0dd7224f2eae8d68992a4d9b74";
const redirectUri = "https://davet123.github.io/project-react-spotify/";
let accessToken;

const Spotify = {
    getAccessToken(logIn = false) {
        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch =
            window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // clear parameters, grab new access token when it expires
            window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
            window.history.pushState("Access Token", null, "/");
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            if (!logIn) {
                window.location = accessUrl;
            }
        }
    },
    search(term) {
        const accessToken = Spotify.getAccessToken(true);
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((jsonRes) => {
                if (!jsonRes.tracks) {
                    return [];
                }
                return jsonRes.tracks.items.map((track) => ({
                    id: track.id,
                    name: track.name,
                    artists: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                }));
            });
    },
    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch("https://api.spotify.com/v1/me", {
            headers: headers,
        })
            .then((res) => res.json())
            .then((jsonRes) => {
                userId = jsonRes.id;
                return fetch(
                    `https://api.spotify.com/v1/users/${userId}/playlists`,
                    {
                        headers: headers,
                        method: "POST",
                        body: JSON.stringify({ name: name }),
                    }
                )
                    .then((res) => res.json())
                    .then((jsonRes) => {
                        const playlistId = jsonRes.id;
                        return fetch(
                            `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                            {
                                headers: headers,
                                method: "POST",
                                body: JSON.stringify({ uris: trackUris }),
                            }
                        );
                    });
            });
    },
};

export default Spotify;
