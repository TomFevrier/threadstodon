import { redirect } from '@sveltejs/kit';

import Mastodon from 'mastodon-api';


const SCOPES = 'read:accounts write:media write:statuses';

export const login = async ({ request, url: { origin }, cookies }) => {
	const formData = await request.formData();

	const instanceDomain = `https://${formData.get('mastodon-address').split('@')[1]}`;

	const callbackUrl = new URL('/auth/mastodon/callback', origin).toString();

	const {
		client_id: clientId,
		client_secret: clientSecret
	} = await Mastodon.createOAuthApp(
		`${instanceDomain}/api/v1/apps`,
		'Threadstodon',
		SCOPES,
		callbackUrl
	);

	console.log(clientId, clientSecret)

	const url = await Mastodon.getAuthorizationUrl(
		clientId,
		clientSecret,
		instanceDomain,
		SCOPES,
		callbackUrl
	);

	cookies.set('mastodon_domain', instanceDomain, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: import.meta.env.PROD,
		maxAge: 7200
	});

	cookies.set('mastodon_client_id', clientId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: import.meta.env.PROD,
		maxAge: 7200
	});

	cookies.set('mastodon_client_secret', clientSecret, {
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