import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

import { TwitterApi } from 'twitter-api-v2';

import { sessions } from '$lib/stores';


export const GET = async ({ url: { searchParams, origin }, cookies }) => {
	const code = searchParams.get('code');
	const state = searchParams.get('state');
	
	if (!state || !code) {
		throw redirect(302, '/');
	}

	const sessionId = cookies.get('session_id');

	const { codeVerifier, state: sessionState } = get(sessions)[sessionId];

	if (state !== sessionState) {
		throw redirect(302, '/');
	}

	const client = new TwitterApi({ clientId: import.meta.env.VITE_TWITTER_CLIENT_ID });

	const callbackUrl = new URL('/auth/twitter/callback', origin).toString();

	const {
		client: loggedClient,
		accessToken,
		expiresIn
	} = await client.loginWithOAuth2({
		code,
		codeVerifier,
		redirectUri: callbackUrl
	});

	const { data: user } = await loggedClient.v2.me({
		'user.fields': 'id,username,name,verified,profile_image_url,public_metrics'
	});
	
	cookies.set('twitter_access_token', accessToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: import.meta.env.PROD,
		maxAge: expiresIn
	});

	cookies.set('twitter_user_data', JSON.stringify(user), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: import.meta.env.PROD,
		maxAge: expiresIn
	});

	throw redirect(302, '/');
}