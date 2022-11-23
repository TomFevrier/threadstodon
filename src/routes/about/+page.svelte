<div id='container'>
	<h4>Fonctionnalités</h4>

	<p>Cet outil permet à l’utilisateur⋅rice, une fois connecté⋅e à son compte Twitter et à son compte Mastodon, de rechercher l’un de ses anciens threads puis de le reposter sur Mastodon.</p>
	<p>Il est également possible d’éditer le fil avant publication, en corrigeant les textes des tweets (et notamment les mentions) ou en excluant certains tweets.</p>
	
	<h4>Limites</h4>
	
	<p>L’API de Twitter impose une limite de 900&nbsp;requêtes par utilisateur⋅rice et par fenêtre de 15&nbsp;min, ce qui ne devrait pas poser problème dans le cadre d’une utilisation normale. Du côté de Mastodon, la limite est de 300&nbsp;requêtes par utilisateur⋅rice et par fenêtre de 5&nbsp;min. En cas de problème, n’hésitez pas à réessayer un peu plus tard.</p>
	
	<p>Certains tweets peuvent ne pas apparaître dans les résultats de recherche, car l’API de Twitter ne permet d’accéder qu’aux 3200 derniers tweets de l’utilisateur⋅rice. Si le fil recherché est trop ancien, <b>il est également possible de copier-coller dans la barre de recherche l’URL du premier tweet d’un thread</b>. Pour retrouver le thread, utilisez les fonctionnalités de recherche avancée de Twitter (<code>from:pseudo recherche</code>).
	
	<h4>Politique de confidentialité</h4>
	
	<p>En connectant son compte Twitter et son compte Mastodon, l’utilisateur⋅rice accepte que le service ait accès&nbsp;:</p>
	<ul>
		<li><b>en lecture</b> aux informations de son profil Twitter et à l’ensemble de ses tweets</li>
		<li><b>en écriture</b> à son compte Mastodon afin d’y poster des pouets avec médias</li>
	</ul>
	<p>L’accès est accordé via une authentification OAuth2, pour une durée maximum de 2 heures (pour Twitter) ou illimitée (pour Mastodon). Une fois établi, l’accès peut être révoqué à tout moment depuis la page d’accueil en cliquant sur le badge correspondant. En cas de doute ou de problème, il est également possible de révoquer l’accès depuis les réglages de Mastodon (Compte > Applications autorisées).</p>
	<p>Aucune donnée n’est stockée sur le serveur, et encore moins divulguée à des tiers. Les seuls cookies utilisés permettent de stocker les jetons d’accès et les informations des profils Twitter et Mastodon, et sont effacés lorsque l’accès est révoqué.</p>
	
	<p>N’hésitez pas à me signaler le moindre bug, sur <a href='https://twitter.com/TomFevrier' target='_blank' rel='noreferrer'>Twitter</a> ou <a href='https://mastodon.social/@tomfevrier' target='_blank' rel='noreferrer'>Mastodon</a>.</p>
	
	<p><a href='https://github.com/TomFevrier/threadstodon' target='_blank' rel='noreferrer'>Voir le code source</a></p>
</div>


<style lang='scss'>
	#container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-bottom: 6rem;

		p {
			margin: 0;

			a {
				text-decoration: underline;
			}
		}

		h4 {
			font-size: 1.1rem;
			margin: 1rem 0 0;
		}
		
		li {
			margin: 0.5rem 0;
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
</style>
