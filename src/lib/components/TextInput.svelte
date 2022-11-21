<script>
	import { createEventDispatcher } from 'svelte';


	export let id;
	export let value;
	export let placeholder = '';
	export let pattern = null;
	export let icon = 'arrow-right';

	const dispatch = createEventDispatcher();
</script>

<div {id} class='text-input'>
	<input type='text' name={id} bind:value {placeholder} {pattern} />
	<button type='submit' on:click={() => dispatch('submit')}>
		<i class='fi fi-{icon}'></i>
	</button>
</div>

<style lang='scss'>
	.text-input {
		position: relative;
		width: 100%;

		input {
			width: 100%;
			height: 3rem;
			padding-inline: 2rem 2.5rem;
			border: 1px solid $dimmed-text;
			border-radius: 1.5rem;
			background-color: rgba(white, 0.1);

			&:placeholder-shown {
				color: $dimmed-text;
				text-overflow: ellipsis;
			}

			&:focus {
				border-color: $mastodon;

				& ~ button {
					color: $mastodon;
				}
			}
		}

		&#search-bar {
			input:focus {
				border-color: $twitter;

				& ~ button {
					color: $twitter;
				}
			}
		}

		button {
			position: absolute;
			top: 50%;
			right: 0.5rem;
			padding-inline: 0.5rem;
			transform: translateY(-50%);
			color: white;
			font-size: 1.1rem;
		}
	}
</style>