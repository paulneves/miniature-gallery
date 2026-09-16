# GitHub-minis-master

**Version:** 1.6.2  
**Project:** Miniature Painting Collection  
**Repository:** `paulneves/miniature-gallery`  
**Public site:** `https://paulneves.github.io/miniature-gallery/`

## PURPOSE AND EXECUTION MODE
This is the autonomous bootstrap/recovery prompt for the Miniature Gallery. When supplied in a new ChatGPT Work chat, execute BOOTSTRAP immediately without waiting for another initialization instruction. After bootstrap remain READY for either image + Painting Specification Sheet + title (PHASE A), or a request to process pending models (PHASE B).

The live GitHub repository is authoritative. Preserve historical Masters. v1.6.2 supersedes conflicting workflow instructions in older versions. Direct ChatGPT Work → GitHub binary intake is the validated normal Phase A route. v1.6.1 introduced unique temporary Phase A package prefixes for same-title packages. v1.6.2 additionally makes the permanent catalogue ID the only discriminator required in final published filenames: duplicate counters/discriminators such as `#2`, `#3`, `-2`, `-3`, etc. must not be carried into titles, slugs, final filenames or catalogue paths.

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
8. Read each valid manifest title and build the pending-model list. Treat different temporary staging prefixes as different Phase A packages even when titles/slugs are identical.
9. Read `lastCatalogNumber` from `catalog.json` and validate existing catalogue IDs against the global-ID rules below.
10. Do not process/move/delete pending models during bootstrap.
11. Do not modify GitHub or Drive merely during bootstrap.
12. Finish READY.

Mandatory READY report: Master version, GitHub status, Drive status, pending-model count, and title of every pending model. If duplicate titles exist, report each manifest/package separately. If none: `Pending models: 0 — queue empty.` Orphan files without manifests may be reported separately but never count as pending models.

## ARCHITECTURE
- Google Drive = unchanged original/master archive.
- ChatGPT Work = execution environment for Phase A and Phase B.
- GitHub `uploads/` = temporary model-package intake queue and strict boundary between Phase A and Phase B.
- GitHub `images/...` = final optimized JPG web assets.
- `catalog.json` = primary website content configuration and persistent global catalogue counter.

Hierarchy: `Site → Universe → Faction → Subfaction → Miniature → Images`.
Drive: `miniature-galery/Universe/Faction/Subfaction/files`, no miniature folder.
GitHub final: `images/<universe>/<faction>/<subfaction>/`, no miniature folder.

Validated Phase A route: `ChatGPT Work → GitHub uploads/`.
Google Drive archival occurs in parallel as part of Phase A. Gmail and Pipedream are not part of the normal intake route.

## GLOBAL CATALOGUE ID — MANDATORY
Every published miniature has a permanent unique catalogue `id`: `<UNIVERSE-PREFIX>-<GLOBAL-NUMBER>`.

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
11. The permanent catalogue ID is sufficient to distinguish published models with identical titles. Never add a duplicate ordinal to the title or slug merely to make a filename unique.

## PAINT BRAND — FIRST-CLASS CATALOGUE FIELD
Every miniature/painting-sheet record has `paintBrand`, e.g. `"paintBrand": "AK Interactive"`.

Canonical names currently planned/supported:
- `AK Interactive`
- `Vallejo`
- `Army Painter`

Do not hard-code these as the only possible brands in the UI. Paint Brand filter options derive dynamically from catalogue data. Legacy catalogue records/manifests without `paintBrand` are interpreted as `AK Interactive`; new manifests and catalogue records must store the field explicitly.

## TITLE, SLUG, TEMPORARY PACKAGE PREFIX AND FILENAMES
User-supplied title is authoritative. If no explicit title is supplied, filename may be used as fallback. Create a normalized lowercase slug for human-readable filename components. Slug is not identity and need not be globally unique.

### Clean title and slug — mandatory
Duplicate-instance markers are not part of the miniature title or permanent slug. When a source filename, legacy title or staging label contains a trailing duplicate marker used only to distinguish repeated files/models, remove that marker before constructing the canonical title/slug and final filenames.

