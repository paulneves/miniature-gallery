# GitHub-minis-master

**Version:** 1.6.0  
**Project:** Miniature Painting Collection  
**Repository:** `paulneves/miniature-gallery`  
**Public site:** `https://paulneves.github.io/miniature-gallery/`

## PURPOSE AND EXECUTION MODE
This is the autonomous bootstrap/recovery prompt for the Miniature Gallery. When supplied in a new ChatGPT Work chat, execute BOOTSTRAP immediately without waiting for another initialization instruction. After bootstrap remain READY for either image + Painting Specification Sheet + title (PHASE A), or a request to process pending models (PHASE B).

The live GitHub repository is authoritative. Preserve historical Masters. v1.6.0 supersedes conflicting workflow instructions in older versions. Direct ChatGPT Work → GitHub binary intake has now been experimentally validated and replaces the Gmail/Pipedream intake architecture.

## SOURCE-OF-TRUTH PRIORITY
1. Explicit current user instruction.
2. Current live GitHub repository.
3. Newest `GitHub-minis-master-v*.md` in GitHub.
4. Attached Master if no newer version exists.
5. Historical assumptions.

## BOOTSTRAP — AUTOMATIC
1. Connect to `paulneves/miniature-gallery` through the authorized GitHub integration and/or ChatGPT Work capabilities.
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
- ChatGPT Work = execution environment for Phase A and Phase B.
- GitHub `uploads/` = temporary model-package intake queue and strict boundary between Phase A and Phase B.
- GitHub `images/...` = final optimized JPG web assets.
- `catalog.json` = primary website content configuration and persistent global catalogue counter.

Hierarchy: `Site → Universe → Faction → Subfaction → Miniature → Images`.
Drive: `miniature-galery/Universe/Faction/Subfaction/files`, no miniature folder.
GitHub final: `images/<universe>/<faction>/<subfaction>/`, no miniature folder.

Validated Phase A route from v1.6.0:
`ChatGPT Work → GitHub uploads/`

Google Drive archival occurs in parallel as part of Phase A. Gmail and Pipedream are no longer part of the normal intake route.

## GLOBAL CATALOGUE ID — MANDATORY
Every published miniature has a permanent unique catalogue `id`:
`<UNIVERSE-PREFIX>-<GLOBAL-NUMBER>`

Current prefixes:
- `SW` = Star Wars
- `WH` = Warhammer 40,000

The numeric component is one global sequence shared by all universes, formatted to four digits with leading zeros.

Rules:
1. Catalogue `id` is the permanent miniature identity and replaces historical slug-based IDs.
2. The numeric counter is global across all universes; a number may be assigned only once.
3. `catalog.json` stores the highest assigned numeric value as top-level `lastCatalogNumber`.
4. A new publication uses `lastCatalogNumber + 1`; update the counter only with successful Phase B publication.
5. Never derive the next number from record count, array position, filename count or per-universe count when `lastCatalogNumber` exists.
6. Never reuse an ID or numeric value, including after deletion.
7. Name/title is not an identity key. Duplicate titles/names are allowed because catalogue IDs differ.
8. The existing catalogue has already been migrated; never restore historical slug IDs.
9. For a new universe, explicitly define a unique two-letter prefix before assigning its first ID; continue the same global sequence.
10. Display the ID only inside the opened miniature/detail viewer, not on gallery cards and not as a normal filter/column.

## PAINT BRAND — FIRST-CLASS CATALOGUE FIELD
Every miniature/painting-sheet record has `paintBrand`, e.g. `"paintBrand": "AK Interactive"`.

Canonical names currently planned/supported:
- `AK Interactive`
- `Vallejo`
- `Army Painter`

Do not hard-code these as the only possible brands in the UI. Paint Brand filter options derive dynamically from catalogue data. Legacy catalogue records/manifests without `paintBrand` are interpreted as `AK Interactive`; new manifests and catalogue records must store the field explicitly.

## TITLE, SLUG AND FILENAMES
User-supplied title is authoritative. If no explicit title is supplied, filename may be used as fallback. Create a normalized lowercase slug for staging and human-readable filename components. Slug is not identity and need not be globally unique.

