# GitHub-minis-master

**Version:** 1.3.0  
**Project:** Miniature Painting Collection  
**Repository:** `paulneves/miniature-gallery`  
**Public site:** `https://paulneves.github.io/miniature-gallery/`

## Purpose
Authoritative recovery prompt for the Miniature Gallery project. The live GitHub repository is the authoritative implementation. Version 1.3.0 supersedes the direct ChatGPT-to-GitHub binary publication procedure in v1.2.0: that binary test produced invalid repository images and must not be treated as validated.

## Recovery procedure
1. Inspect the live `paulneves/miniature-gallery` repository first.
2. Read `catalog.json`, `index.html`, `css/style.css`, `js/gallery.js`, `README.md`, and the newest versioned master.
3. Use Google Drive `miniature-galery` as the original/master archive.
4. Preserve newer repository changes and continue from the user's current instruction.
5. Use Email → Gmail → Pipedream → GitHub `uploads/` for new binary intake.
6. Verify GitHub Pages after final publication when practical.

## Source-of-truth priority
1. Current user instruction.
2. Current GitHub repository.
3. Newest master prompt.
4. Historical masters/assumptions.

## Architecture
- **Google Drive = unchanged originals/master archive**
- **GitHub `uploads/` = temporary intake queue**
- **GitHub `images/...` = final optimized JPG web assets**
- **`catalog.json` = primary content configuration**

Primary hierarchy: `Site → Universe → Faction → Subfaction → Miniature → Images`.

Drive hierarchy: `miniature-galery / Universe / Faction / Subfaction / files`. There is no miniature folder.

Final GitHub hierarchy: `images/<universe>/<faction>/<subfaction>/`. There is no miniature folder.

## Title and filenames
The title supplied with the images is authoritative. Arbitrary camera/upload filenames do not determine identity when a title exists. Create a normalized lowercase slug.

Drive originals:
- `<slug>-mini.<original-extension>`
- `<slug>-paint-sheet.<original-extension>`
- `<slug>-detail-01.<original-extension>`

Web derivatives:
- `<slug>-mini.jpg`
- `<slug>-thumb.jpg`
- `<slug>-paint-sheet.jpg`
- `<slug>-detail-01.jpg`

The normalized basename is used later to group related pending files.

## Google Drive originals — mandatory
For every incorporated user-supplied original:
- rename only;
- preserve original bytes/content and extension;
- do not resize, recompress, convert, crop, recolour, sharpen, retouch or otherwise modify.
A generated thumbnail is not an archive original and need not be stored in Drive.

## Web derivatives — mandatory
Generate programmatically from the originals, not with generative image editing:
1. `<slug>-mini.jpg` — optimized viewing JPG.
2. `<slug>-thumb.jpg` — lightweight gallery thumbnail.
3. `<slug>-paint-sheet.jpg` — optimized web JPG of the Painting Specification Sheet.
Preserve aspect ratio unless explicitly requested otherwise.

## Validated binary intake
Validated route:
`web JPGs → Gmail → Pipedream → GitHub uploads/`

Pipedream workflow: **Miniature Gallery Upload**  
Gmail: `3dvikingshop@gmail.com`  
Repository: `paulneves/miniature-gallery`  
Trigger filter: `has:attachment subject:"Miniature Gallery"`  
Functional flow: `trigger → list_thread_messages → find_attachments → process_attachments`

It has been tested with independent emails and a multi-attachment email. Images arrived correctly in GitHub. Gmail is polled approximately every 15 minutes, so publication is intentionally split into two phases.

## PHASE A — Prepare, archive and send
When the user supplies **image + Painting Specification Sheet + title**:
1. Inspect repository/catalogue as needed.
2. Determine Universe, Faction and Subfaction when reasonably clear.
3. Identify miniature, sheet and any additional views.
4. Normalize slug and filenames.
5. Ensure `miniature-galery/Universe/Faction/Subfaction` exists in Drive.
6. Upload renamed originals to Drive unchanged.
7. Generate optimized JPG miniature, thumbnail and sheet programmatically.
8. Validate generated files: non-zero, expected format, decodable image.
9. Send one email to `3dvikingshop@gmail.com`, subject exactly `Miniature Gallery`, with all web derivatives for that miniature attached.
10. Report that the intake email was sent.
11. **STOP. Do not process GitHub `uploads/` immediately.**

This stop is mandatory because Pipedream may take up to approximately 15 minutes. Do not update `catalog.json` in Phase A.

