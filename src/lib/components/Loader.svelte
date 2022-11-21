<script>
	export let fixed = false;
</script>

<div class='spinner-wrapper' class:fixed>
	<svg class='spinner'  viewBox='0 0 66 66' xmlns='http://www.w3.org/2000/svg'>
		<circle cx='33' cy='33' r='30' />
	</svg>
</div>

<style lang='scss'>
	.spinner-wrapper {
		&.fixed {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		.spinner {
			$duration: 1.4s;
			$offset: 187;

			width: 3rem;
			height: 3rem;
			margin: 1rem;
			animation: rotate $duration linear infinite;

			@keyframes rotate {
				from {
					transform: rotate(0deg);
				}

				to {
					transform: rotate(270deg);
				}
			}

			circle {
				fill: none;
				stroke-width: 6px;
				stroke-linecap: round;
				stroke-dasharray: $offset;
				stroke-dashoffset: 0;
				transform-origin: center;
				animation:
					draw $duration ease-in-out infinite,
					switch-color calc($duration * 2) ease-in-out infinite;

				@keyframes draw {
					0% {
						stroke-dashoffset: $offset;
					}

					50% {
						stroke-dashoffset: calc($offset / 4);
						transform: rotate(135deg);
					}

					100% {
						stroke-dashoffset: $offset;
						transform: rotate(450deg);
					}
				}

				@keyframes switch-color {
					0% {
						stroke: $twitter
					}

					50% {
						stroke: $mastodon;
					}

					100% {
						stroke: $twitter;
					}
				}
			}
		}
	}
</style>