Final web filenames:
- `<id>-<slug>-mini.jpg`
- `<id>-<slug>-thumb.jpg`
- `<id>-<slug>-paint-sheet.jpg`
- `<id>-<slug>-detail-01.jpg` etc.

### Phase A staging filenames
Phase A occurs before final catalogue-ID allocation. Never guess or reserve an ID in Phase A. Use:
- `<slug>-mini.jpg`
- `<slug>-thumb.jpg`
- `<slug>-paint-sheet.jpg`
- `<slug>-detail-01.jpg` etc.
- manifest `<slug>.json`

Phase B allocates the permanent ID and converts/reuses staging paths into final ID-prefixed paths.

### Drive originals
For new Phase A archives:
- `<slug>-mini.<original-extension>`
- `<slug>-paint-sheet.<original-extension>`
- `<slug>-detail-01.<original-extension>` etc.

## GOOGLE DRIVE ORIGINALS — MANDATORY
Archive every incorporated original under `miniature-galery/Universe/Faction/Subfaction`. Rename only. Preserve exact bytes/content and original extension. Do not resize, recompress, convert, crop, recolour, sharpen, retouch or otherwise modify originals. Generated thumbnails/manifests need not be archived as originals.

## WEB DERIVATIVES — MANDATORY
Generate programmatically, not generatively. Phase A normal package contains optimized staging `<slug>-mini.jpg`, lightweight `<slug>-thumb.jpg`, optimized `<slug>-paint-sheet.jpg`, plus declared details when applicable. Preserve aspect ratio unless explicitly requested. Validate non-zero size, expected format and successful image decoding before GitHub upload.

## MODEL MANIFEST — MANDATORY
Every Phase A package contains exactly one `<slug>.json`. It is the authoritative Phase A → Phase B handoff and model-level pending marker.

Minimum schema:
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

Phase A does not assign permanent catalogue `id`. `paintBrand` is mandatory. `assets` maps roles to exact staging filenames. Missing required declared assets means blocked/incomplete pending model. Legacy manifests containing slug `id` treat it only as staging metadata; Phase B allocates the permanent ID.

## PAINT BRAND DETERMINATION IN PHASE A
- Explicit user brand wins.
- Otherwise use a brand clearly identified by the Painting Specification Sheet.
- Do not infer a non-AK brand merely from miniature colours.
- Established current workflow brand is AK Interactive until user supplies another brand.
- When genuinely ambiguous, ask rather than silently assigning the wrong brand.

## DIRECT CHATGPT WORK INTAKE — MANDATORY
Normal Phase A intake route is:
`ChatGPT Work → GitHub uploads/`

Rules:
1. Do not use Gmail or Pipedream in the normal workflow.
2. Generate/prepare all staging web assets locally/in the Work environment first.
3. Validate every asset before repository publication.
4. Upload/write all non-manifest assets to `uploads/` first.
5. Upload/write the manifest last. Manifest presence declares the model pending.
6. After writing, re-read/inspect GitHub and verify every declared asset exists and corresponds to the manifest.
7. Never report Phase A success merely because local derivative generation succeeded; direct GitHub persistence must be confirmed.
8. If direct binary persistence fails, stop safely, report the exact failed operation, and do not silently fall back to Gmail/Pipedream.
9. Preserve recoverability: if some assets reached `uploads/` but manifest did not, they are orphan/staging files, not a pending model.
10. Do not execute Phase B automatically after Phase A, even in the same Work chat.

## PHASE A — ARCHIVE, PACKAGE, DIRECT UPLOAD, STOP
Trigger: image + Painting Specification Sheet + title, optionally additional images.

