<script>
	import { page } from '$app/stores';

	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	import { Tweet } from '$lib/components';

	$: ({ thread, user } = $page.data);

	let threadURL;
	let isTooting = false;

	const tootThread = async () => {
		if (isTooting) return;

		isTooting = true;

		const { url } = await fetch('/toot', {
			method: 'POST',
			body: JSON.stringify(thread)
		}).then((r) => r.json());

		isTooting = false;
		threadURL = url;
	}
</script>

<ul class='tutorial'>
	<li>
		Tu peux cliquer sur un tweet pour éditer le texte, ou désactiver/réactiver un tweet en cliquant sur la photo de profil.
	</li>
	<li>
		Quand tu te sens prêt⋅e, clique sur <b>Pouet !</b>
	</li>
</ul>
<ul class='thread'>
	{#each thread as tweet, i (tweet.id)}
		<li>
			<Tweet
				{...tweet} {user}
				threaded={thread.length > 1}
				first={i === 0}
				editable disableable
				bind:text={tweet.text}
				bind:disabled={tweet.disabled} />
		</li>
	{/each}
</ul>
<div id='toot-btn-wrapper'>
	<button on:click={tootThread} disabled={!!threadURL}>
		{#if threadURL}
			<i class='fi fi-check'></i>
		{:else if isTooting}
			<i class='fi fi-circle-o-notch'></i>
		{:else}
			<i class='fi fi-paper-plane'></i>
		{/if}
		Pouet !
	</button>
	{#if threadURL}
		<div class='tooltip' transition:fly={{ y: 50, duration: 600, easing: cubicOut }}>
			<p>
				{#if thread?.length === 1}
					Ton pouet est en ligne ! 👇🏾
				{:else}
					Ton thread est en ligne ! 👇🏾
				{/if}
				<br />
				<a href={threadURL} target='blank'>{threadURL}</a>
			</p>
		</div>
	{/if}
</div>

<style lang='scss'>
	.tutorial {
		width: 100%;
		max-width: 20rem;
		margin: 0 auto;

		li {
			margin: 1rem 0;
			padding-left: 1.5rem;
			position: relative;

			&::before {
				content: "\e977";
				font-family: 'fontisto';
				position: absolute;
				top: 0;
				left: 0;
			}
		}
	}

	.thread {
		display: flex;
		flex-direction: column;
		position: relative;
		margin-bottom: 2rem;
	}

	#toot-btn-wrapper {
		position: fixed;
		bottom: 2rem;
		right: 3rem;
		z-index: 42;

		@include lg {
			position: sticky;
			right: 50%;
			transform: translateX(50%);
		}

		button {
			height: 3rem;
			padding-inline: 2rem;
			border-radius: 1.5rem;
			background-color: $mastodon;

			&[disabled] {
				cursor: auto;
			}

			&:not([disabled]):hover {
				color: $mastodon;
				background-color: white;
			}

			font-weight: bold;
			font-size: 1.1rem;

			.fi {
				margin-right: 0.5rem;
			}

			.fi-circle-o-notch {
				animation: spin 1s linear infinite;

				@keyframes spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
			}
		}

		.tooltip {
			position: absolute;
			top: 0;
			left: 50%;
			transform: translate(-50%, calc(-100% - 1rem));
			min-width: 200px;
			padding: 0.5rem;
			border-radius: 0.25rem;
			color: black;
			background-color: rgba(white, 0.8);
			backdrop-filter: blur(2px);
			z-index: -1;
			cursor: auto;

			&::after {
				content: "";
				position: absolute;
				top: 100%;
				left: 50%;
				transform: translateX(-50%);
				border-width: 0.5rem;
				border-style: solid;
				border-color: rgba(white, 0.8) transparent transparent transparent;
			}

			p {
				margin: 0;
				font-size: 1rem;

				a {
					text-decoration: underline;
					color: $mastodon;
				}
			}

		}
	}
</style>