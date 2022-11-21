import { redirect } from '@sveltejs/kit';
import { TwitterApi } from 'twitter-api-v2';

import { sessions } from '$lib/stores';


export const GET = async ({ url: { origin }, cookies }) => {
	const callbackUrl = new URL('/auth/twitter/callback', origin).toString();

	const client = new TwitterApi({ clientId: import.meta.env.VITE_TWITTER_CLIENT_ID });

	const { url, codeVerifier, state } = client.generateOAuth2AuthLink(callbackUrl, {
		scope: ['tweet.read', 'users.read']
	});

	const sessionId = crypto.randomUUID();

	cookies.set('session_id', sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: import.meta.env.PROD,
		maxAge: 300
	});

	sessions.update((sessions) => ({
		...sessions,
		[sessionId]: { codeVerifier, state }
	}));

	throw redirect(302, url);
}