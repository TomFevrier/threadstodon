<script>
	import { TextInput } from '$lib/components';
</script>

<form method='POST'>
	<TextInput
		id='mastodon-address'
		placeholder='moi@instance.social'
		pattern={'\\w+@\\w+\\.\\w{2,}'} />
</form>

<style lang='scss'>
	form {
		width: 100%;
		max-width: 20rem;
	}
</style>