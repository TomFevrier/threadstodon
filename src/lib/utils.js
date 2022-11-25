import { TwitterApi } from 'twitter-api-v2';
import { greatest } from 'd3-array';


export const attachMedia = async (tweet, includes) => {
	const appClient = new TwitterApi(import.meta.env.VITE_TWITTER_BEARER_TOKEN);

	const urls = tweet.entities?.urls || [];
	const medias = urls.filter((d) => d.media_key);
	const links = urls.filter((d) => !d.media_key);

	// On supprime les URLs des médias du texte des tweets
	medias.forEach((media) => {
		tweet.text = tweet.text.replace(media.url, '');
	});

	// On remplace les URLs raccourcies de Twitter par les URLs complètes
	links.forEach((link) => {
		tweet.text = tweet.text.replace(link.url, link.expanded_url);
	});

	if (!tweet.attachments?.media_keys) {
		return tweet;
	}

	return {
		...tweet,
		attachments: await Promise.all(tweet.attachments.media_keys.map(async (key) => {
			const attachment = includes.media.find(({ media_key }) => media_key === key);

			if (!attachment || attachment.type === 'photo') {
				return attachment;
			}
			// Pour les GIFs, on reconstruit l’URL à partir de l’URL de la miniature
			else if (attachment.type === 'animated_gif') {
				const videoId = attachment.preview_image_url.split('/').at(-1).split('.')[0];

				return {
					...attachment,
					url: `https://video.twimg.com/tweet_video/${videoId}.mp4`
				};
			}

			// Pour récupérer l’URL d'une vidéo, on est obligé de passer par la V1 de l’API
			const { extended_entities: { media } } = await appClient.v1.singleTweet(tweet.id, {
				include_entities: true
			});

			const video = greatest(media[0].video_info.variants, (d) => d.bitrate);
			
			return {
				...attachment,
				url: video.url
			}
		}))
	};
}


export const typografix = (tweet) => {
	return {
		...tweet,
		text: tweet.text
			.replace(/«\s/g, '«\u00A0')
			.replace(/\s»/g, '\u00A0»')
	};
}