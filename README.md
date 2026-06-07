# 🌤️ Météfit

> *Habille-toi intelligemment selon la météo du jour.*

Météfit est une **Progressive Web App** qui te suggère une tenue vestimentaire adaptée à la météo de ta ville, en tenant compte de ton confort thermique personnel et de ton historique de retours.

---

## ✨ Fonctionnalités

### 🌡️ Météo en temps réel
- Géolocalisation automatique ou recherche manuelle de ville
- Autocomplete avec disambiguation région / pays (fini Valence ES au lieu de Valence FR)
- Prévisions sur **5 jours** avec sélecteur de jour
- Timeline heure par heure avec icônes météo
- Alertes amplitude thermique et pluie en cours de journée

### 👕 Suggestions de tenues
- Suggestion personnalisée basée sur ta garde-robe
- Suggestion générique si aucun vêtement n'est renseigné
- L'imperméable n'est suggéré **que s'il pleut**
- Algorithme de meilleur ajustement (score = -|temp - centre_plage|)

### 🧠 Apprentissage automatique
- **Profil thermique** : frileux (−5°C), normal, j'ai chaud (+5°C)
- **Auto-calibration** : analyse tes 10 derniers retours et ajuste ±1°C automatiquement
- Feedback quotidien : 👌 Parfait · 🥵 Trop chaud · 🥶 Trop froid

### 📍 Gestion des villes
- Villes **favorites** accessibles en un clic sous la barre de recherche
- **Historique** des 3 dernières villes recherchées
- Ajout aux favoris depuis les suggestions ou l'historique

### 💾 Tenues sauvegardées
- Sauvegarde des tenues suggestions sous un nom personnalisé
- Bibliothèque accessible dans l'onglet Garde-robe

### 🔔 Notifications
- Notification matinale (6h–11h) avec la tenue du jour à l'ouverture de l'app
- Une seule notification par jour

### 🌙 Dark mode
- Toggle dans les paramètres
- Respecte la préférence système par défaut
- Persisté en localStorage

### ♿ Accessibilité
- Structure sémantique complète (`<header>`, `<main>`, `<nav>`, `<article>`)
- ARIA complet : `role="tablist"`, `role="dialog"`, `role="combobox"`, `role="alert"`, `role="switch"`…
- Focus trap dans le panel paramètres + fermeture sur `Escape`
- Lien d'évitement "Aller au contenu principal"
- Tous les boutons icônes ont un `aria-label` descriptif
- Emojis décoratifs masqués avec `aria-hidden`
- Annonces dynamiques via `aria-live`

### 📱 PWA
- Installable sur mobile et desktop
- Service worker pour le cache offline
- Manifest avec icônes et theme color

---

## 🛠️ Stack technique

| Outil | Version | Rôle |
|---|---|---|
| [React](https://react.dev) | 19 | UI |
| [TypeScript](https://www.typescriptlang.org) | 6 | Typage |
| [Vite](https://vite.dev) | 8 | Bundler / Dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Styles |
| [OpenWeatherMap API](https://openweathermap.org/api) | — | Météo + Geocoding |

**Pas de dépendance runtime externe** en dehors de React.  
Toutes les données sont persistées en `localStorage`.

---

## 🚀 Démarrage rapide

```bash
# Cloner le repo
git clone https://github.com/Mano515/metefit.git
cd metefit

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'app sera disponible sur [http://localhost:5173](http://localhost:5173).

```bash
# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

---

## 📁 Structure du projet

```
src/
├── components/           # Composants React
│   ├── WeatherCard        # Carte météo principale
│   ├── DaySelector        # Sélecteur de jour (5 jours)
│   ├── DayTimeline        # Timeline heure par heure
│   ├── DayChangeAlert     # Alertes amplitude / pluie
│   ├── CitySearch         # Recherche + autocomplete + favoris
│   ├── OutfitSuggestion   # Affichage de la tenue
│   ├── OutfitValidator    # Feedback (parfait / trop chaud / froid)
│   ├── ThermalSelector    # Profil thermique
│   ├── AddClothingForm    # Formulaire ajout vêtement (presets)
│   ├── ClothingList       # Liste de la garde-robe
│   ├── SaveOutfitButton   # Sauvegarde d'une tenue
│   ├── SavedOutfitLibrary # Bibliothèque des tenues sauvegardées
│   ├── HistoryList        # Historique des tenues portées
│   ├── SettingsPanel      # Panel paramètres (drawer)
│   ├── NotificationBanner # Activation notifications
│   └── ThermalAutoNotice  # Notice auto-calibration thermique
│
├── hooks/                # Logique métier
│   ├── useWeather         # Météo + geocoding + prévisions
│   ├── useWardrobe        # Garde-robe + algorithme de suggestion
│   ├── useThermal         # Profil thermique + auto-calibration
│   ├── useHistory         # Historique des tenues portées
│   ├── useSavedOutfits    # Tenues sauvegardées
│   ├── useCityMemory      # Favoris + villes récentes
│   ├── useNotifications   # Notifications push
│   └── useDarkMode        # Dark mode + persistance
│
├── utils/
│   ├── defaultSuggestions # Suggestions génériques par météo
│   └── clothingEmoji      # Emoji associé à chaque vêtement
│
├── types.ts              # Types TypeScript centraux
├── App.tsx               # Composant racine
└── index.css             # Tailwind + dark mode variant

public/
├── manifest.json         # PWA manifest
└── sw.js                 # Service worker
```

---

## 🔑 Configuration API

L'app utilise l'[API OpenWeatherMap](https://openweathermap.org/api) (gratuite jusqu'à 60 req/min).

La clé API est définie dans `src/hooks/useWeather.ts` et `src/components/CitySearch.tsx`.  
Pour utiliser ta propre clé, remplace la constante `API_KEY` dans ces deux fichiers.

---

## 🗺️ Roadmap

- [ ] Déploiement (Vercel / Netlify)
- [ ] Partage de tenue (lien ou image)
- [ ] Thèmes de couleur personnalisables
- [ ] Support multi-langue

---

## 📄 Licence

Projet personnel — tous droits réservés.
