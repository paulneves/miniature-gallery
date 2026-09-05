# GitHub-minis-master

**Version:** 1.1.0  
**Project:** Miniature Painting Collection  
**Repository:** `paulneves/miniature-gallery`

## Purpose

This document is the master context and recovery prompt for the Miniature Gallery project. In a new ChatGPT conversation, use it to recover the project state. Treat the live GitHub repository as the authoritative implementation and this document as the authoritative project intent/recovery context.

## Recovery procedure

1. Connect to GitHub through the authorized GitHub integration.
2. Confirm access to `paulneves/miniature-gallery`.
3. Inspect the current repository before making changes.
4. Read at minimum `index.html`, `catalog.json`, `css/style.css`, `js/gallery.js`, `README.md`, and the newest `ChatGPT Prompts/GitHub-minis-master-v*.md`.
5. When image assets are involved, use the authorized Google Drive integration and inspect the `miniature-galery` master archive as needed.
6. Check the GitHub Pages deployment at `https://paulneves.github.io/miniature-gallery/` when appropriate.
7. Preserve repository changes newer than this document.
8. Continue from the user's current instruction; do not recreate completed work.

## Source-of-truth priority

When information conflicts, use this order:

1. User's explicit instruction in the current conversation.
2. Current GitHub repository contents.
3. Latest version of this GitHub-minis-master.
4. Historical assumptions.

## Main objective

Build a free, maintainable and configurable website for displaying the user's painted miniature collection and associated Painting Specification Sheets, primarily for Warhammer 40,000 and Star Wars.

Normal catalogue updates must not require editing HTML, CSS or JavaScript. Miniatures and metadata are defined in `catalog.json`.

## Hosting and storage architecture

The public site uses GitHub Pages from the `main` branch and repository root.

Public site: `https://paulneves.github.io/miniature-gallery/`

Image storage is deliberately split into two roles:

- **Google Drive = master/original archive.**
- **GitHub = optimized web publication assets.**

Google Drive is not the primary public image CDN for the website. The website normally uses optimized JPG files stored in the GitHub repository.

## Google Drive master archive — mandatory

The Google Drive folder `miniature-galery` is the master image archive.

For every user-supplied image that is incorporated into the collection, maintain a corresponding original/master copy in this Drive structure.

### Original-file preservation rule

The Google Drive copy must preserve the original supplied image bytes/content as far as the storage workflow allows. Do not resize, crop, recompress, recolour, sharpen, convert format, or otherwise visually modify the original before archiving it.

The only intended change is the filename.

Preserve the original extension/format. Examples:

- supplied PNG → archived PNG
- supplied JPG/JPEG → archived JPG/JPEG
- supplied TIFF → archived TIFF

Do not replace the Drive original with an optimized GitHub derivative.

### Google Drive folder hierarchy

Use exactly this conceptual hierarchy, with no per-miniature/person/character folder:

```text
miniature-galery/
└── Universe/
    └── Faction/
        └── Subfaction/
            └── files
```

Examples:

```text
miniature-galery/
├── star-wars/
│   ├── galactic-republic/
│   │   └── 501st-legion/
│   │       ├── captain-rex-mini.png
│   │       └── captain-rex-paint-sheet.png
│   └── galactic-empire/
│       └── shoretroopers/
│           ├── imperial-shoretrooper-mini.jpg
│           └── imperial-shoretrooper-paint-sheet.png
└── warhammer-40000/
    └── space-marines/
        └── raptors/
            ├── primaris-infiltrator-mini.png
            └── primaris-infiltrator-paint-sheet.png
```

Do not create an additional `captain-rex/`, `primaris-infiltrator/`, or equivalent miniature folder. Filenames identify the miniature.

## Filename normalization — mandatory

User-supplied filenames may be arbitrary and must not determine the published/archive naming.

Use the authoritative miniature title supplied by the user to generate a normalized lowercase filesystem/web slug.

Preferred patterns:

```text
<miniature-slug>-mini.<original-extension>
<miniature-slug>-paint-sheet.<original-extension>
<miniature-slug>-detail-01.<original-extension>
<miniature-slug>-detail-02.<original-extension>
```

For GitHub web derivatives:

```text
<miniature-slug>-mini.jpg
<miniature-slug>-thumb.jpg
<miniature-slug>-paint-sheet.jpg
<miniature-slug>-detail-01.jpg
```

Example:

```text
Captain Rex
→ captain-rex-mini.png        (Drive original, if source was PNG)
→ captain-rex-paint-sheet.png (Drive original, if source was PNG)
→ captain-rex-mini.jpg        (GitHub optimized)
→ captain-rex-thumb.jpg       (GitHub thumbnail)
→ captain-rex-paint-sheet.jpg (GitHub optimized)
```

## GitHub image assets — web derivatives only

Images used directly by GitHub Pages should normally be optimized JPG derivatives, not the archival originals.

Rules:

