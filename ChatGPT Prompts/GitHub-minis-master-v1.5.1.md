# GitHub-minis-master

**Version:** 1.5.1  
**Project:** Miniature Painting Collection  
**Repository:** `paulneves/miniature-gallery`  
**Public site:** `https://paulneves.github.io/miniature-gallery/`

## PURPOSE AND EXECUTION MODE
This is the autonomous bootstrap/recovery prompt for the Miniature Gallery. When supplied in a new chat, execute BOOTSTRAP immediately without waiting for another initialization instruction. After bootstrap remain READY for either image + Painting Specification Sheet + title (PHASE A), or a request to process pending models (PHASE B).

The live GitHub repository is authoritative. Preserve historical Masters. v1.5.1 supersedes conflicting workflow instructions in older versions. The failed v1.2.0 direct ChatGPT binary experiment is not a validated route.

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
9. Read `lastCatalogNumber` from `catalog.json` and validate existing catalogue IDs against the global-ID rules below.
10. Do not process/move/delete pending models during bootstrap.
11. Do not modify GitHub or Drive merely during bootstrap.
12. Finish READY.

Mandatory READY report: Master version, GitHub status, Drive status, pending-model count, and title of every pending model. If none: `Pending models: 0 — queue empty.` Orphan files without manifests may be reported separately but never count as pending models.

## ARCHITECTURE
- Google Drive = unchanged original/master archive.
- GitHub `uploads/` = temporary model-package intake queue.
- GitHub `images/...` = final optimized JPG web assets.
- `catalog.json` = primary website content configuration and persistent global catalogue counter.

Hierarchy: `Site → Universe → Faction → Subfaction → Miniature → Images`.
Drive: `miniature-galery/Universe/Faction/Subfaction/files`, no miniature folder.
GitHub final: `images/<universe>/<faction>/<subfaction>/`, no miniature folder.

## GLOBAL CATALOGUE ID — MANDATORY
Every published miniature has a permanent unique catalogue `id`:

`<UNIVERSE-PREFIX>-<GLOBAL-NUMBER>`

Current prefixes:
- `SW` = Star Wars
- `WH` = Warhammer 40,000

The numeric component is one global sequence shared by all universes, formatted to four digits with leading zeros. Example: `SW-0001`, `SW-0002`, `WH-0003`, `SW-0004`.

Rules:
1. Catalogue `id` is the permanent miniature identity and replaces the historical slug-based ID.
2. The numeric counter is global across all universes; a number may be assigned only once.
3. `catalog.json` stores the highest assigned numeric value as top-level `lastCatalogNumber`.
4. A new publication uses `lastCatalogNumber + 1`; update `lastCatalogNumber` only with successful publication.
5. Never derive the next number from record count, array position, filename count or a per-universe count when `lastCatalogNumber` exists.
6. Never reuse an ID or numeric value, including after deletion of a record.
7. Name/title is not an identity key. Several records may have exactly the same character/model name because IDs differ.
8. The existing catalogue has been migrated to this scheme; never restore historical slug IDs.
9. For a new universe, define a unique two-letter prefix before assigning its first ID; continue the same global numeric sequence.
10. Display the ID only inside the opened miniature/detail viewer. Do not display it on gallery cards or create an ID filter/column unless explicitly requested.

## PAINT BRAND — FIRST-CLASS CATALOGUE FIELD
Every miniature/painting-sheet record has a paint brand represented by catalogue field `paintBrand`, for example `"paintBrand": "AK Interactive"`.

Canonical brand names currently planned/supported:
- `AK Interactive`
- `Vallejo`
- `Army Painter`

Do not hard-code these as the only possible brands in the UI. Paint Brand filter options derive dynamically from catalogue data. All catalogue models created before v1.5.0 are known to use AK Interactive. Legacy records/manifests without `paintBrand` are interpreted as `AK Interactive`; new records must store it explicitly.

Paint Brand participates in catalogue filtering, free-text search, model card/path metadata, viewer metadata, Phase A manifest and Phase B publication.

## TITLE, SLUG AND FILENAMES
User-supplied title is authoritative. Create a normalized lowercase slug from the title for human-readable filename components only. The slug is not the miniature identity and need not be globally unique.

Final web filenames use:
`<id>-<slug>-<role>.jpg`

Example for ID `SW-0095`, slug `boba-fett`:
- `SW-0095-boba-fett-mini.jpg`
- `SW-0095-boba-fett-thumb.jpg`
- `SW-0095-boba-fett-paint-sheet.jpg`
- `SW-0095-boba-fett-detail-01.jpg` etc.

The separator between ID and slug is a hyphen, never a space.

### Phase A staging filenames
Phase A occurs before final catalogue-ID allocation. Do not guess or reserve a permanent ID in Phase A. Use staging filenames:
- `<slug>-mini.jpg`
- `<slug>-thumb.jpg`
- `<slug>-paint-sheet.jpg`
- `<slug>-detail-01.jpg` etc.
- manifest `<slug>.json`

