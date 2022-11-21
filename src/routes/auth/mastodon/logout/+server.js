import { redirect } from '@sveltejs/kit';

import Mastodon from 'mastodon-api';


Mastodon.revokeAccessToken = async (clientId, clientSecret, token, instanceDomain) => {
	const formData = new FormData();
	formData.append('client_id', clientId);
	formData.append('client_secret', clientSecret);
	formData.append('token', token);

	return fetch([instanceDomain, 'oauth/revoke'].join('/'), {
		method: 'POST',
		body: formData
	});
}

export const GET = async ({ cookies }) => {
	await Mastodon.revokeAccessToken(
		import.meta.env.VITE_MASTODON_CLIENT_ID,
		import.meta.env.VITE_MASTODON_CLIENT_SECRET,
		cookies.get('mastodon_access_token'),
		cookies.get('mastodon_domain')
	);

	cookies.delete('mastodon_access_token', {
		path: '/'
	});

	cookies.delete('mastodon_user_data', {
		path: '/'
	});

	cookies.delete('mastodon_domain', {
		path: '/'
	});

	throw redirect(302, '/');
}