Examples of duplicate markers that must not be propagated as permanent naming metadata include:
- `#2`, `#3`, `#4`, `#5`, etc.
- `-2`, `-3`, `-4`, `-5`, etc. when used solely as a duplicate-instance discriminator
- equivalent automatically generated copy counters such as `(2)`, `(3)` when they are clearly file-copy discriminators rather than part of the real miniature name.

Example:
- `Raptors Eliminator #3` → canonical title `Raptors Eliminator`
- legacy slug `raptors-eliminator-3` → canonical final slug `raptors-eliminator`

Do not remove a number that is genuinely part of the character/unit name, faction, model designation or supplied authoritative title. The cleanup applies only to duplicate/copy discriminators.

### Temporary Phase A package prefix — mandatory
At the beginning of each Phase A package, capture one local-time value in `HHMMSS` format and use it as the temporary package prefix for every staging asset and the manifest belonging to that package.

Format: `<HHMMSS>-<slug>-<role>.jpg`

Example:
- `191327-imperial-remnant-trooper-mini.jpg`
- `191327-imperial-remnant-trooper-thumb.jpg`
- `191327-imperial-remnant-trooper-paint-sheet.jpg`
- `191327-imperial-remnant-trooper-detail-01.jpg`
- `191327-imperial-remnant-trooper.json`

Rules:
1. Capture the prefix once per package; do not recalculate it separately for each asset.
2. All files of one package must have exactly the same six-digit prefix.
3. Use a hyphen after the prefix, not a space.
4. The prefix is staging metadata only. It is not a catalogue ID and must never be stored as permanent identity.
5. Different prefixes mean different Phase A packages even when title and slug are identical. Do not compare image contents merely to determine whether same-title packages are the same package.
6. Before publication to `uploads/`, verify that the intended manifest filename/package prefix is not already present. If the exact `HHMMSS-slug` package key already exists, generate a new unused time-based package prefix rather than overwriting or merging the existing package.
7. Never overwrite an existing pending package merely because the title/slug matches.

### Final Phase B filenames
The temporary `HHMMSS-` prefix is removed during Phase B and replaced by the permanent catalogue ID.

Final filenames:
- `<id>-<slug>-mini.jpg`
- `<id>-<slug>-thumb.jpg`
- `<id>-<slug>-paint-sheet.jpg`
- `<id>-<slug>-detail-01.jpg` etc.

Example:
`191327-imperial-remnant-trooper-mini.jpg` → `SW-0095-imperial-remnant-trooper-mini.jpg`

A second same-title package may independently become `SW-0096-imperial-remnant-trooper-mini.jpg`. It must NOT become `SW-0096-imperial-remnant-trooper-2-mini.jpg` or otherwise acquire `#2`, `-2`, etc. The different permanent ID is the discriminator.

### Drive originals
Drive remains the original/master archive. For new Phase A archives use the same temporary package prefix to prevent same-title originals from colliding:
- `<HHMMSS>-<slug>-mini.<original-extension>`
- `<HHMMSS>-<slug>-paint-sheet.<original-extension>`
- `<HHMMSS>-<slug>-detail-01.<original-extension>` etc.

The temporary prefix on Drive originals is retained; Phase B operates on GitHub staging/final web assets and does not rename archived originals.

## GOOGLE DRIVE ORIGINALS — MANDATORY
Archive every incorporated original under `miniature-galery/Universe/Faction/Subfaction`. Rename only. Preserve exact bytes/content and original extension. Do not resize, recompress, convert, crop, recolour, sharpen, retouch or otherwise modify originals. Generated thumbnails/manifests need not be archived as originals.

## WEB DERIVATIVES — MANDATORY
Generate programmatically, not generatively. Phase A normal package contains optimized staging `<HHMMSS>-<slug>-mini.jpg`, lightweight `<HHMMSS>-<slug>-thumb.jpg`, optimized `<HHMMSS>-<slug>-paint-sheet.jpg`, plus declared details when applicable. Preserve aspect ratio unless explicitly requested. Validate non-zero size, expected format and successful image decoding before GitHub upload.

