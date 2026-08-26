# Manuel utilisateur — Librairie en ligne
 
Ce guide explique comment utiliser le site, côté client comme côté administrateur.
 
---
 
## Partie 1 — Espace client
 
### 1.1 Parcourir le catalogue
 
- La page **Catalogue** liste tous les livres disponibles.
- Utilisez la barre de recherche en haut du site pour chercher un livre par titre ou auteur.
- Cliquez sur un livre pour voir sa fiche détaillée : description, résumé généré automatiquement, avis clients, disponibilité.
### 1.2 Changer de langue
 
- Le site est disponible en **français, anglais et arabe**.
- Le sélecteur de langue se trouve dans l'en-tête du site.
- En arabe, l'ensemble de la page s'affiche automatiquement de droite à gauche.
### 1.3 Créer un compte et se connecter
 
- Cliquez sur **"Compte"** dans l'en-tête, puis **"Se connecter"**.
- Renseignez votre email et votre mot de passe.
- Un compte est nécessaire uniquement pour **passer commande**, ajouter des favoris, ou laisser un avis — la consultation du catalogue reste libre.
### 1.4 Ajouter des livres au panier
 
- Sur la fiche d'un livre, cliquez sur **"Ajouter au panier"**.
- Accédez au panier via l'icône dédiée dans l'en-tête.
- Dans le panier, vous pouvez modifier les quantités ou retirer un article.
### 1.5 Passer une commande
 
- Depuis le panier, cliquez sur **"Passer à la commande"**.
- Si vous n'êtes pas connecté, vous serez invité à vous connecter d'abord.
- Vérifiez le récapitulatif, puis cliquez sur **"Confirmer la commande"**.
- **Le paiement se fait uniquement en espèces, à la livraison** — aucune information bancaire n'est demandée sur le site.
### 1.6 Suivre ses commandes
 
- Dans votre espace client (**"Compte"**), la section **"Mes commandes"** liste l'historique de vos commandes et leur statut actuel :
  - **En attente** : commande reçue, pas encore traitée.
  - **Validée** : commande confirmée par la librairie.
  - **Livrée** : commande remise au client.
  - **Annulée** : commande annulée (stock restitué automatiquement).
### 1.7 Favoris
 
- Sur la fiche d'un livre, cliquez sur l'icône cœur pour l'ajouter à vos favoris.
- Retrouvez votre liste dans **"Mes favoris"**, accessible depuis votre espace client.
### 1.8 Laisser un avis
 
- Un avis peut être laissé sur un livre après connexion.
- **Les avis sont soumis à modération** : ils n'apparaissent publiquement qu'après validation par un administrateur.
---
 
## Partie 2 — Back-office administrateur
 
Accessible via `/admin` sur le site.
 
### 2.1 Tableau de bord
 
La page d'accueil du back-office affiche :
- Le nombre de commandes reçues le jour même.
- Le chiffre d'affaires du mois en cours.
- Le nombre de livres en stock faible (moins de 20 exemplaires), avec la liste détaillée.
- Un graphique de répartition des livres par catégorie.
### 2.2 Gérer les livres
 
- Menu **"Livres"** : liste complète du catalogue, avec prix, stock et catégorie.
- **"+ Ajouter un livre"** : formulaire de création (titre, auteur, prix, stock, catégorie, description). Un résumé et des traductions sont générés automatiquement par l'IA après quelques secondes.
- **"Modifier"** : mettre à jour les informations d'un livre existant.
- **"Supprimer"** : retire définitivement un livre.
- **"Exporter en CSV"** : télécharge la liste complète du catalogue au format tableur.
### 2.3 Gérer les commandes
 
- Menu **"Commandes"** : liste de toutes les commandes, avec le client, la date et le montant.
- Le statut de chaque commande peut être changé directement via le menu déroulant.
- **Important** : annuler une commande restitue automatiquement le stock des livres concernés. Une commande déjà marquée "Livrée" ne peut plus être annulée.
### 2.4 Consulter les clients
 
- Menu **"Clients"** : liste en lecture seule des comptes clients inscrits.
### 2.5 Modérer les avis
 
- Menu **"Avis"** : liste des avis en attente de validation.
- **"Approuver"** : rend l'avis visible publiquement sur la fiche du livre concerné.
- **"Rejeter"** : supprime définitivement l'avis.
---
 
## Comptes de démonstration
 
| Rôle | Email | Mot de passe |
|---|---|---|
| Client | client1@test.com (à client5@test.com) | motdepasse123 |
 
*(Pas de compte administrateur séparé pour l'instant — l'accès au back-office se fait directement via l'URL `/admin`.)*
 