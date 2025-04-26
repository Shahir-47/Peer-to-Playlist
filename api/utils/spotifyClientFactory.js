// utils/spotifyClientFactory.js
import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";
dotenv.config();

export function makeSpotifyClient({ access_token, refresh_token }) {
	const client = new SpotifyWebApi({
		clientId: process.env.SPOTIFY_CLIENT_ID,
		clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
		redirectUri: process.env.SPOTIFY_REDIRECT_URI,
	});

	client.setAccessToken(access_token);
	client.setRefreshToken(refresh_token);

	return client;
}