## MODEL MANIFEST — MANDATORY
Every Phase A package contains exactly one `<HHMMSS>-<slug>.json`. It is the authoritative Phase A → Phase B handoff and model-level pending marker.

Minimum schema example:
```json
{
  "schemaVersion": 1,
  "title": "Imperial Remnant Trooper",
  "universe": "Star Wars",
  "faction": "Galactic Empire",
  "subfaction": "Imperial Remnant",
  "paintBrand": "AK Interactive",
  "assets": {
    "miniature": "191327-imperial-remnant-trooper-mini.jpg",
    "thumbnail": "191327-imperial-remnant-trooper-thumb.jpg",
    "paintingSheet": "191327-imperial-remnant-trooper-paint-sheet.jpg"
  }
}
```

Rules:
- `schemaVersion` currently 1.
- Phase A does not assign permanent catalogue `id`.
- `paintBrand` is mandatory for new manifests.
- Every declared asset filename must carry the same package prefix as the manifest.
- Manifest title preserves the supplied canonical title and does not need to be unique.
- Missing required declared assets means blocked/incomplete pending model.
- Legacy manifests without the temporary prefix remain valid and are processed using legacy rules.
- Legacy manifests containing slug `id` treat it only as staging metadata; Phase B allocates the permanent ID.

## PAINT BRAND DETERMINATION IN PHASE A
- Explicit user brand wins.
- Otherwise use a brand clearly identified by the Painting Specification Sheet.
- Do not infer a non-AK brand merely from miniature colours.
- Established current workflow brand is AK Interactive until user supplies another brand.
- When genuinely ambiguous, ask rather than silently assigning the wrong brand.

## DIRECT CHATGPT WORK INTAKE — MANDATORY
Normal Phase A intake route is: `ChatGPT Work → GitHub uploads/`.

Rules:
1. Do not use Gmail or Pipedream in the normal workflow.
2. Generate/prepare all staging web assets locally/in the Work environment first.
3. Validate every asset before repository publication.
4. Use one unique `HHMMSS` package prefix consistently across the package.
5. Check for exact package-key collision before writing. Same title/slug under another prefix is not a collision and must not trigger content comparison.
6. Upload/write all non-manifest assets to `uploads/` first.
7. Upload/write the manifest last. Manifest presence declares the model pending.
8. After writing, re-read/inspect GitHub and verify every declared asset exists and corresponds to the manifest.
9. Never report Phase A success merely because local derivative generation succeeded; direct GitHub persistence must be confirmed.
10. If direct binary persistence fails, stop safely, report the exact failed operation, and do not silently fall back to Gmail/Pipedream.
11. If some assets reach `uploads/` but manifest does not, they are orphan/staging files, not a pending model.
12. Do not execute Phase B automatically after Phase A, even in the same Work chat.

## PHASE A — ARCHIVE, PACKAGE, DIRECT UPLOAD, STOP
Trigger: image + Painting Specification Sheet + title, optionally additional images.

1. Inspect repository/catalogue as needed.
2. Identify miniature, sheet and additional views.
3. Use supplied title as authoritative; filename only as fallback when title is absent.
4. Remove only duplicate/copy discriminators from naming metadata when applicable; never add `#2`, `#3`, `-2`, `-3` or equivalents to distinguish same-title models.
5. Determine Universe/Faction/Subfaction when reasonably clear.
6. Determine Paint Brand according to rules above.
7. Capture one `HHMMSS` temporary package prefix and create the normalized clean slug. Do not allocate permanent catalogue ID.
8. Verify exact package key `<HHMMSS>-<slug>` does not already exist as a manifest in `uploads/`. Do not treat another prefix with the same slug/title as a duplicate.
9. Ensure Drive path exists.
10. Archive renamed originals to Drive unchanged using the same package prefix and validate their presence.
11. Generate and validate staging web JPGs programmatically using the same package prefix.
12. Create and validate `<HHMMSS>-<slug>.json`, including mandatory `paintBrand` and exact prefixed staging asset filenames.
13. Persist all staging web assets directly to GitHub `uploads/` using ChatGPT Work capabilities.
14. Persist manifest to `uploads/` last.
15. Re-read/inspect GitHub and validate manifest plus every declared asset.
16. Report Phase A result, including temporary package key.
17. **STOP. Do not execute Phase B automatically.**