1. Inspect repository/catalogue as needed.
2. Identify miniature, sheet and additional views.
3. Use supplied title as authoritative; filename only as fallback when title is absent.
4. Determine Universe/Faction/Subfaction when reasonably clear.
5. Determine Paint Brand according to rules above.
6. Normalize staging slug/filenames. Do not allocate permanent catalogue ID.
7. Ensure Drive path exists.
8. Archive renamed originals to Drive unchanged and validate their presence.
9. Generate and validate staging web JPGs programmatically.
10. Create and validate `<slug>.json`, including mandatory `paintBrand` and exact staging asset filenames.
11. Persist all staging web assets directly to GitHub `uploads/` using ChatGPT Work capabilities.
12. Persist manifest to `uploads/` last.
13. Re-read/inspect GitHub and validate manifest plus every declared asset.
14. Report Phase A result.
15. **STOP. Do not execute Phase B automatically.**

Phase A MUST NOT:
- update `catalog.json`;
- change `lastCatalogNumber`;
- allocate or reserve `SW-####`, `WH-####` or any future public ID;
- move files into final `images/...`;
- delete the newly created pending package.

## PENDING MODEL DEFINITION
A pending model is represented by a valid manifest in `uploads/`. Count models, not files. Report total pending count plus titles; indicate blocked/incomplete models. Orphan assets without a manifest do not count as pending.

## PHASE B COMMANDS / ALIASES
Equivalent commands include `processar github`, `processa github`, `processar pendentes`, `processa pendentes`, `processar fase b`, `processa fase b`. Any semantically unambiguous request to process/publish pending models triggers Phase B. Bare `processa`/`avança` triggers only when immediate context clearly refers to pending models.

## PHASE B — PROCESS PENDING MODELS
1. Inspect current `uploads/` and parse manifests.
2. Count/identify models by manifest title.
3. Process every complete valid pending model unless user limits scope.
4. Verify declared assets exist; leave incomplete models pending and continue safely with complete models.
5. Use manifest Universe/Faction/Subfaction and `paintBrand` as authoritative publication metadata unless user corrects them.
6. For legacy manifests missing `paintBrand`, use `AK Interactive`.
7. Re-read current `catalog.json` immediately before ID allocation and obtain current `lastCatalogNumber`.
8. Validate that `lastCatalogNumber` equals the highest allocated numeric suffix in current public IDs before allocating new IDs. If inconsistent, stop and report rather than guessing.
9. Allocate one new global number per model sequentially from `lastCatalogNumber + 1`; select prefix from Universe and construct permanent ID.
10. Create normalized slug from title for filename readability; do not use slug as identity.
11. Destination: `images/<universe>/<faction>/<subfaction>/`.
12. Move/reuse staged assets into final filenames prefixed `<id>-<slug>-...`.
13. Add miniature to `catalog.json` using permanent global `id`, explicit `paintBrand`, and final ID-prefixed image paths.
14. Update top-level `lastCatalogNumber` to highest successfully assigned numeric ID as part of successful publication.
15. Preserve unrelated records and allow duplicate names/titles.
16. Catalogue paths reference final `images/...`, never `uploads/...`.
17. Validate catalogue IDs against `^[A-Z]{2}-\d{4}$`, prefix/universe mapping, unique full IDs, globally unique numeric suffixes, final assets and valid JSON.
18. Validate `lastCatalogNumber` equals the highest allocated numeric suffix after publication.
19. Validate every referenced final file exists and its filename begins with the record ID.
20. Only after successful asset placement and catalogue/counter update remove source staging assets.
21. Delete manifest last.
22. On failure retain recoverable assets/manifest and do not falsely advance counter for an unpublished model.
23. Verify GitHub Pages where practical, including that ID appears in detail viewer and not gallery cards.
24. Report successful, still pending, blocked/incomplete, allocated IDs and commits where applicable.

### Multiple pending models
For a batch, use deterministic pending processing order and allocate consecutive global numbers. Re-read/reconcile repository state as necessary before committing. Never assign the same numeric component to two records, even with different universe prefixes.

### Concurrent Phase B safety
If repository state changes between reading `lastCatalogNumber` and committing publication, do not force or reuse stale allocation. Re-read newest repository state, recompute next global number, rebuild change and commit safely.

## QUEUE INVARIANT
`uploads/` is the strict Phase A → Phase B boundary. A successfully completed Phase A leaves a validated manifest and its declared assets in `uploads/`. A successfully completed Phase B leaves final assets, valid catalogue entry and updated counter, with no source assets/manifest remaining for that model in `uploads/`. Missing `uploads/` means empty queue.

