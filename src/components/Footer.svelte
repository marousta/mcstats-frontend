<footer>
	<a href="about">About this website</a>
</footer>

<style lang="scss">
	footer {
		margin-top: auto;
		position: relative;
		bottom: 0;
		width: 100vw;
		height: 52px;
		text-align: center;
		line-height: 52px;
		display: flex;
		justify-content: center;

		a {
			font-weight: bold;
		}

		div:not(:last-child):after {
			padding: 0px 10px;
			content: '|';
		}
	}

	@media screen and (max-width: 570px) {
		footer {
			font-size: 12px;

			div:not(:last-child):after {
				padding: 0px 8px;
				content: '|';
			}
		}
	}

	@media screen and (max-width: 430px) {
		footer {
			line-height: 100%;
			flex-direction: column;
			bottom: 5px;

			div {
				margin-bottom: 10px;
			}

			div:not(:last-child):after {
				display: none;
			}
		}
	}
</style>