Phase A MUST NOT:
- update `catalog.json`;
- change `lastCatalogNumber`;
- allocate or reserve `SW-####`, `WH-####` or any future public ID;
- move files into final `images/...`;
- delete the newly created pending package;
- merge/overwrite same-title packages based only on title or slug;
- perform unnecessary content comparison merely because another pending package has the same title;
- append duplicate ordinals/counters to canonical titles or slugs.

## PENDING MODEL DEFINITION
A pending model is represented by a valid manifest in `uploads/`. The manifest filename/package prefix identifies the staging package; title is descriptive metadata and is not unique. Count manifests/models, not image files and not unique titles. Duplicate titles are separate pending models when manifests/package keys differ. Orphan assets without manifests do not count as pending.

## PHASE B COMMANDS / ALIASES
Equivalent commands include `processar github`, `processa github`, `processar pendentes`, `processa pendentes`, `processar fase b`, `processa fase b`. Any semantically unambiguous request to process/publish pending models triggers Phase B. Bare `processa`/`avança` triggers only when immediate context clearly refers to pending models.

## PHASE B — PROCESS PENDING MODELS
1. Inspect current `uploads/` and parse manifests.
2. Count/identify models by manifest/package, not unique title.
3. Process every complete valid pending model unless user limits scope.
4. Verify declared assets exist; leave incomplete models pending and continue safely with complete models.
5. Use manifest Universe/Faction/Subfaction and `paintBrand` as authoritative publication metadata unless user corrects them.
6. For legacy manifests missing `paintBrand`, use `AK Interactive`.
7. Re-read current `catalog.json` immediately before ID allocation and obtain current `lastCatalogNumber`.
8. Validate that `lastCatalogNumber` equals the highest allocated numeric suffix in current public IDs before allocating new IDs. If inconsistent, stop and report rather than guessing.
9. Allocate one new global number per model sequentially from `lastCatalogNumber + 1`; select prefix from Universe and construct permanent ID.
10. Determine normalized clean slug from manifest title for final filename readability; do not use title/slug as identity. Strip duplicate/copy discriminators when they are merely legacy duplicate markers.
11. Remove the temporary six-digit `HHMMSS-` package prefix when constructing final names. Never carry the staging time prefix into final web filenames or catalogue paths.
12. Destination: `images/<universe>/<faction>/<subfaction>/`.
13. Move/reuse staged assets into final filenames `<id>-<slug>-<role>.jpg`.
14. Never append `#2`, `#3`, `#4`, `#5`, `-2`, `-3`, `-4`, `-5`, `(2)`, `(3)` or equivalent duplicate-instance counters to the canonical title, slug or final filename solely to distinguish same-title models. The permanent `<id>` provides uniqueness.
15. Add miniature to `catalog.json` using permanent global `id`, canonical clean title, explicit `paintBrand`, and final ID-prefixed image paths.
16. Update top-level `lastCatalogNumber` to highest successfully assigned numeric ID as part of successful publication.
17. Preserve unrelated records and allow duplicate names/titles.
18. Catalogue paths reference final `images/...`, never `uploads/...`.
19. Validate catalogue IDs against `^[A-Z]{2}-\d{4}$`, prefix/universe mapping, unique full IDs, globally unique numeric suffixes, final assets and valid JSON.
20. Validate `lastCatalogNumber` equals the highest allocated numeric suffix after publication.
21. Validate every referenced final file exists, begins with the record ID, contains no temporary `HHMMSS-` package prefix, and contains no duplicate/copy discriminator added solely for uniqueness.
22. Only after successful asset placement and catalogue/counter update remove source staging assets belonging to that manifest/package.
23. Delete that package manifest last.
24. On failure retain recoverable assets/manifest and do not falsely advance counter for an unpublished model.
25. Verify GitHub Pages where practical, including that ID appears in detail viewer and not gallery cards.
26. Report successful, still pending, blocked/incomplete, allocated IDs and commits where applicable.

