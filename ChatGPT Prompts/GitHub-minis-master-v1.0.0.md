# GitHub-minis-master

**Version:** 1.0.0  
**Project:** Miniature Painting Collection  
**Repository:** `paulneves/miniature-gallery`

## Purpose

This document is the master context and recovery prompt for the Miniature Gallery project. In a new ChatGPT conversation, use it to recover the project state. Treat the live GitHub repository as the authoritative implementation and this document as the authoritative project intent/recovery context.

## Recovery procedure

1. Connect to GitHub through the authorized GitHub integration.
2. Confirm access to `paulneves/miniature-gallery`.
3. Inspect the current repository before making changes.
4. Read at minimum `index.html`, `catalog.json`, `css/style.css`, `js/gallery.js`, and `README.md`.
5. Check the GitHub Pages deployment at `https://paulneves.github.io/miniature-gallery/` when appropriate.
6. Preserve repository changes newer than this document.
7. Continue from the user's current instruction; do not recreate completed work.

## Source-of-truth priority

When information conflicts, use this order:

1. User's explicit instruction in the current conversation.
2. Current GitHub repository contents.
3. This GitHub-minis-master.
4. Historical assumptions.

## Main objective

Build a free, maintainable and configurable website for displaying the user's painted miniature collection and associated Painting Specification Sheets, primarily for Warhammer 40,000 and Star Wars.

The central architectural requirement is that normal catalogue updates must not require editing HTML, CSS or JavaScript. Miniatures and metadata are defined in a configuration/data file.

## Hosting

The site uses GitHub Pages from the `main` branch and repository root. Intended public site:

`https://paulneves.github.io/miniature-gallery/`

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
└── ChatGPT Prompts/
    └── GitHub-minis-master-v1.0.0.md
```

Future local image assets may be stored under `images/`.

## Configuration-first architecture

`catalog.json` is the principal content configuration file. HTML provides the application shell, CSS controls presentation, and JavaScript reads the catalogue and dynamically constructs the gallery.

Adding a normal miniature should usually require only adding/referencing its images and adding/updating one object in `catalog.json`.

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

Filter values should be derived dynamically from catalogue data rather than hard-coded.

## Miniature data model

A miniature supports a stable unique ID, name, universe, faction, subfaction, description, tags and an array of images.

Example:

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

A miniature can have multiple images. An image supports type, title, URL, optional external source link and optional credit.

```json
{
  "type": "miniature",
  "title": "Front View",
  "url": "images/star-wars/captain-rex/front.jpg",
  "link": "https://example.com/captain-rex",
  "credit": "Example Studio"
}
```

### Local and remote images

This is an explicit requirement. `url` can be a local repository path or an external image URL. Do not force all images into GitHub.

`url` is the image displayed by the site. `link` is an optional external webpage associated with that image. These are separate concepts.

External image hotlinking may be blocked by third-party sites. Remote image failures must not break the gallery. The optional source link should remain useful where possible.

### Image types

The architecture must tolerate multiple and future image types, including:

- miniature
- painting-sheet
- front
- rear
- left
- right
- detail
- helmet
- weapon
- base
- reference

The first image of type `miniature` should normally be the catalogue card image. If none exists, the first available image may be used as fallback.

## Painting Specification Sheets

Painting Specification Sheets are first-class catalogue assets. They are normally tall A4 portrait painting-reference images generated in the user's separate miniature-painting workflow.

The viewer must allow switching between the miniature and Painting Specification Sheet and should use contain-style presentation for tall sheets rather than cropping them.

## Initial demo records

The initial implementation contains four example records:

- Warhammer 40,000 → Space Marines → Raptors → Primaris Infiltrator
- Warhammer 40,000 → Space Marines → Imperial Fists → Primaris Lieutenant
- Star Wars → Galactic Republic → 501st Legion → Captain Rex
- Star Wars → Galactic Empire → Shoretroopers → Imperial Shoretrooper

At version 1.0.0 the catalogue uses remote placeholder images to demonstrate remote-image support. They are not authoritative miniature images and should be replaced with real collection images.

An earlier prototype had recovered Painting Specification Sheets for these four records from the user's ChatGPT file library and generated temporary miniature thumbnails by cropping the sheet preview. Those crops are not original uploaded miniature photographs. If originals are required, retrieve the original images rather than silently substituting crops.

## Current site features

The initial GitHub implementation includes:

- responsive dark gallery interface
- header and catalogue counter
- text search
- Universe filter
- Faction filter
- Subfaction filter
- dynamically generated filter values
- responsive miniature cards
- lazy-loaded card images
- modal/detail viewer
- multiple-image switching
- Painting Sheet support
- optional image source links and credits
- tags
- graceful unavailable-image handling
- mobile/tablet responsive layout

Search should cover miniature name, universe, faction, subfaction, description and tags, and work together with filters.

Filters should cascade logically according to the selected Universe/Faction/Subfaction.

## Future-compatible navigation

Keep the architecture compatible with later addition of previous/next miniature navigation, breadcrumbs, direct miniature URLs, Universe landing pages, Faction landing pages and Subfaction landing pages.

Potential sorting options include name, universe, faction, subfaction, added date and custom order.

## Site-level configuration

`catalog.json` also contains site configuration such as title, subtitle, eyebrow text and accent colour. Presentation options may gradually become configurable, but avoid turning the configuration file into an unnecessarily complex framework.

Possible future configurable properties include logos, cover image, ordering, enabled filters, image behaviour, Painting Sheet visibility and descriptions.

## Design principles

The miniatures should be the visual priority. The site should feel like a curated miniature collection/gallery rather than a generic database application.

Conceptual references discussed include Putty & Paint, Starbrush Studio, The WAAAGH Studios and CoolMiniOrNot. Putty & Paint was considered especially relevant. Do not copy proprietary designs; use references only as inspiration.

A card normally displays miniature image, name, hierarchy context and an indication of additional images. A future optional enhancement may allow hover/swipe switching between miniature and Painting Specification Sheet, provided tablet/mobile usability remains good.

The detail view should support title, breadcrumb/hierarchy, large image, image selector, Painting Specification Sheet, description, tags, source link and credit.

## Responsive requirement

Desktop, tablet and mobile are required. Tablet/iPad behaviour is important. Do not rely solely on hover interactions.

## Free/static architecture

Keep the normal gallery compatible with free static hosting using GitHub, GitHub Pages, HTML, CSS, JavaScript and JSON. No database or server-side backend is required for the normal gallery.

## GitHub maintenance workflow

Expected user interaction:

> Add this to the site: Star Wars → Galactic Empire → Stormtroopers.

ChatGPT should then:

1. Inspect the repository and current `catalog.json`.
2. Determine whether the miniature already exists.
3. Add/update image assets or external URLs.
4. Update `catalog.json` while preserving existing records.
5. Commit changes through the authorized GitHub integration.
6. Verify repository state.
7. Where possible, verify the public GitHub Pages deployment.

Do not require the user to manually edit JSON for routine updates.

Never ask the user to paste GitHub passwords, Personal Access Tokens or private authentication secrets into chat. Use the connected GitHub integration and only authorized repositories.

## Update philosophy

Routine catalogue additions are content operations, not application rewrites. Adding Darth Vader, for example, should normally mean providing/storing images, appending/updating the catalogue record and committing. It should not require editing `index.html`, `style.css` or `gallery.js` unless a new feature is actually being introduced.

Avoid unnecessary breaking schema changes. Preserve existing records and migrate/document data if a schema change is genuinely required. Keep `README.md` synchronized with meaningful architecture changes.

## Potential publisher/admin tool

A future catalogue publisher/admin tool was discussed. Browser-side GitHub token exposure should be avoided. Because the user works with C#, .NET Framework, WinForms and Magick.NET, a local C# Miniature Gallery Publisher may ultimately be preferable.

Potential workflow:

```text
Select miniature image
Select painting sheet
Enter title
Choose Universe
Choose Faction
Choose Subfaction
Generate thumbnail
Copy/upload files
Update catalog.json
Commit/push to GitHub
```

Possible features include filename normalization, thumbnail generation, JPEG/WebP optimization, preserving high-resolution sheets, folder creation, slug generation, duplicate-ID validation, JSON validation, Git commit/push and reporting the resulting public URL.

## Recommended local image structure

```text
images/
├── warhammer/
│   └── raptors/
│       └── primaris-infiltrator/
│           ├── miniature.jpg
│           ├── painting-sheet.png
│           └── detail-01.jpg
└── star-wars/
    └── galactic-republic/
        └── 501st-legion/
            └── captain-rex/
                ├── miniature.jpg
                ├── painting-sheet.png
                └── rear.jpg
