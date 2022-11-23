<script>
	import { navigating, page } from '$app/stores';

	import { Loader } from '$lib/components';

	$: ({ route } = $page);
</script>

<svelte:head>
	<title>Threadstodon</title>
</svelte:head>

<header>
	<a href='/'>
		<h1>Threadstodon</h1>
	</a>
	{#if !$navigating && route.id === '/'}
		<h2>
			Reposte facilement tes meilleurs fils&nbsp;Twitter sur&nbsp;Mastodon&nbsp;!
		</h2>
		<a href='/about' id='about'>
			<p>Comment ça marche ?</p>
		</a>
	{/if}
</header>
{#if $navigating}
	<Loader fixed />
{:else}
	<main>
		<slot />
	</main>
	<footer>
		<span id='copyright'>
			© {new Date().getFullYear()} - <a href='https://tomfevrier.io'>Tom Février</a>
		</span>
		<ul id='socials'>
			<li id='github'>
				<a href='https://github.com/TomFevrier' target='_blank' rel='noreferrer'>
					<i class='fi fi-github'></i>
				</a>
			</li>
			<li id='mastodon'>
				<a href='https://mastodon.social/@tomfevrier' target='_blank' rel='noreferrer'>
					<img src='/icons/mastodon.svg' alt='' />
				</a>
			</li>
			<li id='twitter'>
				<a href='https://twitter.com/TomFevrier' target='_blank' rel='noreferrer'>
					<i class='fi fi-twitter'></i>
				</a>
			</li>
		</ul>
	</footer>
{/if}


<style lang='scss'>
	:global(body) {
		color: white;
		background-color: $background;
	}

	header {
		width: 100%;
		max-width: 20rem;
		padding: 3rem 0.5rem 2rem;
		margin: 0 auto;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		h1 {
			display: table;
			font: 2.5rem 'Assistant', sans-serif;
			text-align: center;
			padding-inline: 0.5rem;
			margin: 0;
			position: relative;

			@include sm {
				font-size: 2rem;
			}

			&::before {
				content: "";
				position: absolute;
				bottom: 0.5rem;
				left: 0;
				width: 100%;
				height: 1rem;
				border-radius: 0.5rem;
				opacity: 0.5;
				z-index: -1;
				background: linear-gradient(45deg, $mastodon, $twitter);
				background-size: 200% 100%;
				animation: switch-color 4s ease-in-out infinite;

				@keyframes switch-color {
					0% {
						background-position: 0 0;
					}

					50% {
						background-position: 100% 0;
					}

					100% {
						background-position: 0 0;
					}
				}
			}
		}

		h2 {
			width: 100%;
			text-align: center;
			margin: 0;
			font: bold 1.2rem 'Source Sans Pro', sans-serif;

			@include sm {
				font-size: 1.1rem;
			}
		}

		#about {
			display: table;

			p {
				position: relative;
				padding-left: 1.5rem;
				margin: 0.5rem 0;
				color: $dimmed-text;

				&::before {
					content: "\e977";
					font-family: 'fontisto';
					position: absolute;
					top: 0;
					left: 0;
				}

				&:hover {
					color: white;
				}
			}
		}
	}
	
	main {
		width: 100%;
		max-width: 32rem;
		margin: 0 auto;
		padding: 1rem;
		padding-bottom: 6rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	footer {
		position: absolute;
		bottom: 0.5rem;
		left: 50%;
		transform: translateX(-50%);
		
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;

		#copyright {
			font-size: 0.9rem;
			color: $dimmed-text;
			white-space: nowrap;
		}

		#socials {
			display: flex;
			justify-content: center;
			gap: 0.5rem;

			li {
				font-size: 1.1rem;
				color: $dimmed-text;

				&#mastodon img {
					display: inline-block;
					filter: brightness(66%);
					width: 1.4rem;
				}

				&:hover {
					color: white;

					&#mastodon img {
						filter: none;
					}
				}
			}
		}
	}
</style>