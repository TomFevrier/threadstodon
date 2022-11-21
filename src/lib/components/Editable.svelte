<script>
	export let content;
	export { isEditing as editing };
	export let formatter;

	let isEditing = false;
	let original;

	const focus = (node) => {
		node.focus();
	}

	const handleClick = () => {
		original = content;
		isEditing = true;
	}

	const handleKeydown = (e) => {
		if (e.key == 'Escape') {
			e.preventDefault();
			content = original;
			isEditing = false;
		}
	}

	const submit = () => {
		if (!content) {
			content = original;
		}
		isEditing = false;
	}
</script>

<span class='editable'>
	<span class='content' on:click={handleClick} class:visible={!isEditing}>
		{@html formatter(content)}
	</span>
	{#if isEditing}
		<form on:submit|preventDefault on:keydown={handleKeydown}>
			<textarea bind:value={content} on:blur={submit} required use:focus />
		</form>
	{/if}
</span>

<style lang='scss'>
	.editable {
		display: inline-block;
		position: relative;

		.content {
			display: inline-block;
			visibility: hidden;

			&.visible {
				visibility: visible;
				background-color: transparent;
			}
		}

		form {
			position: absolute;
			inset: 0;
			cursor: text;

			textarea {
				all: inherit;
				width: 100%;
				height: 100%;
				white-space: pre-wrap;
				color: $dimmed-text;
			}
		}		
	}
</style>