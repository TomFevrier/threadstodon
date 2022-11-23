import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	event.locals = {
		twitterUser: JSON.parse(event.cookies.get('twitter_user_data') || null),
		mastodonUser: JSON.parse(event.cookies.get('mastodon_user_data') || null)
	};

	return await resolve(event);
}

export const handleError = ({ error }) => {
	console.error(error);
	throw redirect(302, '/');
}