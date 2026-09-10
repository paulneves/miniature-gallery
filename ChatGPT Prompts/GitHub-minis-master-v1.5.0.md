# GitHub-minis-master

**Version:** 1.5.0  
**Project:** Miniature Painting Collection  
**Repository:** `paulneves/miniature-gallery`  
**Public site:** `https://paulneves.github.io/miniature-gallery/`

## PURPOSE AND EXECUTION MODE
This is the autonomous bootstrap/recovery prompt for the Miniature Gallery. When supplied in a new chat, execute BOOTSTRAP immediately without waiting for another initialization instruction. After bootstrap remain READY for either image + Painting Specification Sheet + title (PHASE A), or a request to process pending models (PHASE B).

The live GitHub repository is authoritative. Preserve historical Masters. v1.5.0 supersedes conflicting workflow instructions in older versions. The failed v1.2.0 direct ChatGPT binary experiment is not a validated route.

## SOURCE-OF-TRUTH PRIORITY
1. Explicit current user instruction.
2. Current live GitHub repository.
3. Newest `GitHub-minis-master-v*.md` in GitHub.
4. Attached Master if no newer version exists.
5. Historical assumptions.

## BOOTSTRAP — AUTOMATIC
1. Connect to `paulneves/miniature-gallery` through the authorized GitHub integration.
2. Inspect the live repository before changing anything.
3. Read at minimum `catalog.json`, `index.html`, `css/style.css`, `js/gallery.js`, `README.md`, and newest Master.
4. If GitHub contains a newer Master than the attached file, use the newer Master.
5. Inspect `images/` and `uploads/`.
6. Confirm authorized Google Drive access to root archive `miniature-galery`.
7. Inspect `uploads/` for model manifests `*.json`. A valid manifest represents one pending model; image-file count does not.
8. Read each valid manifest title and build the pending-model list.
9. Do not process/move/delete pending models during bootstrap.
10. Do not modify GitHub or Drive merely during bootstrap.
11. Finish READY.

Mandatory READY report: Master version, GitHub status, Drive status, pending-model count, and title of every pending model. If none: `Pending models: 0 — queue empty.` Orphan files without manifests may be reported separately but never count as pending models.

## ARCHITECTURE
- Google Drive = unchanged original/master archive.
- GitHub `uploads/` = temporary model-package intake queue.
- GitHub `images/...` = final optimized JPG web assets.
- `catalog.json` = primary website content configuration.

Hierarchy: `Site → Universe → Faction → Subfaction → Miniature → Images`.
Drive: `miniature-galery/Universe/Faction/Subfaction/files`, no miniature folder.
GitHub final: `images/<universe>/<faction>/<subfaction>/`, no miniature folder.

## PAINT BRAND — FIRST-CLASS CATALOGUE FIELD
Every miniature/painting-sheet record has a paint brand represented by catalogue field:

`"paintBrand": "AK Interactive"`

Canonical brand names currently planned/supported:
- `AK Interactive`
- `Vallejo`
- `Army Painter`

Do not hard-code these as the only possible brands in the UI. The Paint Brand filter must derive its options dynamically from catalogue data so future brands appear without application-code changes.

All catalogue models created before v1.5.0 are known to use **AK Interactive**. For backwards compatibility, any legacy catalogue record without `paintBrand` must be interpreted by the website as `AK Interactive`. New records published from v1.5.0 onward must store `paintBrand` explicitly.

Paint Brand participates in:
- catalogue filtering;
- free-text search;
- model card/path metadata;
- viewer path/metadata;
- Phase A manifest;
- Phase B catalogue publication.

The user may combine Paint Brand with Universe, Faction and Subfaction filters.

## TITLE AND FILENAMES
User-supplied title is authoritative. Create a normalized lowercase slug.

Drive originals:
- `<slug>-mini.<original-extension>`
- `<slug>-paint-sheet.<original-extension>`
- `<slug>-detail-01.<original-extension>` etc.

Web derivatives:
- `<slug>-mini.jpg`
- `<slug>-thumb.jpg`
- `<slug>-paint-sheet.jpg`
- `<slug>-detail-01.jpg` etc.

Manifest: `<slug>.json`.

## GOOGLE DRIVE ORIGINALS — MANDATORY
Archive every incorporated original under `miniature-galery/Universe/Faction/Subfaction`. Rename only. Preserve exact bytes/content and original extension. Do not resize, recompress, convert, crop, recolour, sharpen, retouch or otherwise modify. Generated thumbnails/manifests need not be archived as originals.

