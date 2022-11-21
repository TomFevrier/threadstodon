
import { json } from '@sveltejs/kit';

import Mastodon from 'mastodon-api';
import https from 'https';


export const POST = async ({ request, cookies, locals }) => {
	const thread = await request.json();

	const user = locals.mastodonUser;
	const accessToken = cookies.get('mastodon_access_token');
	const instanceDomain = cookies.get('mastodon_domain');

	const M = {
		v1: new Mastodon({
			access_token: accessToken,
			api_url: `${instanceDomain}/api/v1/`
		}),
		v2: new Mastodon({
			access_token: accessToken,
			api_url: `${instanceDomain}/api/v2/`
		})
	};

	const getMediaStream = async (url) => {
		return new Promise((resolve) => {
			https.get(url, (stream) => resolve(stream))
		});
	}
	
	const waitForImageProcessing = async (id) => {
		return new Promise((resolve) => {
			const interval = setInterval(async () => {
				const { data: { url } } = await M.v1.get(`media/${id}`);
				
				if (url) {
					clearInterval(interval);
					resolve(id);
				}
			}, 100);
		});
	}

	let prevTootId = null;
	let firstTootId = null;
	
	for (const tweet of thread.filter((d) => !d.disabled)) {
		const media = tweet.attachments || []; 
		const mediaIds = await Promise.all(media.map(async (attachment) => {
			const stream = await getMediaStream(attachment.url);

			const { data: { id: mediaId } } = await M.v2.post('media', {
				file: stream,
				description: attachment.alt_text || ''
			});
			
			return waitForImageProcessing(mediaId);
		}));

		const { data: { id } } = await M.v1.post('statuses', {
			status: tweet.text,
			...(prevTootId ? { in_reply_to_id: prevTootId } : {}),
			media_ids: mediaIds,
			visibility: import.meta.env.VITE_TOOT_VISIBILITY || 'direct'
		});

		if (!firstTootId) {
			firstTootId = id;
		}

		prevTootId = id;
	}

	return json({
		url: [user.url, firstTootId].join('/')
	});
}