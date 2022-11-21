import { redirect } from '@sveltejs/kit';

import Mastodon from 'mastodon-api';


export const GET = async ({ url: { searchParams, origin }, cookies }) => {
	const code = searchParams.get('code');

	const callbackUrl = new URL('/auth/mastodon/callback', origin).toString();

	const instanceDomain = cookies.get('mastodon_domain');

	const accessToken = await Mastodon.getAccessToken(
		import.meta.env.VITE_MASTODON_CLIENT_ID,
		import.meta.env.VITE_MASTODON_CLIENT_SECRET,
		code,
		instanceDomain,
		callbackUrl
	);
	
	const M = new Mastodon({
		access_token: accessToken,
		api_url: `${instanceDomain}/api/v1/`
	});
	
	const { data: userData } = await M.get('accounts/verify_credentials');
	
	const user = {
		id: userData.id,
		username: userData.username,
		name: userData.display_name,
		url: userData.url,
		profile_image_url: userData.avatar_static,
		public_metrics: {
			followers_count: userData.followers_count,
			following_count: userData.following_count,
			tweet_count: userData.statuses_count
		}
	};
	
	cookies.set('mastodon_access_token', accessToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: import.meta.env.PROD,
		maxAge: 7200
	});

	cookies.set('mastodon_user_data', JSON.stringify(user), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: import.meta.env.PROD,
		maxAge: 7200
	});

	throw redirect(302, '/');
}