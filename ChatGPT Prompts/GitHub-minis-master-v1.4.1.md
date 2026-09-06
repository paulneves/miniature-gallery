# GitHub-minis-master

**Version:** 1.4.1  
**Project:** Miniature Painting Collection  
**Repository:** `paulneves/miniature-gallery`  
**Public site:** `https://paulneves.github.io/miniature-gallery/`

## PURPOSE AND EXECUTION MODE
This is an autonomous bootstrap and recovery prompt. When supplied in a new ChatGPT conversation, execute BOOTSTRAP immediately without waiting for a second initialization prompt. After bootstrap remain READY for either image + Painting Specification Sheet + title (PHASE A), or a request to process pending models (PHASE B).

The live GitHub repository is authoritative. Preserve historical Masters. v1.4.1 supersedes conflicting workflow instructions in older versions. The failed v1.2.0 direct ChatGPT binary publication experiment is not a validated route.

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

Mandatory READY report: Master version, GitHub status, Drive status, pending-model count, and title of every pending model. If none: `Pending models: 0 — queue empty.` Orphan image files without a manifest may be reported separately but never count as pending models.

## ARCHITECTURE
- Google Drive = unchanged original/master archive.
- GitHub `uploads/` = temporary model-package intake queue.
- GitHub `images/...` = final optimized JPG web assets.
- `catalog.json` = primary website content configuration.

Hierarchy: `Site → Universe → Faction → Subfaction → Miniature → Images`.
Drive: `miniature-galery/Universe/Faction/Subfaction/files`, no miniature folder.
GitHub final: `images/<universe>/<faction>/<subfaction>/`, no miniature folder.

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
Archive every incorporated user-supplied original under `miniature-galery/Universe/Faction/Subfaction`. Rename only. Preserve exact bytes/content and original extension. Do not resize, recompress, convert, crop, recolour, sharpen, retouch or otherwise modify. Generated thumbnails/manifests need not be archived as originals.

## WEB DERIVATIVES — MANDATORY
Generate programmatically, not generatively. Normal package contains optimized `<slug>-mini.jpg`, lightweight `<slug>-thumb.jpg`, and optimized `<slug>-paint-sheet.jpg`. Preserve aspect ratio unless explicitly requested. Validate non-zero size, expected format and successful image decoding before email.

## MODEL MANIFEST — MANDATORY
Every Phase A package contains exactly one `<slug>.json`. It is the authoritative Phase A → Phase B handoff and model-level pending marker.

Minimum schema:
```json
{
  "schemaVersion": 1,
  "id": "imperial-sniper-snowtrooper",
  "title": "Imperial Sniper Snowtrooper",
  "universe": "Star Wars",
  "faction": "Galactic Empire",
  "subfaction": "Snowtroopers",
  "assets": {
    "miniature": "imperial-sniper-snowtrooper-mini.jpg",
    "thumbnail": "imperial-sniper-snowtrooper-thumb.jpg",
    "paintingSheet": "imperial-sniper-snowtrooper-paint-sheet.jpg"
  }
}
```

Rules: `schemaVersion` currently 1; `id` equals slug; title preserves supplied title; classification determines Phase B destination; `assets` maps roles to exact filenames. A valid manifest defines a pending model. Missing declared required assets means blocked/incomplete pending model, not publishable until complete.

## VALIDATED INTAKE ROUTE
`web JPGs + manifest → Gmail → Pipedream → GitHub uploads/`

Pipedream workflow: **Miniature Gallery Upload**. Gmail: `3dvikingshop@gmail.com`. GitHub: `paulneves/miniature-gallery`. Trigger: `has:attachment subject:"Miniature Gallery"`. Flow: `trigger → list_thread_messages → find_attachments → process_attachments`. Pipedream checks Gmail approximately every 15 minutes.

Multiple attachments in one email have been validated. During a later multi-model test, concurrent Pipedream executions exposed GitHub Contents API HTTP 409 conflicts (`is at ... but expected ...`). Therefore concurrent-intake recovery below is mandatory for the Pipedream `process_attachments` implementation.