## SAFE GITHUB RULES
Never force `main`. Re-read current state before SHA-dependent writes. Preserve unrelated concurrent changes. Prefer logically atomic Phase B publication when capabilities permit. Reuse valid blobs/files when moving. On conflict/non-fast-forward rebuild against newest repository state. Direct binary intake through ChatGPT Work is the validated normal route from v1.6.0.

## CATALOGUE / APPLICATION
Catalogue records contain as applicable: `id`, `name`, `universe`, `faction`, `subfaction`, `paintBrand`, `description`, `tags`, `images`. Top-level catalogue state includes `lastCatalogNumber`.

`id` format is `<two-letter-universe-prefix>-<four-digit-global-number>` and is the canonical permanent key. Names may repeat. Final image filenames include ID prefix so same-name miniatures cannot overwrite one another.

The site provides dynamic filters for Universe, Faction, Subfaction and Paint Brand. Legacy records lacking `paintBrand` have effective value `AK Interactive`. Catalogue ID is displayed only in opened miniature/detail viewer, not gallery cards or normal filters/columns.

Adding a normal miniature is a content operation. Do not edit HTML/CSS/JS merely to add content and do not ask user to manually edit JSON. Site remains responsive on desktop/iPad/mobile, uses lazy thumbnails/on-demand full images and does not rely solely on hover.

## SECURITY
Never ask for GitHub passwords, PATs, Google credentials or other authentication secrets. Use authorized integrations/Work capabilities.

## VERSIONING
Retain historical Masters. Patch = corrections/reliability refinements; minor = compatible feature/workflow/schema/architecture additions; major = substantial incompatible architecture change.

v1.6.0 is a minor release because the two-phase model and manifest boundary remain compatible, while the validated Phase A transport changes from Gmail/Pipedream to direct ChatGPT Work → GitHub `uploads/`.

## CORE NON-NEGOTIABLE REQUIREMENTS
- Auto-bootstrap and READY in a new Work chat.
- Two distinct phases remain mandatory.
- `uploads/` remains the strict Phase A → Phase B boundary.
- User title authoritative; filename is fallback only.
- Phase A archives originals unchanged, creates programmatic derivatives and manifest, writes assets directly to GitHub, manifest last, validates, then STOPS.
- Phase A never allocates public ID and never changes catalogue/counter.
- No Gmail/Pipedream in normal intake and no silent fallback to them.
- Permanent published ID = two-letter Universe prefix + hyphen + four-digit global counter.
- One global numeric sequence across all universes.
- `lastCatalogNumber` persistent in `catalog.json`; never reuse numbers.
- Duplicate miniature names/titles allowed and must never cause asset overwrite.
- Final web filenames begin `<id>-<slug>-...`.
- ID appears only in opened miniature/detail viewer.
- Phase B allocates IDs from fresh catalogue state and updates counter only with successful publication.
- Drive originals unchanged except filename.
- Programmatic JPG derivatives.
- Every new Phase A manifest contains `paintBrand`.
- Legacy records/manifests without brand are AK Interactive.
- Paint Brand dynamically filterable/searchable.
- Successful Phase B removes source assets and manifest last.
- Failed/incomplete models remain recoverable.
- Final assets under `images/<universe>/<faction>/<subfaction>/`.

## EXPECTED NEW-CHAT BEHAVIOR
Supplying this file in a new ChatGPT Work chat is sufficient instruction. Execute BOOTSTRAP immediately. After READY wait for image + Painting Specification Sheet + title to execute Phase A. After Phase A STOP and wait for an explicit/semantically clear Phase B command. Never collapse the two phases merely because Work can technically perform both.

---
**Document:** GitHub-minis-master  
**Version:** 1.6.0  
**Purpose:** Autonomous two-phase Miniature Gallery workflow using direct ChatGPT Work → GitHub intake, Google Drive original archival, global catalogue IDs, manifest-based pending models and safe Phase B publication.
