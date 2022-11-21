import { redirect } from '@sveltejs/kit';

import { TwitterApi } from 'twitter-api-v2';
import { uniqBy } from 'lodash-es';

import { attachMedia } from '$lib/utils';


export const load = async ({ params, cookies, locals }) => {	
	const accessToken = cookies.get('twitter_access_token');

	if (!accessToken) {
		throw redirect(302, '/');
	}

	const user = locals.twitterUser;

	const { tweetId } = params;

	const client = new TwitterApi(accessToken);

	const { data: firstTweet } = await client.v2.singleTweet(tweetId, {
		'tweet.fields': 'id,created_at,conversation_id',
	});

	const timeline = await client.v2.userTimeline(user.id, {
		exclude: 'retweets',
		start_time: new Date(firstTweet.created_at).toISOString().slice(0, -5) + 'Z',
		end_time: new Date(new Date(firstTweet.created_at).getTime() + 2 * 86_400_000).toISOString().slice(0, -5) + 'Z',
		max_results: 100,
		expansions: 'attachments.media_keys',
		'tweet.fields': 'id,text,created_at,attachments,entities,conversation_id,in_reply_to_user_id',
		'media.fields': 'type,url,preview_image_url,alt_text'
	});

	const { tweets, includes } = await timeline.fetchLast();

	const thread = await Promise.all(uniqBy(tweets, 'id')
		.filter((t) => {
			return t.conversation_id === firstTweet.conversation_id
				&& (!t.in_reply_to_user_id || t.in_reply_to_user_id === user.id);
		})
		.sort((a, b) => a.id.localeCompare(b.id))
		.map((t) => attachMedia(t, includes))
	);

	return {
		user,
		thread
	};
}