import spotifyApi from "../config/spotify.js";

// In‐memory store of pending states
const pendingStates = new Set();

export const spotifyLogin = (req, res) => {
	const state = Math.random().toString(36).slice(2);

	pendingStates.add(state); // Store the state for verification

	const scopes = [
		"user-read-private",
		"user-read-email",
		"user-top-read",
		"user-library-read",
		"user-follow-read",
	];

	const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state, true);

	res.json({ url: authorizeURL }); // Send the URL to the client
};

export const spotifyCallback = async (req, res) => {
	const { code, state } = req.query;
	console.log("← Returned state:", state);

	// Verify the state was one we issued
	if (!state || !pendingStates.has(state)) {
		return res.send(`
        <script>
          window.opener.postMessage(
            { type: "spotify-error", error: "Invalid or expired state" },
            window.location.origin
          );
          window.close();
        </script>
      `);
	}
	// Consume it so it can't be reused
	pendingStates.delete(state);

	if (!code) {
		return res.send(`<script>window.close()</script>`);
	}

	try {
		// Exchange code for tokens
		const data = await spotifyApi.authorizationCodeGrant(code);
		console.log("🎉 Tokens:", data.body);

		// Send them back to the popup
		res.send(`
        <script>
          window.opener.postMessage(
            { type: "spotify", payload: ${JSON.stringify(data.body)} },
            "*"
          );
          window.close();
        </script>
      `);
	} catch (err) {
		console.error("Spotify token exchange error:", err);
		res.send(`
        <script>
          window.opener.postMessage(
            { type: "spotify-error", error: "Auth failed" },
            window.location.origin
          );
          window.close();
        </script>
      `);
	}
};
