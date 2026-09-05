# GitHub-minis-master

**Version:** 1.2.0  
**Project:** Miniature Painting Collection  
**Repository:** `paulneves/miniature-gallery`  
**Public site:** `https://paulneves.github.io/miniature-gallery/`

## Purpose

This is the authoritative recovery prompt for continuing the Miniature Gallery project in a new ChatGPT conversation. The live GitHub repository is the authoritative implementation; this master records the intended architecture, rules and tested publishing workflow.

## Recovery procedure — mandatory in a new chat

1. Connect through the authorized GitHub integration and confirm access to `paulneves/miniature-gallery`.
2. Inspect the current repository before changing anything.
3. Read at minimum `index.html`, `catalog.json`, `css/style.css`, `js/gallery.js`, `README.md`, and the newest `ChatGPT Prompts/GitHub-minis-master-v*.md`.
4. Use the authorized Google Drive integration for the `miniature-galery` original/master archive.
5. Preserve repository changes newer than this document.
6. Continue from the user's current instruction; do not recreate completed work.
7. When appropriate, verify the public GitHub Pages site after publishing.

## Source-of-truth priority

1. Explicit instruction in the current conversation.
2. Current GitHub repository contents.
3. Newest GitHub-minis-master.
4. Historical assumptions.

## Main objective

Maintain a free, configurable static website for the user's painted miniature collection and associated Painting Specification Sheets, mainly Warhammer 40,000 and Star Wars. Routine catalogue additions must not require editing HTML, CSS or JavaScript. Content is configured primarily through `catalog.json`.

## Storage and publication architecture

- **Google Drive = original/master archive**
- **GitHub = optimized JPG web derivatives**

Google Drive is not the website CDN. GitHub Pages normally serves the optimized derivatives stored in the repository.

## Google Drive original archive — mandatory

Root folder: `miniature-galery`

Use exactly four folder levels including the root: `miniature-galery / Universe / Faction / Subfaction / files`. There is no folder per miniature/character.

For every incorporated user-supplied image, archive an original copy in Drive. The Drive original must remain unchanged except for filename normalization: do not resize, crop, recompress, convert format, recolour, sharpen or otherwise modify. Preserve the original extension/format. A generated thumbnail does not need to be stored in Drive because it is reproducible.

## Classification

Primary hierarchy: Site → Universe → Faction → Subfaction → Miniature → Images.

Examples: `Warhammer 40,000 → Space Marines → Raptors → Primaris Infiltrator`, `Star Wars → Galactic Republic → 501st Legion → Captain Rex`, `Star Wars → Galactic Empire → Snowtroopers → Imperial Sniper Snowtrooper`.

Filter values must be derived dynamically from `catalog.json`, not hard-coded.

## Filename normalization — mandatory

The title supplied by the user is authoritative for naming. Arbitrary upload filenames must not determine archive or publication names. Use a normalized lowercase slug.

Drive originals: `<slug>-mini.<original-extension>`, `<slug>-paint-sheet.<original-extension>`, `<slug>-detail-01.<original-extension>`.

GitHub derivatives: `<slug>-mini.jpg`, `<slug>-thumb.jpg`, `<slug>-paint-sheet.jpg`, `<slug>-detail-01.jpg`.

## GitHub image hierarchy

Mirror classification as `images/Universe/Faction/Subfaction/optimized JPG files`. There is no per-miniature folder.

Example: `images/star-wars/galactic-empire/snowtroopers/imperial-sniper-snowtrooper-mini.jpg`, `-thumb.jpg`, and `-paint-sheet.jpg`.

## Web derivatives

Generate web derivatives programmatically from the best available original/master asset. Do not use generative image editing for routine optimization. GitHub web images are JPG. `-mini.jpg` is the optimized viewing image, `-thumb.jpg` is a lightweight gallery thumbnail, and `-paint-sheet.jpg` is the optimized sheet. Generate from the original, preserve aspect ratio unless explicitly asked otherwise, use thumbnails for cards and load full web images on demand.

## Tested binary GitHub publishing workflow — mandatory

**Binary upload to GitHub has been successfully tested through the authorized GitHub integration. Do not assume binary publishing is unavailable and do not require a GitHub Action, PAT, manual upload or local publisher merely to upload JPG files.**

Use the Git Database API exposed by the connector:

`optimized JPG bytes → Base64 → create_blob (encoding=base64) → create_tree (based on current HEAD tree) → create_commit (parent=current HEAD) → update_ref(main,new commit)`.

### Safe commit procedure

Before constructing the final tree: fetch current `main` HEAD; use its current tree as base; create Base64 blobs for binary assets; create/update the `catalog.json` blob in the same publication transaction when practical; build the tree; create a commit whose parent is current HEAD; update `main` with a normal non-forced fast-forward. **Never force-update `main` for a routine catalogue publication.**

