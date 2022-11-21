import { redirect } from '@sveltejs/kit';

import Mastodon from 'mastodon-api';


export const login = async ({ request, url: { origin }, cookies }) => {
	const formData = await request.formData();

	const instanceDomain = `https://${formData.get('mastodon-address').split('@')[1]}`;

	const callbackUrl = new URL('/auth/mastodon/callback', origin).toString();

	const url = await Mastodon.getAuthorizationUrl(
		import.meta.env.VITE_MASTODON_CLIENT_ID,
		import.meta.env.VITE_MASTODON_CLIENT_SECRET,
		instanceDomain,
		'read:accounts write:media write:statuses',
		callbackUrl
	);

	cookies.set('mastodon_domain', instanceDomain, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: import.meta.env.PROD,
		maxAge: 7200
	});

	throw redirect(302, url);
}

export const actions = {
	default: login
};