### Multiple pending models
For a batch, use deterministic manifest/package processing order and allocate consecutive global numbers. Duplicate titles are processed independently. Never deduplicate by title or slug. Same-title models receive different permanent IDs but the same clean slug. Re-read/reconcile repository state as necessary and never duplicate the numeric component across prefixes.

## CONCURRENCY / STALE STATE
If repository state changes between counter read and publication, re-read the newest `catalog.json`, recompute required IDs/paths and rebuild the publication against current state. Never force a stale allocation.

## QUEUE INVARIANT
`uploads/` is the strict Phase A → Phase B boundary.

Successful Phase A means: validated manifest + every declared asset exists in `uploads/`.
Successful Phase B means: final assets exist under `images/...`, catalogue record exists, `lastCatalogNumber` is updated, and source staging assets/manifest for that model are removed.
Missing manifests means no pending model even if orphan files exist.

## SAFE GITHUB OPERATION
- Never force `main`.
- Re-read before SHA-dependent writes.
- Preserve unrelated concurrent changes.
- Prefer an atomic Phase B publication where practical.
- On conflict rebuild against newest state rather than overwriting it.
- Direct ChatGPT Work binary intake is the validated normal route.

## CATALOGUE / APPLICATION RULES
Catalogue records use fields including `id`, `name`, `universe`, `faction`, `subfaction`, `paintBrand`, `description`, `tags`, `images`. Top-level `lastCatalogNumber` stores the global counter.

The ID is canonical identity. Names may repeat. Final filenames are ID-prefixed. Filters for Universe/Faction/Subfaction/Paint Brand are data-driven. ID appears only in the opened detail viewer. Adding a normal miniature is content-only and must not require HTML/CSS/JS changes merely to add content. Preserve responsive behavior, lazy thumbnails and on-demand full images; do not rely on hover-only interaction.

## VERSIONING
v1.6.2 is a minor workflow/naming revision. It preserves the two-phase model, direct Work intake, manifest boundary, global catalogue IDs and temporary Phase A package prefixes introduced by previous versions. The change is that permanent names/slugs/final filenames no longer use duplicate/copy counters as uniqueness discriminators because the permanent catalogue ID already guarantees uniqueness.

## CORE NON-NEGOTIABLE RULES
- Auto-bootstrap and READY in a new Work chat.
- Two distinct phases.
- `uploads/` is the strict phase boundary.
- User-supplied title is authoritative; filename is fallback only.
- Phase A archives originals, creates derivatives/manifest, writes assets directly to GitHub, writes manifest last, validates and STOPS.
- No catalogue/counter/permanent-ID changes in Phase A.
- No Gmail/Pipedream normal intake and no silent fallback.
- Phase A uses a unique temporary `HHMMSS-` package prefix.
- Permanent IDs use the global `<PREFIX>-####` scheme and numeric values are never reused.
- Duplicate names are valid and safe.
- Permanent ID is the only uniqueness discriminator required in final filenames.
- Never add or retain `#2`, `#3`, `#4`, `#5`, `-2`, `-3`, etc. solely to distinguish duplicate-title models in permanent titles/slugs/final filenames.
- Final web files are ID-prefixed.
- ID is shown only in the detail viewer.
- Phase B uses fresh repository state and updates the global counter only with successful publication.
- Drive originals remain unchanged in content.
- Web derivatives are programmatic.
- Paint Brand is explicit for new records.
- Successful Phase B removes source staging assets and manifest last.
- Failures remain recoverable.

## EXPECTED NEW-CHAT BEHAVIOR
Supplying this Master in a new ChatGPT Work chat is sufficient. The chat must bootstrap immediately and finish READY. Image + Painting Specification Sheet + title triggers Phase A. After successful Phase A it must STOP and wait. Only an explicit or contextually unambiguous Phase B command processes pending models. Technical ability to perform both phases does not permit collapsing them into one operation.