If `update_ref` reports `Update is not a fast forward`, another commit reached `main`. Do not force it. Fetch the new HEAD, rebuild the tree on the latest tree, create a new commit with latest HEAD as parent, and retry without force. This recovery path was successfully tested.

### Validated test

The mechanism was validated with **Imperial Sniper Snowtrooper**, publishing JPG assets under `images/star-wars/galactic-empire/snowtroopers/`. Successful binary commit: `c1225a12ec23c515b4950d467a26938e0782144a`.

## Catalogue model

A record contains `id`, `name`, `universe`, `faction`, `subfaction`, `description`, `tags`, and `images`. Preserve existing records and avoid duplicate IDs. Miniature image entries normally use `thumbnail` for the card and `url` for the viewer. Painting sheets are first-class image entries.

Supported/future image types include `miniature`, `painting-sheet`, `front`, `rear`, `left`, `right`, `detail`, `helmet`, `weapon`, `base`, and `reference`.

## Current application architecture

Repository contains `index.html`, `catalog.json`, `README.md`, `css/style.css`, `js/gallery.js`, `images/Universe/Faction/Subfaction/*.jpg`, and versioned files under `ChatGPT Prompts/`.

The application provides a responsive dark gallery, text search, dynamic Universe/Faction/Subfaction filters, lazy thumbnails, modal/detail viewer, multiple-image switching, Painting Sheet support, tags and graceful image failure handling. Desktop, iPad/tablet and mobile are required. Do not rely solely on hover.

## Routine new-miniature workflow — execute, do not merely describe

When the user supplies a miniature image and Painting Specification Sheet with a title:

1. Inspect current GitHub repository and `catalog.json`.
2. Determine whether the miniature already exists.
3. Determine Universe, Faction and Subfaction when reasonably clear; do not ask unnecessary questions.
4. Identify miniature vs Painting Specification Sheet uploads.
5. Normalize slug and filenames.
6. Ensure the Drive `miniature-galery/Universe/Faction/Subfaction` path exists.
7. Upload renamed originals to Drive without altering image content or format.
8. Generate optimized JPG web derivatives and dedicated thumbnail programmatically.
9. Encode each web JPG as Base64 and create GitHub blobs.
10. Fetch/reconfirm current `main` HEAD before final commit construction.
11. Update/add the miniature in `catalog.json`.
12. Create one tree and preferably one commit containing binary assets and catalogue change.
13. Update `main` without force.
14. On non-fast-forward, rebuild on newest HEAD and retry without force.
15. Verify repository paths and `catalog.json`.
16. Where practical, verify GitHub Pages.
17. Report concrete paths and commit SHA.

Do not stop after generating local derivatives if the user asked to add the miniature. Complete Drive + GitHub + catalogue workflow in the same turn when integrations permit it.

## Routine updates are content operations

Do not edit `index.html`, `style.css` or `gallery.js` just to add a normal miniature. Do not ask the user to manually edit JSON.

## Security

Never ask the user to paste GitHub passwords, PATs, Google credentials, service-account secrets or other private authentication secrets. Use authorized integrations.

## Performance and reliability

Use dedicated thumbnails, lazy loading and on-demand full images. Keep archival originals in Drive. One missing image must not break the catalogue. Maintain useful alt text, keyboard accessibility, visible focus states and sufficient contrast.

## Versioning

Master prompts are retained under `ChatGPT Prompts/`. Patch = corrections; minor = compatible workflow/features/rules; major = substantial architecture change. Do not overwrite old masters unless explicitly requested.

## Core non-negotiable requirements

- `catalog.json` is the primary content configuration.
- Google Drive `miniature-galery` is the master/original archive.
- Originals are archived unchanged except filename.
- Drive hierarchy is root → Universe → Faction → Subfaction; no miniature folder.
- GitHub mirrors classification and stores optimized JPG derivatives.
- Publish GitHub binary assets through Base64 Git blobs using the tested Blob → Tree → Commit → Ref workflow.
- Never force `main` for a routine concurrent-update conflict; rebuild on current HEAD.
- Cards use lightweight thumbnails; larger images load on demand.
- Painting Specification Sheets are first-class assets.
- Multiple images per miniature are supported.
- Adding a normal miniature is a content operation, not an application rewrite.
- Use authorized GitHub and Google Drive integrations; do not request user secrets.

## New-chat test instruction

> Use the attached `GitHub-minis-master-v1.2.0.md` to recover my Miniature Gallery project. Inspect the live GitHub repository first. Then I will send a miniature image and its Painting Specification Sheet. Add it through the complete Google Drive original-archive + optimized GitHub binary publication + `catalog.json` workflow.

---

**Document:** GitHub-minis-master  
**Version:** 1.2.0  
**Purpose:** Recovery and continuation of the Miniature Gallery project, including the validated direct binary GitHub publishing workflow.