```

The exact folder hierarchy can be simplified later. `catalog.json` remains authoritative.

## Performance

As the collection grows, consider thumbnails, lazy loading, WebP/AVIF where appropriate, avoiding full-resolution sheets in gallery cards, loading high-resolution sheets on demand, caching and eventually progressive rendering/pagination if needed. Do not introduce a backend prematurely.

## Accessibility

Maintain meaningful image alt text, keyboard-accessible cards and selectors, visible focus states, labelled search/filter controls, sufficient contrast and a closeable modal/dialog.

## Error handling

Gracefully handle missing/blocked images, missing optional metadata, empty search results, a miniature with one image, missing Painting Sheet, unavailable source links and malformed catalogue data where practical. One bad remote image must not break the catalogue.

## Current next steps at v1.0.0

1. Verify the GitHub Pages deployment.
2. Replace placeholder images with real miniature images and real Painting Specification Sheets.
3. Evaluate the live design using real content.
4. Improve the visual design based on real content.
5. Add richer navigation/sorting where useful.
6. Populate more of the existing Warhammer 40,000 and Star Wars collection.

## Core non-negotiable requirements

- Configurable primarily by a data/configuration file.
- Maintainable directly through the authorized GitHub integration.
- Compatible with GitHub Pages/free static hosting.
- Supports local and remote images.
- Supports multiple images per miniature.
- Painting Specification Sheets are first-class assets.
- Universe → Faction → Subfaction classification drives navigation/filtering.
- Responsive on desktop, tablet and mobile.
- Adding a miniature should be a content operation, not a coding project.

## Project philosophy

The target workflow is approximately:

> “Add this miniature to the website. It is Advanced Recon Commando Trooper Fives, Star Wars, Galactic Republic, 501st Legion.”

ChatGPT should then be able to update the catalogue and repository with minimal additional intervention. The user should not need to understand or manually maintain the underlying HTML/JavaScript for routine collection changes.

---

**Document:** GitHub-minis-master  
**Version:** 1.0.0  
**Purpose:** Recovery and continuation of the GitHub Miniature Gallery project.