## WEB DERIVATIVES — MANDATORY
Generate programmatically, not generatively. Normal package contains optimized `<slug>-mini.jpg`, lightweight `<slug>-thumb.jpg`, and optimized `<slug>-paint-sheet.jpg`. Preserve aspect ratio unless explicitly requested. Validate non-zero size, expected format and successful image decoding before email.

## MODEL MANIFEST — MANDATORY
Every Phase A package contains exactly one `<slug>.json`. It is the authoritative Phase A → Phase B handoff and model-level pending marker.

Minimum schema from v1.5.0:
```json
{
  "schemaVersion": 1,
  "id": "imperial-sniper-snowtrooper",
  "title": "Imperial Sniper Snowtrooper",
  "universe": "Star Wars",
  "faction": "Galactic Empire",
  "subfaction": "Snowtroopers",
  "paintBrand": "AK Interactive",
  "assets": {
    "miniature": "imperial-sniper-snowtrooper-mini.jpg",
    "thumbnail": "imperial-sniper-snowtrooper-thumb.jpg",
    "paintingSheet": "imperial-sniper-snowtrooper-paint-sheet.jpg"
  }
}
```

Rules: `schemaVersion` currently 1; `id` equals slug; title preserves supplied title; classification determines Phase B destination; `paintBrand` is mandatory for newly created manifests; `assets` maps roles to exact filenames. A valid manifest defines a pending model. Missing required declared assets means blocked/incomplete pending model.

For legacy manifests created before v1.5.0 that do not contain `paintBrand`, interpret them as `AK Interactive`, because every sheet loaded before this change uses AK Interactive. Do not apply that fallback to newly created manifests: new Phase A manifests must always include the field.

## PAINT BRAND DETERMINATION IN PHASE A
When the user supplies a new model:
- If the user explicitly states the paint brand, use it exactly in canonical form.
- If the Painting Specification Sheet clearly identifies the brand, use that brand.
- Do not infer a non-AK brand merely from miniature colours.
- Until the user begins supplying Vallejo or Army Painter sheets, the established current workflow brand is AK Interactive.
- When genuinely ambiguous, ask for the brand rather than silently assigning the wrong one.

## VALIDATED INTAKE ROUTE
`web JPGs + manifest → Gmail → Pipedream → GitHub uploads/`

Pipedream workflow: **Miniature Gallery Upload**. Gmail: `3dvikingshop@gmail.com`. GitHub: `paulneves/miniature-gallery`. Trigger: `has:attachment subject:"Miniature Gallery"`. Flow: `trigger → list_thread_messages → find_attachments → process_attachments`. Pipedream checks Gmail approximately every 15 minutes.

## PIPEDREAM CONCURRENT-INTAKE RULES — MANDATORY
Several model emails may be processed concurrently. `process_attachments` must:
1. Process attachments sequentially within each execution; no concurrent GitHub writes via `Promise.all()`.
2. Order non-manifest assets first and `.json` manifest last.
3. Immediately before each PUT attempt, GET current destination state and fresh existing-file SHA.
4. New file: PUT without SHA; existing file: PUT with freshly obtained SHA.
5. Never blindly reuse stale SHA after conflict.
6. On HTTP 409, wait, refresh state and retry.
7. Treat concurrency-related HTTP 422 similarly when appropriate.
8. Maximum 5 attempts with increasing waits approximately 1s, 2s, 3s, 4s.
9. If retries fail, surface failure; never falsely report success.
10. Record attempt information when practical.
11. Preserve exact downloaded attachment bytes; decode Gmail Base64URL correctly and validate byte length against metadata when supplied.
12. Sanitize filenames against path manipulation.
13. Upload manifest last because its presence declares the model pending.

## PHASE A — ARCHIVE, PACKAGE, EMAIL, STOP
Trigger: image + Painting Specification Sheet + title, optionally additional images.

1. Inspect repository/catalogue as needed.
2. Identify miniature, sheet and additional views.
3. Use supplied title as authoritative.
4. Determine Universe/Faction/Subfaction when reasonably clear.
5. Determine Paint Brand according to the Paint Brand rules above.
6. Normalize slug/filenames.
7. Ensure Drive path exists.
8. Upload renamed originals to Drive unchanged.
9. Generate and validate web JPGs.
10. Create and validate `<slug>.json`, including mandatory `paintBrand` and exact asset filenames.
11. Send one email per model to `3dvikingshop@gmail.com`, subject exactly `Miniature Gallery`, attaching web JPGs and manifest.
12. Report Phase A sent.
13. **STOP. Do not immediately process GitHub `uploads/`.**

Do not update `catalog.json` in Phase A.

## PENDING MODEL DEFINITION
A pending model is represented by a valid `<slug>.json` in `uploads/`. Count models, not files. Always report total pending count plus titles; indicate blocked/incomplete models where applicable.

