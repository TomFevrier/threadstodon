<script>
	import { page } from '$app/stores';

	import { Editable } from '$lib/components';

	let createdAt;
	let metrics = null;

	export { createdAt as created_at };
	export { metrics as public_metrics };
	export let text;
	export let entities;
	export let attachments;
	export let user;
	export let threaded = false;
	export let first = false;
	export let last = false;
	export let editable = false;
	export let disableable = false;
	export let disabled = false;

	let active = false;

	const formatText = (text, entities = {}) => {
		let content = text
			.replace(/[\s\W]#([0-9]*)([A-Za-zÀ-ÖØ-öø-ÿ_]+)([0-9]*)/g, (tag) => `<span class='hashtag'>${tag}</span>`)
			.replace(/[\s\W]@(\w+)/g, (username) => `<span class='mention'>${username}</span>`)
			.replace(/\n/g, '<br />');

		const links = entities.urls ? entities.urls.filter((d) => !d.media_key) : [];
		const hashtags = entities.hashtags || [];
		const mentions = entities.mentions || [];

		links.forEach((link) => {
			content = content.replace(link.expanded_url, `<a href='${link.expanded_url}' target='_blank'>${link.expanded_url}</a>`);
		});

		hashtags.forEach(({ tag }) => {
			content = content.replace('#' + tag, `<span class='hashtag'>#${tag}</span>`);
		});

		mentions.forEach(({ username }) => {
			content = content.replace('@' + username, `<span class='mention'>@${username}</span>`);
		});

		return content;
	};
</script>

<div class='tweet' class:threaded class:first class:last class:active class:disabled>
	{#if user}
		<header>
			<figure class='portrait'>
				<img src={user.profile_image_url} alt='' />
				{#if disableable}
					<button on:click={() => disabled = !disabled}>
						<i class='fi fi-{disabled ? 'plus' : 'minus'}-a'></i>
					</button>
				{/if}
			</figure>
			<span class='user'>
				<span class='name' class:verified={user.verified}>
					{user.name}
				</span>
				<span class='username'>
					{user.username}
				</span>
			</span>
			<span class='creation-datetime'>
				{new Date(createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
				<br />
				{new Date(createdAt).toLocaleTimeString('fr-FR', { hour: 'numeric', minute: 'numeric' })}				
			</span>
		</header>
	{/if}
	<div class='content'>
		{#if editable}
			<p class='text'>
				<Editable
					bind:content={text}
					bind:editing={active}
					formatter={(text) => formatText(text, entities)} />
			</p>
		{:else}
			<p class='text'>
				{@html formatText(text, entities)}
			</p>
		{/if}
		{#if attachments}
			<div class='medias'>
				{#each attachments as media}
					{#if media.type === 'photo'}
						<img src={media.url} alt={media.alt_text || ''} />
					{:else if media.type === 'animated_gif'}
						<video src={media.url} alt={media.alt_text || ''} muted loop autoplay />
					{:else if media.type === 'video'}
						<video src={media.url} alt={media.alt_text || ''} controls />
					{/if}
				{/each}
			</div>
		{/if}
	</div>
	{#if metrics}
		<footer>
			<span class='metric replies'>
				<!-- <i class='fi fi-reply'></i> -->
				<b>{metrics.reply_count}</b> réponse{metrics.reply_count > 1 ? 's' : ''}
			</span>
			<span class='metric retweets'>
				<!-- <i class='fi fi-spinner-refresh'></i> -->
				<b>{metrics.retweet_count + metrics.quote_count}</b> retweet{metrics.retweet_count + metrics.quote_count > 1 ? 's' : ''}
			</span>
			<span class='metric likes'>
				<!-- <i class='fi fi-heart'></i> -->
				<b>{metrics.like_count}</b> like{metrics.like_count > 1 ? 's' : ''}
			</span>
		</footer>
	{/if}
</div>

<style lang='scss'>
	.tweet {
		width: 100%;
		padding: 1rem;
		position: relative;

		&.threaded {
			&::before {
				content: "";
				position: absolute;
				top: 0;
				left: 2.5rem;
				height: 100%;
				width: 2px;
				transform: translateX(-50%);
				background-color: dimgrey;

				@include sm {
					left: 2.25rem;
				}
			}

			&.first::before {
				top: 2.5rem;
				height: calc(100% - 2.5rem);
			}

			&.last::before {
				height: 2.5rem;
			}
		}

		&:hover, &.active {
			background-color: rgba(white, 0.1);
			cursor: pointer;
		}

		&.disabled {
			opacity: 0.5;
			pointer-events: none;
		}

		header {
			display: flex;
			gap: 0.5rem;
			width: 100%;

			.portrait {
				display: block;
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
				margin: 0;
				margin-right: 0.25rem;
				position: relative;
				overflow: hidden;
				background-color: $twitter;

				&::before {
					content: "\e9ad";
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					font-family: 'fontisto';
					font-size: 1.6rem;
					color: rgba(white, 0.5);
				}

				@include sm {
					width: 2.5rem;
					height: 2.5rem;

					&::before {
						font-size: 1.3rem;
					}
				}

				img {
					width: 100%;
					height: 100%;
					position: relative;
					z-index: 1;
				}

				button {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;

					display: flex;
					justify-content: center;
					align-items: center;
					
					font-size: 1.5rem;
					color: white;
					background-color: rgba($background, 0.5);
					opacity: 0;

					z-index: 2;

					pointer-events: all !important;
				}

				&:hover {
					button {
						opacity: 1;
					}
				}
			}

			.user {
				display: inline-flex;
				flex-direction: column;

				.name {
					font-weight: bold;

					&.verified {
						&::after {
							content: '✪';
							margin-left: 0.25rem;
						}
					}
				}

				.username {
					color: $dimmed-text;
					font-size: 0.9rem;

					&::before {
						content: "@";
					}

					@include sm {
						font-size: 0.8rem;
					}
				}
			}

			.creation-datetime {
				color: $dimmed-text;
				margin-left: auto;
				text-align: right;
				font-size: 0.9rem;

				line-height: 1.2;

				@include sm {
					display: none;
				}
			}
		}

		.content {
			padding-left: 3.75rem;
			display: flex;
			flex-direction: column;

			@include sm {
				padding-left: 3.25rem;
			}

			.text {
				margin: 0.5rem 0;

				:global(.hashtag), :global(.mention), :global(a) {
					color: cornflowerblue;
				}

				:global(a) {
					text-decoration: underline;
					font-weight: normal;
					cursor: pointer;
				}
			}

			.medias {
				margin: 0.5rem 0;

				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 2px;

				img {
					width: 100%;
					aspect-ratio: 16 / 9;
					object-fit: cover;

					&:first-child:last-child {
						grid-column: span 2;
					}
				}

				video {
					width: 100%;
					grid-column: span 2;
				}
			}
		}

		footer {
			padding-left: 4rem;
			display: flex;
			gap: 1rem;
			margin-top: 0.5rem;

			@include sm {
				padding-left: 3.5rem;
			}

			.metric {
				font-size: 0.9rem;
				color: $dimmed-text;
			}
		}
	}
</style>