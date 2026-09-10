# GitHub-minis-master

**Version:** 1.4.2  
**Project:** Miniature Painting Collection  
**Repository:** `paulneves/miniature-gallery`  
**Public site:** `https://paulneves.github.io/miniature-gallery/`

## PURPOSE AND EXECUTION MODE
This is an autonomous bootstrap and recovery prompt. When supplied in a new ChatGPT conversation or ChatGPT Work task, execute BOOTSTRAP immediately without waiting for a second initialization prompt.

The live GitHub repository is authoritative. Preserve historical Masters. v1.4.2 supersedes conflicting workflow instructions in older versions. The failed v1.2.0 direct ChatGPT binary publication experiment is not a validated route.

**Execution-environment rule introduced in v1.4.2:**
- Normal ChatGPT chat = BOOTSTRAP, status/count queries, and PHASE A.
- ChatGPT Work = PHASE B publication/queue processing.
- Do not attempt PHASE B from a normal chat when the available GitHub connector cannot safely complete the full catalogue + assets + queue-cleanup transaction.
- A Phase B request made in normal chat must not partially publish or stage a model. Tell the user to run Phase B in ChatGPT Work instead.
- ChatGPT Work must bootstrap from the newest live Master before Phase B; it must not depend on memory from another conversation.

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
6. Confirm authorized Google Drive access to root archive `miniature-galery` when Drive is available/required by the current phase.
7. Inspect `uploads/` for model manifests `*.json`. A valid manifest represents one pending model; image-file count does not.
8. Read each valid manifest title and build the pending-model list.
9. Do not process/move/delete pending models during bootstrap.
10. Do not modify GitHub or Drive merely during bootstrap.
11. Finish READY.

Mandatory READY report: Master version, GitHub status, Drive status, pending-model count, and title of every pending model. If none: `Pending models: 0 — queue empty.` Orphan image files without a manifest may be reported separately but never count as pending models.

### CHATGPT WORK INITIALIZATION
A new ChatGPT Work task must perform BOOTSTRAP before Phase B. The recommended user instruction is semantically equivalent to:

`Inicializa o projeto Miniature Gallery. Acede ao repositório paulneves/miniature-gallery, procura em ChatGPT Prompts/ o GitHub-minis-master-v*.md mais recente, lê-o integralmente e usa-o como Master autoritativo. Executa o bootstrap definido no Master, não processes ainda os pendentes e termina com READY.`

After READY, an explicit `Processa os pendentes` (or equivalent Phase B command) authorizes PHASE B.

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

For schemaVersion 1, the standard required asset role names are `miniature`, `thumbnail`, and `paintingSheet`. Do not silently reinterpret misspelled or alternate role names during validation; report/repair only when permitted by the current workflow and preserve recoverability.

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

## PHASE A — NORMAL CHAT — ARCHIVE, PACKAGE, EMAIL, STOP
Trigger: user supplies image + Painting Specification Sheet + title, optionally additional images.

PHASE A is the normal-chat workflow.

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

A count/status request is not a Phase B processing trigger. It may inspect the live queue but must not move, publish, stage, delete or modify pending content.

## PHASE B COMMANDS / ALIASES
Explicit equivalents include, case-insensitively:
- `processar github`
- `processa github`
- `processar pendentes`
- `processa pendentes`
- `processar fase b`
- `processa fase b`

Do not require exact text. Any unambiguous request to process/publish/handle pending models (e.g. `trata dos pendentes`, `publica os pendentes`, `avança com a fase B`) requests Phase B. Bare `processa`/`avança` refers to Phase B only when immediate context clearly refers to pending models.

**Environment gate:** Phase B publication is to be executed in ChatGPT Work. If such a command is received in normal chat, do not begin partial Phase B writes or staging. Explain briefly that Phase B must be run in Work and provide the Work initialization instruction if useful.

## PHASE B — CHATGPT WORK — PROCESS PENDING MODELS
Precondition: ChatGPT Work has completed BOOTSTRAP using the newest live Master and is READY. Phase B requires an explicit/semantically unambiguous user command after READY.

1. Re-inspect current `uploads/` immediately before processing.
2. Discover and parse `*.json` manifests.
3. Count/identify models by manifest title.
4. Process every complete valid pending model unless user limits scope.
5. Verify every required declared asset exists.
6. Leave incomplete/invalid models pending and report why; continue safely with other complete models.
7. Use manifest classification unless current user corrects it.
8. Destination: `images/<universe>/<faction>/<subfaction>/`.
9. Before publication, read the **complete current** `catalog.json`; never reconstruct it from a truncated excerpt, cached partial response or memory.
10. Move/reuse assets into final paths.
11. Add/update the miniature in the complete current `catalog.json`; preserve every unrelated record and avoid duplicate IDs.
12. Catalogue paths reference final `images/...`, never `uploads/...`.
13. Thumbnail uses `-thumb.jpg`; viewer uses optimized full web images.
14. Validate final assets and parse/validate the complete resulting `catalog.json` before committing cleanup.
15. Re-read current GitHub state before SHA-dependent writes and preserve unrelated concurrent changes.
16. Only after successful asset placement and catalogue update remove source assets from `uploads/`.
17. Delete `<slug>.json` manifest **last** because it is the pending-state marker.
18. On failure retain necessary assets/manifest so the model remains recoverable.
19. Verify GitHub Pages where practical.
20. Report successfully processed, still pending, blocked/incomplete, and resulting commits where applicable.

