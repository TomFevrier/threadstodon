# [Threadstodon](https://threadstodon.netlify.app/) 🐦🧵 ➡️ 🐘

**Reposte facilement tes meilleurs fils Twitter sur Mastodon !**

[![Netlify Status](https://api.netlify.com/api/v1/badges/89b9618b-7ae7-4cf1-ab7f-09a60751d16c/deploy-status)](https://app.netlify.com/sites/threadstodon/deploys)

---

## À propos

### Fonctionnalités

Cet outil permet à l’utilisateur⋅rice, une fois connecté⋅e à son compte Twitter et à son compte Mastodon, de rechercher l’un de ses anciens threads puis de le reposter sur Mastodon.

Il est également possible d’éditer le fil avant publication, en corrigeant les textes des tweets (et notamment les mentions) ou en excluant certains tweets.
	
### Limites

L’API de Twitter impose une limite de 900&nbsp;requêtes par utilisateur⋅rice et par fenêtre de 15&nbsp;min, ce qui ne devrait pas poser problème dans le cadre d’une utilisation normale. Du côté de Mastodon, la limite est de 300&nbsp;requêtes par utilisateur⋅rice et par fenêtre de 5&nbsp;min. En cas de problème, n’hésitez pas à réessayer un peu plus tard.
	
Certains tweets peuvent ne pas apparaître dans les résultats de recherche, car l’API de Twitter ne permet d’accéder qu’aux 3200 derniers tweets de l’utilisateur⋅rice. Si le fil recherché est trop ancien, **il est également possible de copier-coller dans la barre de recherche l’URL du premier tweet d’un thread**. Pour retrouver le thread, utilisez les fonctionnalités de recherche avancée de Twitter (<code>from:pseudo recherche</code>).
	
### Politique de confidentialité
	
En connectant son compte Twitter et son compte Mastodon, l’utilisateur⋅rice accepte que le service ait accès&nbsp;:
- **en lecture** aux informations de son profil Twitter et à l’ensemble de ses tweets
- **en écriture** à son compte Mastodon afin d’y poster des pouets avec médias

L’accès est accordé via une authentification OAuth2, pour une durée maximum de 2 heures (pour Twitter) ou illimitée (pour Mastodon). Une fois établi, l’accès peut être révoqué à tout moment depuis la page d’accueil en cliquant sur le badge correspondant. En cas de doute ou de problème, il est également possible de révoquer l’accès depuis les réglages de Mastodon (Compte > Applications autorisées).

Aucune donnée n’est stockée sur le serveur, et encore moins divulguée à des tiers. Les seuls cookies utilisés permettent de stocker les jetons d’accès et les informations des profils Twitter et Mastodon, et sont effacés lorsque l’accès est révoqué.
	
N’hésitez pas à me signaler le moindre bug, directement ici, sur <a href='https://twitter.com/TomFevrier' target='_blank' rel='noreferrer'>Twitter</a> ou <a href='https://mastodon.social/@tomfevrier' target='_blank' rel='noreferrer'>Mastodon</a>.

---

## Développement


### Prérequis

- Node.js > 18.9.0
- npm > 8.19.1


### Mise en place

~~~
git clone https://github.com/TomFevrier/threadstodon
cd threadstodon
npm install
~~~

Dans un fichier `.env`, ajouter les variables d’environnement suivantes :
~~~
# Identifiants de l’application Twitter
VITE_TWITTER_CLIENT_ID=XXXXXXXXXX 
VITE_TWITTER_BEARER_TOKEN=XXXXXXXXXX

# Confidentialité des pouets
VITE_TOOT_VISIBILITY=public|unlisted|private|direct
# Défaut : direct (pour éviter de spammer par erreur ses followers en phase de développement)
~~~

`http://localhost:3000/auth/twitter/callback` doit être configurée comme URL de redirection sur le portail développeur⋅se de Twitter.


### Développement local

~~~
npm run dev
~~~


### Routes

#### Pages
- `/`
- `/about`
- `/edit/:id`: édition du thread Twitter d’identifiant `id`
- `/auth/mastodon/login`: formulaire pour le nom d’utilisateur⋅rice Mastodon et ouverture de la fenêtre d’autorisation OAuth

#### API
- `GET /auth/mastodon/callback`: URL de redirection pour l’authentification OAuth de Mastodon
- `GET /auth/mastodon/logout`: révocation de l’accès OAuth de Mastodon
- `GET /auth/twitter/login`: ouverture de la fenêtre d’autorisation OAuth de Twitter
- `GET /auth/twitter/callback`: URL de redirection pour l’authentification OAuth de Twitter
- `GET /auth/twitter/logout`: révocation de l’accès OAuth de Twitter
- `GET /search`: recherche de tweets
	- _Paramètres d’URL : `query` et `end_time` (pour la recherche étendue au-delà de cette date)_
	- _Réponse : tableau de tweets_
- `POST /toot`: pouéter le thread sélectionné
	- _Corps de la requête : tableau de tweets_
	- _Réponse : url du premier pouet du thread_


### Roadmap

- possibilité d’étendre le nombre de tweets du thread (actuellement, uniquement 48h après la publication du premier tweet) ✅
- gestion des erreurs plus poussée, niveau API et interface (snackbar, etc.)
- afficher les aperçus des liens
