#  Suivi de Portefeuille Crypto

Application web permettant de suivre la valeur d'un portefeuille de cryptomonnaies en temps réel, en récupérant les prix actuels via l'API publique CoinGecko.

Projet développé en **JavaScript vanilla** (sans framework), pour pratiquer les appels API asynchrones, la gestion d'erreurs réseau et la manipulation du DOM.

##  Fonctionnalités

- Ajout d'actifs crypto (nom + quantité détenue)
- Récupération du prix actuel en temps réel via l'API CoinGecko
- Calcul automatique de la valeur de chaque actif et du total du portefeuille
- Suppression d'un actif
- Gestion des erreurs : nom de crypto invalide, échec réseau, sans faire planter l'application
- Interface épurée et responsive

##  Technologies utilisées

- **HTML5**
- **CSS3** (Flexbox, variables CSS)
- **JavaScript (ES6+)** — vanilla, sans dépendance ni framework
  - Programmation orientée objet (classes `ActifCrypto` et `Portefeuille`)
  - Requêtes API asynchrones (`fetch`, `async`/`await`)
  - Parallélisation des appels réseau avec `Promise.all`
  - Gestion d'erreurs (`try`/`catch`)
  - Manipulation du DOM

##  API utilisée

[CoinGecko API](https://www.coingecko.com/en/api) — API publique et gratuite, aucune clé requise.

Endpoint utilisé :
```
https://api.coingecko.com/api/v3/simple/price?ids={nom_crypto}&vs_currencies=usd&include_24hr_change=true
```
## Aperçu
<img width="1366" height="768" alt="crypto" src="https://github.com/user-attachments/assets/d5af3e06-b82d-4d20-acb0-176edd763efc" />


##  Installation et utilisation

1. Clone le repository :
   ```bash
   git clone https://github.com/EbroVital/WalletCrypto.git
   ```
2. Ouvre le fichier `index.html` dans ton navigateur (aucune installation ni dépendance nécessaire).
3. Ajoute une crypto en indiquant son identifiant CoinGecko (ex: `bitcoin`, `ethereum`, `solana`) et la quantité détenue.

##  Structure du projet

```
├── index.html      # Structure de la page
├── style.css       # Mise en forme
├── script.js       # Logique de l'application
└── README.md
```

##  Concepts pratiqués

Ce projet a été l'occasion de mettre en pratique en profondeur :
- Les appels réseau asynchrones avec `fetch` et `async`/`await`
- La parallélisation de plusieurs requêtes indépendantes avec `Promise.all`, plutôt que de les enchaîner en série
- La gestion d'erreurs réseau et de données invalides (`try`/`catch`, `throw`), sans faire planter l'application
- La séparation entre l'état de l'application et son affichage, via une fonction `render()` asynchrone
- L'opérateur de coalescence nulle (`??`) pour afficher une valeur de repli en cas d'erreur

##  Améliorations possibles

- Recherche/autocomplétion des noms de cryptos disponibles (plutôt que de les taper à la main)
- Graphique d'évolution de la valeur du portefeuille

##  Auteur

Développé par Ebro Vital dans le cadre de mon apprentissage de JavaScript, en lien avec un intérêt pour le trading algorithmique et la fintech.