### PHASE B TRANSACTION SAFETY
- Do not stage/move final assets as a substitute for a completed Phase B transaction.
- Do not modify `catalog.json` from a partial/truncated representation.
- Do not clean `uploads/` before final assets and catalogue entry are both verified.
- If Work cannot safely read/write the complete catalogue or preserve concurrent changes, stop before destructive cleanup and report the blocker.
- If a previous interrupted attempt already staged assets in final locations, reconcile them against the newest `main` and manifests; reuse valid identical assets where safe, but do not treat their presence alone as publication success.

## QUEUE INVARIANT
`uploads/` contains intake awaiting successful Phase B. Manifest = model pending marker. A successfully published model has final assets, valid catalogue entry, and no remaining source assets/manifest in `uploads/`. If `uploads/` does not exist, queue is empty; Git does not preserve empty directories and Pipedream recreates it.

## SAFE GITHUB RULES
Never force `main`. Re-read current state before SHA-dependent writes. Preserve unrelated concurrent changes. Prefer logically atomic Phase B publication when tools permit. Existing valid upload blobs may be reused when moving. On non-fast-forward rebuild on newest `main`. Do not use failed v1.2.0 direct binary intake; new binaries enter via Pipedream.

Normal-chat Phase A must not modify GitHub final assets or `catalog.json`. Normal-chat status/count operations are read-only. Phase B writes belong to ChatGPT Work.

## CATALOGUE / APPLICATION
Records contain as applicable `id`, `name`, `universe`, `faction`, `subfaction`, `description`, `tags`, `images`. Painting Specification Sheets are first-class assets; multiple images are supported. Preserve existing records and avoid duplicate IDs. Filters derive dynamically from `catalog.json`.

Repository includes `index.html`, `catalog.json`, `README.md`, `css/style.css`, `js/gallery.js`, `images/...`, temporary `uploads/`, and versioned Masters. Adding a normal miniature is a content operation; do not edit HTML/CSS/JS merely to add content and do not ask the user to manually edit JSON. Site remains responsive on desktop/iPad/mobile, uses lazy thumbnails and on-demand larger images, and does not rely solely on hover.

## SECURITY
Never ask for GitHub passwords, PATs, Google credentials, Pipedream OAuth tokens or other authentication secrets. Use authorized integrations.

## DEFERRED PHASE 2
Do not block MVP publication on deferred duplicate-email hardening, collision-proof intake folders/message IDs, richer admin UI, extra Pipedream metadata, or nonessential optimizations.

## VERSIONING
Retain historical Masters. Patch = corrections/reliability refinements; minor = compatible features/workflow rules; major = substantial architecture change.

v1.4.2 is a patch release because it preserves the v1.4 architecture and adds an execution-environment safety rule: Phase A remains in normal ChatGPT chat while Phase B is explicitly delegated to ChatGPT Work, which must bootstrap independently from the newest live Master. It also strengthens complete-catalogue and interrupted-transaction safety.

## CORE NON-NEGOTIABLE REQUIREMENTS
- Master auto-bootstraps in a new chat/Work task and ends READY.
- Bootstrap reports count and list of pending **models** without modifying them.
- Title is authoritative.
- Drive originals unchanged except filename; no miniature folder.
- Programmatic JPG web derivatives.
- Every Phase A package includes `<slug>.json`.
- schemaVersion 1 standard roles are `miniature`, `thumbnail`, `paintingSheet`.
- New binaries enter through Gmail → Pipedream → `uploads/`.
- Pipedream writes attachments sequentially per execution, assets before manifest.
- GitHub PUT uses fresh state and bounded 409/appropriate-422 retry for concurrent intake.
- Manifest uploaded last.
- Phase A runs in normal chat, stops after email and does not change `catalog.json`.
- Pending count/status queries are read-only and do not trigger Phase B.
- Phase B publication runs in ChatGPT Work after independent bootstrap from the newest live Master.
- Normal chat must not partially stage/publish Phase B content.
- Phase B must use the complete current `catalog.json`, never a truncated representation.
- Successful Phase B removes assets and deletes manifest last.
- Failed/incomplete models remain recoverable.
- Final assets under `images/<universe>/<faction>/<subfaction>/`.
- Never cite failed v1.2.0 direct binary experiment as valid.

## EXPECTED NEW-CHAT BEHAVIOR
### Normal ChatGPT chat
Attaching this file alone is sufficient instruction. Execute BOOTSTRAP immediately; do not ask what the user wants before initialization. After READY, accept Phase A packages and status/count queries. If the user requests Phase B, direct that operation to ChatGPT Work without performing partial Phase B writes.

### ChatGPT Work
At the start of a new Work task, retrieve the newest Master from `ChatGPT Prompts/`, execute BOOTSTRAP, report READY, and wait for an explicit Phase B command. After `Processa os pendentes` or equivalent, execute the complete Phase B workflow.

---
**Document:** GitHub-minis-master  
**Version:** 1.4.2  
**Purpose:** Autonomous Miniature Gallery bootstrap and two-phase publication with normal-chat Phase A, ChatGPT Work Phase B, manifest-based pending models, concurrency-safe Pipedream/GitHub intake, and complete-catalogue transaction safety.