## PIPEDREAM CONCURRENT-INTAKE RULES — MANDATORY
The `process_attachments` implementation must be safe when several model emails are processed concurrently.

1. Process attachments **sequentially within each workflow execution**; do not use `Promise.all()` for GitHub writes.
2. Order non-manifest assets first and every `.json` manifest last.
3. Immediately before each GitHub PUT attempt, GET the current destination file state and obtain a fresh existing-file SHA if it exists.
4. For a new file, PUT without `sha`; for an existing file, PUT using the freshly obtained SHA.
5. A stale SHA must never be blindly reused after a conflict.
6. On HTTP `409`, wait and retry after re-reading fresh GitHub state.
7. Treat concurrency-related HTTP `422` similarly when appropriate: refresh state and retry rather than immediately abandoning the model.
8. Use a bounded retry policy. Current validated design target: maximum **5 attempts**, with increasing waits of approximately 1s, 2s, 3s, 4s between successive retries.
9. If all retries fail, surface the error; do not falsely report successful intake.
10. Record retry/attempt information in workflow results when practical for diagnostics.
11. Preserve exact downloaded attachment bytes. Gmail Base64URL must be decoded correctly and downloaded byte length should be compared with Gmail attachment metadata when provided.
12. Sanitize attachment filenames against path manipulation before writing under `uploads/`.
13. The manifest must be uploaded **last**, because its presence declares the model pending to Phase B. Do not intentionally expose the manifest before its declared assets have been attempted successfully.

This retry mechanism addresses concurrent GitHub branch/file changes between GET and PUT. It does not change the two-phase architecture.

## PHASE A — ARCHIVE, PACKAGE, EMAIL, STOP
Trigger: user supplies image + Painting Specification Sheet + title, optionally additional images.

1. Inspect repository/catalogue as needed for duplication/classification conflicts.
2. Identify miniature, sheet and additional views.
3. Use supplied title as authoritative.
4. Determine Universe/Faction/Subfaction when reasonably clear; ask only if genuinely ambiguous.
5. Normalize slug/filenames.
6. Ensure Drive path exists.
7. Upload renamed originals to Drive unchanged.
8. Generate and validate web JPGs programmatically.
9. Create and validate `<slug>.json` with classification and exact asset filenames.
10. Send one email per model to `3dvikingshop@gmail.com`, subject exactly `Miniature Gallery`, attaching all web JPGs and the manifest.
11. Report Phase A sent.
12. **STOP. Do not immediately process GitHub `uploads/`.**

Do not update `catalog.json` in Phase A. Pipedream may require approximately 15 minutes.

## PENDING MODEL DEFINITION
A pending model is represented by a valid `<slug>.json` manifest in `uploads/`. Count models, not files. Always report total pending models plus the title/list; indicate blocked/incomplete models where applicable.

## PHASE B COMMANDS / ALIASES
Explicit equivalents include, case-insensitively:
- `processar github`
- `processa github`
- `processar pendentes`
- `processa pendentes`
- `processar fase b`
- `processa fase b`

Do not require exact text. Any unambiguous request to process/publish/handle pending models (e.g. `trata dos pendentes`, `publica os pendentes`, `avança com a fase B`) triggers Phase B. Bare `processa`/`avança` triggers only when immediate context clearly refers to pending models.

## PHASE B — PROCESS PENDING MODELS
1. Inspect current `uploads/`.
2. Discover and parse `*.json` manifests.
3. Count/identify models by manifest title.
4. Process every complete valid pending model unless user limits scope.
5. Verify every required declared asset exists.
6. Leave incomplete models pending and report why; continue safely with other complete models.
7. Use manifest classification unless current user corrects it.
8. Destination: `images/<universe>/<faction>/<subfaction>/`.
9. Move/reuse assets into final paths.
10. Add/update the miniature in `catalog.json`; preserve unrelated records and avoid duplicate IDs.
11. Catalogue paths reference final `images/...`, never `uploads/...`.
12. Thumbnail uses `-thumb.jpg`; viewer uses optimized full web images.
13. Validate final assets and `catalog.json`.
14. Only after successful asset placement and catalogue update remove source assets from `uploads/`.
15. Delete `<slug>.json` manifest **last** because it is the pending-state marker.
16. On failure retain necessary assets/manifest so the model remains recoverable.
17. Verify GitHub Pages where practical.
18. Report successfully processed, still pending, blocked/incomplete, and resulting commits where applicable.