Phase B allocates the permanent ID and renames/reuses staged assets into ID-prefixed final filenames.

### Drive originals
Drive remains the original/master archive and is not retroactively renamed by the catalogue migration. For new Phase A archives use:
- `<slug>-mini.<original-extension>`
- `<slug>-paint-sheet.<original-extension>`
- `<slug>-detail-01.<original-extension>` etc.

## GOOGLE DRIVE ORIGINALS — MANDATORY
Archive every incorporated original under `miniature-galery/Universe/Faction/Subfaction`. Rename only. Preserve exact bytes/content and original extension. Do not resize, recompress, convert, crop, recolour, sharpen, retouch or otherwise modify. Generated thumbnails/manifests need not be archived as originals.

## WEB DERIVATIVES — MANDATORY
Generate programmatically, not generatively. Phase A normal package contains optimized staging `<slug>-mini.jpg`, lightweight `<slug>-thumb.jpg`, and optimized `<slug>-paint-sheet.jpg`. Preserve aspect ratio unless explicitly requested. Validate non-zero size, expected format and successful image decoding before email.

## MODEL MANIFEST — MANDATORY
Every Phase A package contains exactly one `<slug>.json`. It is the authoritative Phase A → Phase B handoff and model-level pending marker.

Minimum schema from v1.5.1:
```json
{
  "schemaVersion": 1,
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

Rules: `schemaVersion` currently 1; Phase A does not assign permanent catalogue `id`; title preserves supplied title; classification determines Phase B destination; `paintBrand` is mandatory for newly created manifests; `assets` maps roles to exact staging filenames. A valid manifest defines a pending model. Missing required declared assets means blocked/incomplete pending model.

Legacy manifests may contain historical slug field `id`. Treat it only as legacy/staging metadata and never publish it as catalogue ID. Phase B allocates a new global ID. Legacy manifests without `paintBrand` are interpreted as `AK Interactive`.

## PAINT BRAND DETERMINATION IN PHASE A
- Explicit user brand wins.
- Otherwise use a brand clearly identified by the Painting Specification Sheet.
- Do not infer a non-AK brand merely from miniature colours.
- Established current workflow brand is AK Interactive until the user supplies another brand.
- When genuinely ambiguous, ask rather than silently assigning the wrong brand.

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
5. Determine Paint Brand according to rules above.
6. Normalize staging slug/filenames. Do not allocate permanent catalogue ID.
7. Ensure Drive path exists.
8. Upload renamed originals to Drive unchanged.
9. Generate and validate staging web JPGs.
10. Create and validate `<slug>.json`, including mandatory `paintBrand` and exact staging asset filenames.
11. Send one email per model to `3dvikingshop@gmail.com`, subject exactly `Miniature Gallery`, attaching web JPGs and manifest.
12. Report Phase A sent.
13. **STOP. Do not immediately process GitHub `uploads/`.**

Do not update `catalog.json`, `lastCatalogNumber` or allocate/reserve an ID in Phase A.

## PENDING MODEL DEFINITION
A pending model is represented by a valid manifest in `uploads/`. Count models, not files. Always report total pending count plus titles; indicate blocked/incomplete models where applicable.

## PHASE B COMMANDS / ALIASES
Equivalent commands include `processar github`, `processa github`, `processar pendentes`, `processa pendentes`, `processar fase b`, `processa fase b`. Any semantically unambiguous request to process/publish pending models also triggers Phase B. Bare `processa`/`avança` triggers only when immediate context clearly refers to pending models.

## PHASE B — PROCESS PENDING MODELS
1. Inspect current `uploads/` and parse manifests.
2. Count/identify models by manifest title.
3. Process every complete valid pending model unless user limits scope.
4. Verify declared assets exist; leave incomplete models pending and continue safely with complete models.
5. Use manifest Universe/Faction/Subfaction and `paintBrand` as authoritative publication metadata unless user corrects them.
6. For legacy manifests missing `paintBrand`, use `AK Interactive`.
7. Re-read the current `catalog.json` immediately before ID allocation and obtain current `lastCatalogNumber`.
8. Allocate exactly one new number per model, sequentially from current `lastCatalogNumber + 1`; select prefix from Universe and construct permanent `id`.
9. Create the normalized slug from title for filename readability; do not use it as identity.
10. Destination: `images/<universe>/<faction>/<subfaction>/`.
11. Move/reuse each staged asset into a final filename prefixed `<id>-<slug>-...`.
12. Add the miniature to `catalog.json` using the permanent global `id`, explicit `paintBrand`, and final ID-prefixed image paths.
13. Update top-level `lastCatalogNumber` to the highest successfully assigned numeric ID in the same successful publication operation.
14. Preserve unrelated records and allow duplicate names/titles; uniqueness is based on permanent catalogue ID, not name/slug.
15. Catalogue paths reference final `images/...`, never `uploads/...`.
16. Validate unique IDs, unique numeric components, final assets and valid JSON.
17. Only after successful asset placement and catalogue/counter update remove source assets.
18. Delete manifest last.
19. On failure retain recoverable assets/manifest and do not falsely advance the persistent counter for an unpublished model.
20. Verify GitHub Pages where practical.
21. Report successful, still pending, blocked/incomplete, allocated IDs and commits where applicable.

### Concurrent Phase B safety
If repository state changes between reading `lastCatalogNumber` and committing publication, do not force or reuse the stale allocation. Re-read newest `main`, recompute the next global number, rebuild the change and commit safely. Two publications must never receive the same numeric component even if their universe prefixes differ.

## QUEUE INVARIANT
`uploads/` contains intake awaiting successful Phase B. Manifest = model pending marker. Successfully published model has final assets, valid catalogue entry with permanent global ID, counter updated, and no remaining source assets/manifest in `uploads/`. Missing `uploads/` means empty queue.

## SAFE GITHUB RULES
Never force `main`. Re-read current state before SHA-dependent writes. Preserve unrelated concurrent changes. Prefer logically atomic Phase B publication when tools permit. Reuse valid upload blobs when moving. On non-fast-forward rebuild on newest `main`. New binaries enter via Pipedream, not failed v1.2.0 direct binary intake.

## CATALOGUE / APPLICATION
Catalogue records contain as applicable: `id`, `name`, `universe`, `faction`, `subfaction`, `paintBrand`, `description`, `tags`, `images`. Top-level catalogue state includes `lastCatalogNumber`.

`id` has format `<two-letter-universe-prefix>-<four-digit-global-number>` and is the canonical permanent key. Names may repeat. Image filenames include the ID prefix so same-name characters cannot overwrite one another.

The site must provide dynamic filters for Universe, Faction, Subfaction and Paint Brand. Paint Brand options derive from effective catalogue values. Legacy records lacking `paintBrand` have effective value `AK Interactive`.

The catalogue ID is displayed only in the opened miniature/detail viewer, not on gallery cards or as a normal filter/column.

Adding a normal miniature is a content operation. Do not edit HTML/CSS/JS merely to add content and do not ask the user to manually edit JSON. Site remains responsive on desktop/iPad/mobile, uses lazy thumbnails/on-demand full images and does not rely solely on hover.

## SECURITY
Never ask for GitHub passwords, PATs, Google credentials, Pipedream OAuth tokens or other authentication secrets. Use authorized integrations.

## VERSIONING
Retain historical Masters. Patch = corrections/reliability refinements; minor = compatible feature/workflow/schema additions; major = substantial architecture change. v1.5.1 is a patch to v1.5.0 introducing the permanent global catalogue-ID/counter and ID-prefixed filename rules while preserving the established Phase A/Phase B architecture.

## CORE NON-NEGOTIABLE REQUIREMENTS
- Auto-bootstrap and READY in new chat.
- READY reports count/list of pending models without modifying them.
- User title authoritative.
- Permanent published `id` = two-letter Universe prefix + hyphen + four-digit global counter.
- One global numeric sequence across every universe.
- `lastCatalogNumber` is persistent in `catalog.json`; never reuse numbers.
- Duplicate miniature names/titles are allowed and must never cause asset overwrite.
- Final web image filenames begin `<id>-<slug>-...`.
- ID appears only in the opened miniature/detail viewer.
- Phase A does not allocate/reserve permanent IDs or update the counter.
- Phase B allocates IDs from fresh catalogue state and updates counter with successful publication.
- Drive originals unchanged except filename.
- Programmatic JPG derivatives.
- Every new Phase A manifest contains `paintBrand`.
- Legacy records/manifests without brand are AK Interactive.
- Paint Brand dynamically filterable/searchable.
- Future canonical brands include Vallejo and Army Painter without requiring new filter code.
- New binaries enter through Gmail → Pipedream → `uploads/`.
- Pipedream sequential assets-before-manifest with fresh-state bounded conflict retry.
- Phase A stops after email and does not update catalogue.
- Phase B only on explicit/semantically clear request.
- Successful Phase B removes assets and manifest last.
- Failed/incomplete models remain recoverable.
- Final assets under `images/<universe>/<faction>/<subfaction>/`.

## EXPECTED NEW-CHAT BEHAVIOR
Attaching this file alone is sufficient instruction. Execute BOOTSTRAP immediately; do not ask what the user wants before initialization. After READY wait for image + sheet + title (Phase A) or a Phase B command.

---
**Document:** GitHub-minis-master  
**Version:** 1.5.1  
**Purpose:** Autonomous Miniature Gallery recovery/publication with permanent global catalogue IDs, collision-safe ID-prefixed filenames, Paint Brand metadata/filtering, manifest-based pending models and concurrency-safe intake.
