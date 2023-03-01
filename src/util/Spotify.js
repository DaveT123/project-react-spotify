const clientId = "57714d0dd7224f2eae8d68992a4d9b74";
// when deploying to github pages
const redirectUri = "https://davet123.github.io/project-react-spotify/";
// when working on localhost
// const redirectUri = "http://localhost:3000/";
let accessToken;

const Spotify = {
    getAccessToken() {
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
            window.history.pushState(
                "Access Token",
                null,
                "/project-react-spotify/"
            );
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },
    async search(term) {
        try {
            const accessToken = Spotify.getAccessToken();
            const response = await fetch(
                `https://api.spotify.com/v1/search?type=track&q=${term}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const data = await response.json();

            if (!data.tracks) {
                return [];
            }

            let result = data.tracks.items.map((track) => ({
                id: track.id,
                name: track.name,
                artists: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
            }));

            return result;
        } catch (err) {
            console.log(err);
        }
    },
    async savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        const response = await fetch("https://api.spotify.com/v1/me", {
            headers: headers,
        });
        const data = await response.json();
        userId = data.id;

        const responsePlaylists = await fetch(
            `https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ name: name }),
            }
        );
        const dataPlaylists = await responsePlaylists.json();
        const playlistId = dataPlaylists.id;

        const responseTracks = await fetch(
            `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
            {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ uris: trackUris }),
            }
        );

        return responseTracks;
    },
};

export default Spotify;