## PHASE B COMMANDS / ALIASES
Equivalent commands include `processar github`, `processa github`, `processar pendentes`, `processa pendentes`, `processar fase b`, `processa fase b`. Any semantically unambiguous request to process/publish pending models also triggers Phase B. Bare `processa`/`avança` triggers only when immediate context clearly refers to pending models.

## PHASE B — PROCESS PENDING MODELS
1. Inspect current `uploads/` and parse manifests.
2. Count/identify models by manifest title.
3. Process every complete valid pending model unless user limits scope.
4. Verify declared assets exist; leave incomplete models pending and continue safely with complete models.
5. Use manifest Universe/Faction/Subfaction and `paintBrand` as authoritative publication metadata unless user corrects them.
6. For legacy manifests missing `paintBrand`, use `AK Interactive`.
7. Destination: `images/<universe>/<faction>/<subfaction>/`.
8. Move/reuse assets into final paths.
9. Add/update the miniature in `catalog.json`, explicitly writing `paintBrand` for newly published/updated records.
10. Preserve unrelated records and avoid duplicate IDs.
11. Catalogue paths reference final `images/...`, never `uploads/...`.
12. Validate final assets and JSON.
13. Only after successful asset placement and catalogue update remove source assets.
14. Delete manifest last.
15. On failure retain recoverable assets/manifest.
16. Verify GitHub Pages where practical.
17. Report successful, still pending, blocked/incomplete, and commits where applicable.

## QUEUE INVARIANT
`uploads/` contains intake awaiting successful Phase B. Manifest = model pending marker. Successfully published model has final assets, valid catalogue entry, and no remaining source assets/manifest in `uploads/`. Missing `uploads/` means empty queue.

## SAFE GITHUB RULES
Never force `main`. Re-read current state before SHA-dependent writes. Preserve unrelated concurrent changes. Prefer logically atomic Phase B publication when tools permit. Reuse valid upload blobs when moving. On non-fast-forward rebuild on newest `main`. New binaries enter via Pipedream, not failed v1.2.0 direct binary intake.

## CATALOGUE / APPLICATION
Catalogue records contain as applicable: `id`, `name`, `universe`, `faction`, `subfaction`, `paintBrand`, `description`, `tags`, `images`. Painting Specification Sheets are first-class assets and multiple images are supported.

The site must provide dynamic filters for Universe, Faction, Subfaction and **Paint Brand**. Paint Brand options are derived from the effective catalogue values. Legacy records lacking `paintBrand` have effective value `AK Interactive`.

Adding a normal miniature is a content operation. Do not edit HTML/CSS/JS merely to add content and do not ask the user to manually edit JSON. Site remains responsive on desktop/iPad/mobile, uses lazy thumbnails/on-demand full images and does not rely solely on hover.

## SECURITY
Never ask for GitHub passwords, PATs, Google credentials, Pipedream OAuth tokens or other authentication secrets. Use authorized integrations.

## VERSIONING
Retain historical Masters. Patch = corrections/reliability refinements; minor = compatible feature/workflow/schema additions; major = substantial architecture change. v1.5.0 is a minor release because Paint Brand becomes a first-class catalogue/manifest field and site filter.

## CORE NON-NEGOTIABLE REQUIREMENTS
- Auto-bootstrap and READY in new chat.
- READY reports count and list of pending models without modifying them.
- User title authoritative.
- Drive originals unchanged except filename.
- Programmatic JPG derivatives.
- Every new Phase A manifest contains `paintBrand`.
- Legacy records/manifests without brand are AK Interactive.
- Paint Brand is dynamically filterable and searchable.
- Future canonical brands include Vallejo and Army Painter without requiring new filter code.
- New binaries enter through Gmail → Pipedream → `uploads/`.
- Pipedream sequential assets-before-manifest with fresh-state 409/appropriate-422 bounded retry.
- Phase A stops after email and does not update catalogue.
- Phase B only on explicit/semantically clear request.
- Successful Phase B removes assets and manifest last.
- Failed/incomplete models remain recoverable.
- Final assets under `images/<universe>/<faction>/<subfaction>/`.

## EXPECTED NEW-CHAT BEHAVIOR
Attaching this file alone is sufficient instruction. Execute BOOTSTRAP immediately; do not ask what the user wants before initialization. After READY wait for image + sheet + title (Phase A) or a Phase B command.

---
**Document:** GitHub-minis-master  
**Version:** 1.5.0  
**Purpose:** Autonomous Miniature Gallery recovery/publication with Paint Brand metadata/filtering, manifest-based pending models and concurrency-safe Pipedream intake.
