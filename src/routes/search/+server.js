import { json, error } from '@sveltejs/kit';

import { TwitterApi } from 'twitter-api-v2';
import latinize from 'latinize';
import { utcFormat } from 'd3-time-format';

import { attachMedia } from '$lib/utils';


// Suppression des accents et normalisation des apostrophes
const normalize = (str) => latinize(str).replace(/[\u02BC\u2019]/g, '\'');

export const GET = async ({ cookies, url: { searchParams }, locals }) => {
	const accessToken = cookies.get('twitter_access_token');

	if (!accessToken) {
		throw error(401);
	}

	const query = searchParams.get('query') || '';
	const keywords = query.split(' ');
	const regex = new RegExp(keywords.map((keyword) => `(?=.*${normalize(keyword)})`).join(''), 'i');

	const conversationId = searchParams.get('conversation_id') || null;
	const startTime = searchParams.get('start_time')
		|| utcFormat('%Y-%m-%dT%H:%M:%SZ')(new Date('2010-11-06'));
	const endTime = searchParams.get('end_time')
		|| utcFormat('%Y-%m-%dT%H:%M:%SZ')(new Date());

	if (!query && !conversationId) {
		throw error(400);
	}

	const user = locals.twitterUser;

	const client = new TwitterApi(accessToken);

	const tweets = [];

	let timeline = await client.v2.userTimeline(user.id, {
		exclude: 'retweets,replies',
		start_time: startTime,
		end_time: endTime,
		max_results: 100,
		expansions: 'attachments.media_keys',
		'tweet.fields': 'id,text,created_at,attachments,entities,conversation_id,in_reply_to_user_id,public_metrics',
		'media.fields': 'type,url,preview_image_url,alt_text'
	});

	const start = new Date();

	do {
		/*
		Tant qu’on a trouvé moins de 5 tweets ET qu’il s’est écoulé moins de 5 sec,
		on parcourt les tweets et on filtre ceux qui correspondent aux termes de recherche
		*/
		const filteredTweets = await Promise.all(timeline.tweets
			.filter((t) => {
				// Dans le cas où on recherche les tweets suivants dans un thread
				if (conversationId) {
					return t.conversation_id === conversationId && t.in_reply_to_user_id === user.id;
				}

				// Dans le cas où on recherche les tweets correspondant à des mots-clés
				return !t.in_reply_to_user_id && regex.test(normalize(t.text));
			})
			.map((t) => attachMedia(t, timeline.includes))
		);
		tweets.push(...filteredTweets);
		timeline = await timeline.next();
	} while (!timeline.done && tweets.length < 5 && new Date().getTime() - start.getTime() < 5000);

	return json(tweets);
}