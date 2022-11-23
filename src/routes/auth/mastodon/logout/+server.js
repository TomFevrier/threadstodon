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
		cookies.get('mastodon_client_id'),
		cookies.get('mastodon_client_secret'),
		cookies.get('mastodon_access_token'),
		cookies.get('mastodon_domain')
	);
	
	cookies.delete('mastodon_domain', {
		path: '/'
	});

	cookies.delete('mastodon_client_id', {
		path: '/'
	});

	cookies.delete('mastodon_client_secret', {
		path: '/'
	});

	cookies.delete('mastodon_access_token', {
		path: '/'
	});

	cookies.delete('mastodon_user_data', {
		path: '/'
	});

	throw redirect(302, '/');
}