## QUEUE INVARIANT
`uploads/` contains intake awaiting successful Phase B. Manifest = model pending marker. A successfully published model has final assets, valid catalogue entry, and no remaining source assets/manifest in `uploads/`. If `uploads/` does not exist, queue is empty; Git does not preserve empty directories and Pipedream recreates it.

## SAFE GITHUB RULES
Never force `main`. Re-read current state before SHA-dependent writes. Preserve unrelated concurrent changes. Prefer logically atomic Phase B publication when tools permit. Existing valid upload blobs may be reused when moving. On non-fast-forward rebuild on newest `main`. Do not use failed v1.2.0 direct binary intake; new binaries enter via Pipedream.

## CATALOGUE / APPLICATION
Records contain as applicable `id`, `name`, `universe`, `faction`, `subfaction`, `description`, `tags`, `images`. Painting Specification Sheets are first-class assets; multiple images are supported. Preserve existing records and avoid duplicate IDs. Filters derive dynamically from `catalog.json`.

Repository includes `index.html`, `catalog.json`, `README.md`, `css/style.css`, `js/gallery.js`, `images/...`, temporary `uploads/`, and versioned Masters. Adding a normal miniature is a content operation; do not edit HTML/CSS/JS merely to add content and do not ask the user to manually edit JSON. Site remains responsive on desktop/iPad/mobile, uses lazy thumbnails and on-demand larger images, and does not rely solely on hover.

## SECURITY
Never ask for GitHub passwords, PATs, Google credentials, Pipedream OAuth tokens or other authentication secrets. Use authorized integrations.

## DEFERRED PHASE 2
Do not block MVP publication on deferred duplicate-email hardening, collision-proof intake folders/message IDs, richer admin UI, extra Pipedream metadata, or nonessential optimizations.

## VERSIONING
Retain historical Masters. Patch = corrections/reliability refinements; minor = compatible features/workflow rules; major = substantial architecture change. v1.4.1 is a patch release because it preserves v1.4.0 architecture and adds mandatory concurrency recovery discovered during testing.

## CORE NON-NEGOTIABLE REQUIREMENTS
- Master auto-bootstraps in a new chat and ends READY.
- Bootstrap reports count and list of pending **models** without modifying them.
- Title is authoritative.
- Drive originals unchanged except filename; no miniature folder.
- Programmatic JPG web derivatives.
- Every Phase A package includes `<slug>.json`.
- New binaries enter through Gmail → Pipedream → `uploads/`.
- Pipedream writes attachments sequentially per execution, assets before manifest.
- GitHub PUT uses fresh state and bounded 409/appropriate-422 retry for concurrent intake.
- Manifest uploaded last.
- Phase A stops after email and does not change `catalog.json`.
- Phase B only on explicit/semantically unambiguous request.
- Successful Phase B removes assets and deletes manifest last.
- Failed/incomplete models remain recoverable.
- Final assets under `images/<universe>/<faction>/<subfaction>/`.
- Never cite failed v1.2.0 direct binary experiment as valid.

## EXPECTED NEW-CHAT BEHAVIOR
Attaching this file alone is sufficient instruction. Execute BOOTSTRAP immediately; do not ask what the user wants before initialization. After READY wait for image + sheet + title (Phase A) or a Phase B command.

---
**Document:** GitHub-minis-master  
**Version:** 1.4.1  
**Purpose:** Autonomous Miniature Gallery recovery and two-phase publication with manifest-based pending models and concurrency-safe Pipedream/GitHub intake.