1. Generate web JPGs from the original supplied assets.
2. Keep sufficient resolution and JPEG quality for detailed viewing.
3. Generate a smaller dedicated thumbnail for catalogue cards.
4. Do not load the full-resolution web image in every gallery card.
5. Load the larger image only when the user opens/selects it in the viewer.
6. Painting Specification Sheets are also published as optimized JPGs unless a future explicit requirement changes this.
7. Do not store a Drive `-thumb` solely for backup; thumbnails are reproducible web derivatives.

The current JavaScript supports an image `thumbnail` URL/path separately from the full `url`. If `thumbnail` is missing, it falls back to the full image for backwards compatibility.

Example:

```json
{
  "type": "miniature",
  "title": "Miniature",
  "thumbnail": "images/star-wars/galactic-republic/501st-legion/captain-rex-thumb.jpg",
  "url": "images/star-wars/galactic-republic/501st-legion/captain-rex-mini.jpg"
}
```

## GitHub image hierarchy

Mirror the same classification structure used in Drive, but store optimized web files:

```text
images/
└── Universe/
    └── Faction/
        └── Subfaction/
            └── optimized JPG files
```

Example:

```text
images/
└── star-wars/
    └── galactic-republic/
        └── 501st-legion/
            ├── captain-rex-mini.jpg
            ├── captain-rex-thumb.jpg
            └── captain-rex-paint-sheet.jpg
```

There is no per-miniature folder.

## Asset processing pipeline

For a normal new miniature addition, the intended image pipeline is:

```text
User-supplied original image(s)
        ↓
Determine authoritative miniature title and classification
        ↓
Normalize filename
        ↓
Archive untouched original(s) in Google Drive
        ↓
Generate optimized JPG web derivative(s)
        ↓
Generate thumbnail from the miniature image
        ↓
Store optimized JPG assets in matching GitHub image hierarchy
        ↓
Update catalog.json
        ↓
Commit
        ↓
Verify site
```

Do not generate the thumbnail from a previously degraded thumbnail. Generate derivatives from the best available original/master source.

## Current repository architecture

```text
miniature-gallery/
├── index.html
├── catalog.json
├── README.md
├── css/
│   └── style.css
├── js/
│   └── gallery.js
├── images/
│   └── [Universe/Faction/Subfaction web assets]
└── ChatGPT Prompts/
    ├── GitHub-minis-master-v1.0.0.md
    └── GitHub-minis-master-v1.1.0.md
```

Old master versions must be retained for version history unless the user explicitly requests deletion.

## Configuration-first architecture

`catalog.json` is the principal content configuration file. HTML provides the application shell, CSS controls presentation, and JavaScript reads the catalogue and dynamically constructs the gallery.

Adding a normal miniature should usually require only image processing/storage plus adding/updating one object in `catalog.json`.

## Catalogue hierarchy

```text
Site
└── Universe
    └── Faction
        └── Subfaction
            └── Miniature
                └── Images
                    └── External links / credits
```

Examples:

`Warhammer 40,000 → Space Marines → Raptors → Primaris Infiltrator`

`Star Wars → Galactic Republic → 501st Legion → Captain Rex`

Filter values must be derived dynamically from catalogue data rather than hard-coded.

## Miniature data model

```json
{
  "id": "captain-rex",
  "name": "Captain Rex",
  "universe": "Star Wars",
  "faction": "Galactic Republic",
  "subfaction": "501st Legion",
  "description": "501st Legion Captain Rex miniature and painting reference.",
  "tags": ["Clone Trooper", "501st Legion", "Captain Rex"],
  "images": []
}
```

## Image model

A miniature can have multiple images. Images may include a lightweight thumbnail and a larger display URL.

```json
{
  "type": "miniature",
  "title": "Miniature",
  "thumbnail": "images/star-wars/galactic-republic/501st-legion/captain-rex-thumb.jpg",
  "url": "images/star-wars/galactic-republic/501st-legion/captain-rex-mini.jpg",
  "link": "https://example.com/captain-rex",
  "credit": "Example Studio"
}
```

`url` may still be a local repository path or an external image URL when explicitly useful. `link` is an optional external webpage associated with the image. `credit` is optional attribution.

External image hotlinking may fail and must not break the gallery.

Supported/future image types include `miniature`, `painting-sheet`, `front`, `rear`, `left`, `right`, `detail`, `helmet`, `weapon`, `base`, and `reference`.

The first image of type `miniature` should normally be the card image. If none exists, the first available image may be used as fallback.

## Painting Specification Sheets

Painting Specification Sheets are first-class catalogue assets. They are normally tall A4 portrait painting-reference images generated in the user's separate miniature-painting workflow.

Archive the original supplied sheet in Google Drive without image modification, except filename normalization. Publish an optimized JPG derivative to GitHub for the website.

The viewer must allow switching between the miniature and Painting Specification Sheet and should use contain-style presentation for tall sheets rather than cropping them.

## Current demo records

The implementation contains four initial records:

- Warhammer 40,000 → Space Marines → Raptors → Primaris Infiltrator
- Warhammer 40,000 → Space Marines → Imperial Fists → Primaris Lieutenant
- Star Wars → Galactic Republic → 501st Legion → Captain Rex
- Star Wars → Galactic Empire → Shoretroopers → Imperial Shoretrooper

These currently use demonstration/placeholder remote imagery until replaced with authoritative user collection images.

## Current site features

- responsive dark gallery interface
- catalogue counter
- text search
- Universe/Faction/Subfaction filters
- dynamically generated cascading filter values
- responsive cards
- lazy-loaded thumbnails
- separate thumbnail/full-resolution image support
- modal/detail viewer
- multiple-image switching
- Painting Sheet support
- optional image source links and credits
- tags
- graceful unavailable-image handling
- mobile/tablet responsive layout

Search covers miniature name, universe, faction, subfaction, description and tags and works together with filters.

## Responsive requirement

Desktop, tablet and mobile are required. Tablet/iPad behaviour is important. Do not rely solely on hover interactions.

## GitHub maintenance workflow

When the user asks to add a miniature:

1. Inspect the repository and current `catalog.json`.
2. Determine whether the miniature already exists.
3. Determine the authoritative title, Universe, Faction and Subfaction.
4. Normalize incoming filenames according to this master.
5. Ensure the Google Drive `miniature-galery/Universe/Faction/Subfaction` path exists.
6. Archive the supplied originals in Drive, preserving their original image format/content and changing only the filename.
7. Generate optimized JPG web versions and a miniature thumbnail.
8. Store the web assets under the matching GitHub `images/Universe/Faction/Subfaction` path.
9. Update `catalog.json` while preserving existing records.
10. Commit changes through the authorized GitHub integration.
11. Verify repository state and, where practical, the public GitHub Pages deployment.

Do not require the user to manually edit JSON for routine updates.

Never ask the user to paste GitHub passwords, Personal Access Tokens, Google credentials, service-account secrets or private authentication secrets into chat. Use authorized integrations.

## Update philosophy

Routine catalogue additions are content operations, not application rewrites. Adding a miniature should not require editing `index.html`, `style.css` or `gallery.js` unless a new feature is introduced.

Avoid unnecessary breaking schema changes. Preserve existing records. Keep `README.md` synchronized with meaningful architecture changes.

## Performance

Use thumbnails for gallery cards, lazy loading, and optimized JPGs. Larger web images should load on demand. Keep originals out of the normal GitHub Pages payload when they are unnecessarily large; Drive is the master archive.

If the collection eventually becomes too large for convenient GitHub hosting, a dedicated public object-storage/CDN layer may be introduced without changing the Drive master/archive principle.

## Accessibility and error handling

Maintain meaningful alt text, keyboard-accessible cards/selectors, visible focus states, labelled controls, sufficient contrast and a closeable modal/dialog.

Gracefully handle missing/blocked images, missing optional metadata, empty searches, missing Painting Sheets and malformed catalogue data where practical. One bad image must not break the catalogue.

## Versioning

Master prompts are versioned and retained under `ChatGPT Prompts/`.

Use semantic-style versioning:

- patch (`1.1.1`) for small corrections/clarifications
- minor (`1.2.0`) for new compatible workflow/features/rules
- major (`2.0.0`) for substantial architectural changes

Do not overwrite an old master when issuing a new version unless the user explicitly asks to do so.

## Core non-negotiable requirements

- Configurable primarily through `catalog.json`.
- Maintainable through the authorized GitHub integration.
- Compatible with GitHub Pages/free static hosting.
- Google Drive `miniature-galery` is the master/original image archive.
- Every incorporated user-supplied image has an archived original Drive copy.
- Drive originals are not resized, recompressed, converted, cropped or otherwise visually altered; filename normalization is allowed.
- Drive hierarchy is `miniature-galery / Universe / Faction / Subfaction / files`; no per-miniature folder.
- GitHub mirrors the classification hierarchy but stores optimized JPG web derivatives.
- GitHub gallery cards use dedicated lightweight thumbnails.
- Full/larger web images load when required rather than on every card.
- Filename suffixes identify asset purpose (`-mini`, `-thumb`, `-paint-sheet`, `-detail-01`, etc.).
- Supports multiple images per miniature.
- Painting Specification Sheets are first-class assets.
- Universe → Faction → Subfaction classification drives navigation/filtering.
- Responsive on desktop, tablet and mobile.
- Adding a miniature is a content operation, not a coding project.

## Project philosophy

The target workflow is approximately:

> “Add this miniature to the website. It is Advanced Recon Commando Trooper Fives, Star Wars, Galactic Republic, 501st Legion.”

ChatGPT should then organize the original assets in Google Drive, create the optimized GitHub derivatives, update the catalogue and repository, and verify the result with minimal additional intervention.

---

**Document:** GitHub-minis-master  
**Version:** 1.1.0  
**Purpose:** Recovery and continuation of the GitHub Miniature Gallery project, including the Google Drive master archive and optimized GitHub image workflow.
