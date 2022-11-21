import { json, redirect } from '@sveltejs/kit';

import { TwitterApi } from 'twitter-api-v2';
import latinize from 'latinize';

import { attachMedia } from '$lib/utils';


// Suppression des accents et normalisation des apostrophes
const normalize = (str) => latinize(str).replace(/[\u02BC\u2019]/g, '\'');

const noReplies = (t) => !t.in_reply_to_user_id;


export const GET = async ({ cookies, url: { searchParams }, locals }) => {
	const accessToken = cookies.get('twitter_access_token');

	if (!accessToken) {
		throw redirect(302, '/');
	}

	const query = searchParams.get('query');

	const user = locals.twitterUser;

	const client = new TwitterApi(accessToken);


	const keywords = query.split(' ');
	const regex = new RegExp(keywords.map((keyword) => `(?=.*${normalize(keyword)})`).join(''), 'i');

	const endTime = searchParams.get('end_time') || new Date().toISOString().slice(0, -5) + 'Z';

	const tweets = [];

	if (!query) {
		return json(tweets);
	}

	let timeline = await client.v2.userTimeline(user.id, {
		exclude: 'retweets,replies',
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
				return noReplies(t) && regex.test(normalize(t.text))
			})
			.map((t) => attachMedia(t, timeline.includes))
		);
		tweets.push(...filteredTweets)
		timeline = await timeline.next();
	} while (!timeline.done && tweets.length < 5 && new Date().getTime() - start.getTime() < 5000);

	return json(tweets.sort((a, b) => b.public_metrics.retweet_count - a.public_metrics.retweet_count));
}