## PHASE B — Process pending GitHub uploads
Start only when the user explicitly asks to process pending GitHub uploads.

1. Inspect current `uploads/`.
2. Treat only files actually present there as pending.
3. Group by normalized slug and suffix (`-mini`, `-thumb`, `-paint-sheet`, `-detail-NN`).
4. Process every complete recognizable pending set, not just one.
5. Determine the correct Universe/Faction/Subfaction from the established title/classification. Ask only if genuinely ambiguous.
6. Move assets to `images/<universe>/<faction>/<subfaction>/`.
7. Update/add the miniature in `catalog.json`, preserving existing records and avoiding duplicate IDs.
8. Catalogue paths must reference final `images/...`, never `uploads/...`.
9. Thumbnail points to `-thumb.jpg`; viewer uses optimized full JPGs.
10. Remove every successfully incorporated source file from `uploads/`.
11. Do not delete an upload whose publication or catalogue update failed.
12. Validate `catalog.json`, final paths and, when practical, GitHub Pages.
13. Report published items and anything still pending.

### Queue invariant
`uploads/` contains **only pending work**. Successfully published files must no longer exist there. If `uploads/` does not exist, treat it as an empty queue because Git does not preserve empty directories.

## Safe GitHub rules
- Never force-update `main` for routine work.
- Re-read current state/SHAs before dependent writes.
- Preserve unrelated concurrent changes.
- Prefer logically atomic publication of a miniature set plus `catalog.json` when available operations permit.
- On non-fast-forward, rebuild on newest `main`.
- Do not use the invalid v1.2.0 direct binary Blob → Tree → Commit procedure as the intake mechanism.

## Catalogue
Records contain as applicable: `id`, `name`, `universe`, `faction`, `subfaction`, `description`, `tags`, `images`. Painting Specification Sheets are first-class assets. Multiple images are supported. Preserve existing records and avoid duplicate IDs. Filter values are derived dynamically from `catalog.json`.

## Application
The repository contains `index.html`, `catalog.json`, `README.md`, `css/style.css`, `js/gallery.js`, `images/...`, temporary `uploads/`, and versioned prompts under `ChatGPT Prompts/`.

Adding a normal miniature is a content operation. Do not edit HTML/CSS/JS merely to add catalogue content, and do not ask the user to manually edit JSON.

The site must remain responsive on desktop, iPad/tablet and mobile, use lightweight/lazy thumbnails, load larger images on demand, support Painting Sheets and multiple images, and not rely solely on hover.

## Security
Never ask for GitHub passwords, PATs, Google credentials, Pipedream OAuth tokens or other authentication secrets. Use authorized integrations.

## Deferred Phase 2 improvements
The priority is to finish and operate the end-to-end MVP. Do not block publication on deferred improvements such as duplicate-email hardening, collision-proof intake names, richer admin UI, Pipedream refinements, or commit optimization.

## Versioning
Retain historical masters under `ChatGPT Prompts/`.
- Patch = corrections.
- Minor = compatible workflow/features/rules.
- Major = substantial architecture change.
Do not overwrite historical masters unless explicitly requested.

## Core non-negotiable requirements
- User-supplied title is authoritative.
- Drive originals remain unchanged except filename.
- Drive hierarchy is root → Universe → Faction → Subfaction.
- Web derivatives are programmatically generated JPGs.
- New binaries enter through Email → Gmail → Pipedream → `uploads/`.
- Phase A stops after sending the email.
- Phase B begins only on explicit request to process pending uploads.
- `uploads/` is temporary and contains only pending work.
- Successful Phase B removes processed queue files.
- Final assets live under `images/<universe>/<faction>/<subfaction>/`.
- `catalog.json` is updated only after files are actually present during Phase B.
- Cards use thumbnails; larger images load on demand.
- Never use the failed v1.2.0 direct binary test as evidence of a valid route.

## New-chat recovery instruction
> Use `GitHub-minis-master-v1.3.0.md` to recover my Miniature Gallery project. Inspect the live repository first. For a new miniature, archive renamed originals unchanged in Google Drive, generate the JPG web assets, email them through the validated Pipedream intake and stop. Only when I later ask to process pending GitHub uploads should you organize `uploads/`, update `catalog.json`, remove successfully processed queue files and verify publication.

---
**Document:** GitHub-minis-master  
**Version:** 1.3.0  
**Purpose:** Recovery and continuation using the validated two-phase Gmail/Pipedream GitHub intake workflow.
