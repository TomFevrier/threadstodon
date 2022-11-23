<script>
	import { page } from '$app/stores';
	
	import { Loader, TextInput, Tweet } from '$lib/components';


	$: ({ twitterUser, mastodonUser } = $page.data);

	let query;
	let tweets = null;
	let isLoading = false;
	let isThereMoreTweets = true;

	const searchTweets = async ({ expand = false }) => {
		if (!query || !query.trim()) return;

		if (/http[s]:\/\/twitter.com\/\w+\/status\/\d+/i.test(query)) {
			if (!new RegExp(twitterUser.username, 'i').test(query)) return;

			const tweetId = query.match(/status\/\d+/i)[0].split('/')[1];
			
			window.location = `/edit/${tweetId}`;
		}

		isLoading = true;
		if (expand) {
			const newTweets = await fetch(`/search?query=${query}&end_time=${tweets.at(-1).created_at}`).then((r) => r.json());
			if (newTweets.length === 0) {
				isThereMoreTweets = false;
			}
			tweets = [...tweets, ...newTweets];
		}
		else {
			isThereMoreTweets = true;
			tweets = [];
			tweets = await fetch(`/search?query=${query}`).then((r) => r.json());
		}

		isLoading = false;
	}
</script>


<ul class='login' class:active={twitterUser && mastodonUser}>
	<li class='badge twitter' class:active={!!twitterUser}>
		{#if !twitterUser}
			<a href='/auth/twitter/login' title='Se connecter via Twitter'>
				<img class='logo' src='icons/twitter.svg' alt='' />
			</a>
		{:else}
			<a href='/auth/twitter/logout' title='Révoquer l’accès à Twitter'>
				<img class='portrait' src={twitterUser.profile_image_url} alt='' />
				<i class='fi fi-close-a'></i>
			</a>
		{/if}
	</li>
	<li class='badge mastodon' class:active={!!mastodonUser}>
		{#if !mastodonUser}
			<a href='/auth/mastodon/login' title='Se connecter via Mastodon'>
				<img class='logo' src='icons/mastodon.svg' alt='' />
			</a>
		{:else}
			<a href='/auth/mastodon/logout' title='Révoquer l’accès à Mastodon'>
				<img class='portrait' src={mastodonUser.profile_image_url} alt='' />
				<i class='fi fi-close-a'></i>
			</a>
		{/if}
	</li>
</ul>
{#if twitterUser && mastodonUser}
	<form on:submit|preventDefault={() => document.activeElement.blur()}>
		<TextInput
			id='search-bar'
			placeholder='Rechercher un thread ou copier-coller une URL'
			icon='search'
			bind:value={query}
			on:submit={searchTweets} />
	</form>
{/if}
<div class='results'>
	{#if tweets && tweets.length > 0}
		<ul class='tweet-list'>
			{#each tweets as tweet (tweet.id)}
				<li>
					<a href='/edit/{tweet.id}'>
						<Tweet {...tweet} user={twitterUser} />
					</a>
				</li>
			{/each}
		</ul>
	{/if}
	{#if isLoading}
		<Loader />
	{:else if tweets && tweets.length > 0 && isThereMoreTweets}
		<button id='more-tweets' on:click={() => searchTweets({ expand: true })}>
			<i class='fi fi-plus-a'></i>
			Plus de tweets
		</button>
	{:else if tweets && tweets.length === 0}
		<p class='info'>
			Il n’y a rien à afficher.
		</p>
	{/if}
</div>

<style lang='scss'>
	.login {
		display: flex;
		justify-content: space-between;
		width: 12rem;
		position: relative;

		&::before {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: calc(100% - 3rem);
			height: 1rem;
			opacity: 0.5;
			z-index: -1;
			background: linear-gradient(to right, grey, grey 50%, transparent 50%, transparent);
			background-size: 0.5rem 0.5rem;
		}

		&.active::before {
			animation: transfering 0.5s linear infinite;

			@keyframes transfering {
				from {
					background:
						linear-gradient(225deg, $mastodon 25%, transparent 25%),
						linear-gradient(315deg, $mastodon 25%, transparent 25%),
						linear-gradient(45deg, $mastodon 25%, transparent 25%) 0 0.5rem,
						linear-gradient(135deg, $mastodon 25%, transparent 25%) 0 0.5rem;
					background-size: 1rem 1rem;
					background-color: $twitter;
				}
				to {
					background:
						linear-gradient(225deg, $mastodon 25%, transparent 25%) 1rem 0,
						linear-gradient(315deg, $mastodon 25%, transparent 25%) 1rem 0,
						linear-gradient(45deg, $mastodon 25%, transparent 25%) 1rem 0.5rem,
						linear-gradient(135deg, $mastodon 25%, transparent 25%) 1rem 0.5rem;
					background-size: 1rem 1rem;
					background-color: $twitter;
				}
			}
		}

		.badge {
			width: 3rem;
			height: 3rem;
			border-radius: 50%;
			border: 4px solid transparent;
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			cursor: pointer;
			transition: all 100ms ease-out;

			.fi-close-a {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 1.2rem;
				opacity: 0;
				z-index: 3;
			}

			.portrait {
				display: block;
				width: 100%;
				height: 100%;
				border-radius: 50%;
				position: relative;
				z-index: 1;
			}

			.logo {
				display: block;
			}

			&.twitter {
				background-color: $twitter;
				border-color: $twitter;

				&::after {
					background-color: $twitter;
				}

				.logo {
					width: 24px;
				}
			}

			&.mastodon {
				background-color: $mastodon;
				border-color: $mastodon;

				&::after {
					background-color: $mastodon;
				}

				.logo {
					width: 30px;
				}
			}

			&.active {
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

				&::after {
					content: "";
					position: absolute;
					inset: 0;
					z-index: 2;
					opacity: 0;
				}
			}

			&:hover {
				transform: scale(1.1);

				.fi-close-a {
					opacity: 1;
				}

				&::after {
					opacity: 0.5;
				}
			}
		}
	}

	form {
		width: 100%;
		max-width: 25rem;
		margin: 1rem 0 2rem;
	}

	.results {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		.tweet-list {
			display: flex;
			flex-direction: column;
			gap: 1rem;

			a {
				all: unset;
				cursor: pointer;
			}
		}

		.info {
			font-size: 0.9rem;
			color: $dimmed-text;
			text-align: center;
		}

		#more-tweets {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 0.9rem;
			color: $dimmed-text;
			margin: 1rem;

			.fi {
				font-size: 1.5rem;
				margin: 2px;
			}
		}
	}
</style>