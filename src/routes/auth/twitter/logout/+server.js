import { redirect } from '@sveltejs/kit';

import { TwitterApi } from 'twitter-api-v2';


export const GET = async ({ cookies }) => {
	const client = new TwitterApi({ clientId: import.meta.env.VITE_TWITTER_CLIENT_ID });

	await client.revokeOAuth2Token(cookies.get('twitter_access_token'));

	cookies.delete('twitter_access_token', {
		path: '/'
	});

	cookies.delete('twitter_user_data', {
		path: '/'
	});

	throw redirect(302, '/');
}