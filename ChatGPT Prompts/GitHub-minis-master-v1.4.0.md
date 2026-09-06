# GitHub-minis-master

**Version:** 1.4.0  
**Project:** Miniature Painting Collection  
**Repository:** `paulneves/miniature-gallery`  
**Public site:** `https://paulneves.github.io/miniature-gallery/`

## PURPOSE AND EXECUTION MODE

This is an **autonomous bootstrap and recovery prompt**, not merely project documentation.

**MANDATORY:** When this file is supplied in a new ChatGPT conversation, execute the BOOTSTRAP procedure below immediately. Do not wait for a second prompt such as “initialize”, “analyze GitHub”, or “get ready”. The purpose of attaching this Master is itself the instruction to initialize the project.

After bootstrap, remain in **READY** state and accept either:
- a new miniature package from the user: image + Painting Specification Sheet + title → execute PHASE A;
- an instruction to process pending models → execute PHASE B.

The live GitHub repository is the authoritative implementation. Preserve historical master files, but this version supersedes earlier workflow instructions where they conflict.

Version 1.4.0 supersedes the direct ChatGPT-to-GitHub binary publication procedure described in v1.2.0. That experiment produced invalid/corrupted repository image files and must not be treated as a validated binary route.

## SOURCE-OF-TRUTH PRIORITY

1. Explicit instruction in the current conversation.
2. Current live GitHub repository contents.
3. Newest `GitHub-minis-master-v*.md` in GitHub.
4. This attached Master if no newer Master exists.
5. Historical assumptions.

## BOOTSTRAP — EXECUTE AUTOMATICALLY

When this Master is attached/opened in a new chat:

1. Connect through the authorized GitHub integration to `paulneves/miniature-gallery`.
2. Inspect the current live repository before making any changes.
3. Read at minimum `catalog.json`, `index.html`, `css/style.css`, `js/gallery.js`, `README.md`, and the newest `ChatGPT Prompts/GitHub-minis-master-v*.md`.
4. Determine the newest Master version present in GitHub. If it is newer than the attached Master, use the newer Master as the operational ruleset.
5. Inspect the repository structure relevant to `images/` and `uploads/`.
6. Connect through the authorized Google Drive integration and confirm access to root archive folder `miniature-galery`.
7. Inspect `uploads/` for **model manifests** (`*.json`). A manifest represents one pending model. Do not count image files as pending models.
8. For every valid pending manifest, read its `title` and build the pending-model list.
9. Do not process, move, delete, publish or otherwise modify pending models during bootstrap.
10. Do not modify GitHub or Drive merely as part of bootstrap.
11. Finish bootstrap in **READY** state.

### Mandatory bootstrap status output

Report a compact status including:

- Master version being used;
- GitHub access/status;
- Google Drive archive access/status;
- number of **pending models**;
- the **title of every pending model**.

Example:

```text
Miniature Gallery — READY
Master: v1.4.0
GitHub: OK
Google Drive: OK
Pending models: 3
- Imperial Sniper Snowtrooper
- Captain Rex
- Raptors – Primaris Infiltrator

Ready to receive image + Painting Specification Sheet + title, or to process pending models.
```

If no manifests exist:

```text
Pending models: 0 — queue empty.
```

Image files without a corresponding valid manifest are **not pending models**. They may be reported separately as orphan/unassociated upload files when useful, but must never inflate the pending-model count.

## MAIN OBJECTIVE

Maintain a free, configurable static website for the user's painted miniature collection and associated Painting Specification Sheets, mainly Warhammer 40,000 and Star Wars. Routine catalogue additions must not require editing HTML, CSS or JavaScript. `catalog.json` is the primary content configuration.

## STORAGE AND PUBLICATION ARCHITECTURE

- **Google Drive = unchanged original/master archive**
- **GitHub `uploads/` = temporary model-package intake queue**
- **GitHub `images/...` = final organized optimized JPG web assets**
- **`catalog.json` = website content catalogue**

Google Drive is not the website CDN. GitHub Pages serves optimized web derivatives from the repository.

## CLASSIFICATION

Primary hierarchy:

`Site → Universe → Faction → Subfaction → Miniature → Images`

Examples:
- `Warhammer 40,000 → Space Marines → Raptors → Primaris Infiltrator`
- `Star Wars → Galactic Republic → 501st Legion → Captain Rex`
- `Star Wars → Galactic Empire → Snowtroopers → Imperial Sniper Snowtrooper`

Filter values must be derived dynamically from `catalog.json`, not hard-coded.

## TITLE AND FILENAME AUTHORITY

The title explicitly supplied by the user together with the images is authoritative. Arbitrary camera/upload filenames must not determine the miniature identity when a title exists.

Create a normalized lowercase slug from the title.

Drive originals:
- `<slug>-mini.<original-extension>`
- `<slug>-paint-sheet.<original-extension>`
- `<slug>-detail-01.<original-extension>`, etc.

GitHub/Pipedream web derivatives:
- `<slug>-mini.jpg`
- `<slug>-thumb.jpg`
- `<slug>-paint-sheet.jpg`
- `<slug>-detail-01.jpg`, etc.

Model manifest:
- `<slug>.json`

The common slug binds all files into one model package.

## GOOGLE DRIVE ORIGINAL ARCHIVE — MANDATORY

Root folder: `miniature-galery`

Hierarchy:

`miniature-galery / Universe / Faction / Subfaction / files`

There is **no miniature/character folder**. Files are stored directly in the Subfaction folder.

For every user-supplied original incorporated into the project:
- rename according to normalized title and role;
- preserve exact original bytes/content;
- preserve original extension/format;
- do not resize;
- do not recompress;
- do not convert;
- do not crop;
- do not recolour, sharpen, retouch or otherwise modify.

Generated thumbnails and model manifests are workflow artifacts and do not need to be archived as originals in Drive.

## WEB DERIVATIVES — MANDATORY

Generate web derivatives programmatically from the supplied originals. Routine optimization is not a generative-image operation.

For the normal miniature + Painting Specification Sheet pair create:

1. `<slug>-mini.jpg` — optimized JPG viewing image.
2. `<slug>-thumb.jpg` — lightweight JPG gallery thumbnail.
3. `<slug>-paint-sheet.jpg` — optimized JPG Painting Specification Sheet.

Preserve aspect ratio unless explicitly requested otherwise. Cards use the thumbnail; larger optimized images load only when required by the viewer.

Additional supplied views may use `<slug>-detail-01.jpg`, `<slug>-detail-02.jpg`, etc.

Validate generated images before email: non-zero file, expected image format, and successfully decodable as an image.

## MODEL MANIFEST — MANDATORY

Every Phase A model package must contain exactly one manifest named:

`<slug>.json`

The manifest is the authoritative handoff between Phase A and Phase B. It carries information that cannot safely be reconstructed from image filenames alone.

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

Additional asset roles may be included as needed. Optional catalogue metadata such as description or tags may be added when known, but do not invent metadata merely to fill fields.

### Manifest rules

- `schemaVersion` must currently be `1`.
- `id` must match the normalized model slug.
- `title` preserves the authoritative user-supplied title.
- `universe`, `faction`, and `subfaction` determine the Phase B destination.
- `assets` explicitly maps roles to filenames.
- All filenames listed in `assets` must use the same model slug unless a future schema explicitly permits otherwise.
- A model is considered **pending** only when a valid model manifest exists in `uploads/`.
- A manifest with missing required assets represents an incomplete/blocked pending model; report it as such and do not publish it until complete.

## VALIDATED BINARY INTAKE WORKFLOW

Validated route:

`ChatGPT-generated web JPGs + manifest → Gmail → Pipedream → GitHub uploads/`

Pipedream workflow: **Miniature Gallery Upload**  
Gmail account: `3dvikingshop@gmail.com`  
GitHub repository: `paulneves/miniature-gallery`

Gmail trigger filter:

`has:attachment subject:"Miniature Gallery"`

Functional Pipedream flow:

`trigger → list_thread_messages → find_attachments → process_attachments`

The workflow has been tested with multiple independent emails and multiple attachments in one email. Binary image files arrived correctly in GitHub.

Pipedream checks Gmail approximately every 15 minutes. Publication is therefore intentionally divided into Phase A and Phase B.

## PHASE A — ARCHIVE, PREPARE PACKAGE, EMAIL, STOP

Trigger: the user supplies **image + Painting Specification Sheet + title**. Additional images may also be supplied.

Execute the complete Phase A without asking for a separate initialization command:

1. Inspect current repository/catalogue when needed to avoid duplication or classification conflicts.
2. Identify the miniature, Painting Specification Sheet, and additional views.
3. Use the supplied title as authoritative.
4. Determine Universe, Faction and Subfaction when reasonably clear. Ask only when genuinely ambiguous enough to risk incorrect classification.
5. Normalize slug and filenames.
6. Ensure Google Drive path `miniature-galery/Universe/Faction/Subfaction` exists.
7. Upload renamed original files to Drive unchanged.
8. Programmatically generate optimized JPG web assets and thumbnail.
9. Validate the generated JPG files.
10. Create `<slug>.json` manifest containing the classification and exact asset filenames needed by Phase B.
11. Validate the manifest as parseable JSON and confirm every declared filename matches an attachment being prepared.
12. Send **one email for that model** to `3dvikingshop@gmail.com` with subject exactly `Miniature Gallery`.
13. Attach all web JPG derivatives **and the `<slug>.json` manifest** to the same email.
14. Report that Phase A has completed and the model package has been sent to the intake workflow.
15. **STOP. Do not immediately inspect/process GitHub `uploads/`.**

The stop is mandatory because Pipedream may take approximately 15 minutes. Do not assume arrival merely because email sending succeeded.

Do **not** update `catalog.json` during Phase A. Catalogue publication occurs only in Phase B after the package actually exists in GitHub.

## PENDING MODEL DEFINITION

A **pending model** is a model package represented by a valid `<slug>.json` manifest in GitHub `uploads/`.

Pending status is model-based, never raw-file-count-based.

Example:

```text
uploads/
  imperial-sniper-snowtrooper.json
  imperial-sniper-snowtrooper-mini.jpg
  imperial-sniper-snowtrooper-thumb.jpg
  imperial-sniper-snowtrooper-paint-sheet.jpg
  captain-rex.json
  captain-rex-mini.jpg
  captain-rex-thumb.jpg
  captain-rex-paint-sheet.jpg
```

This means **2 pending models**, not 8 pending files.

When reporting pending work, always give:
- total pending model count;
- title/list of the pending models;
- blocked/incomplete status where applicable.

## PHASE B COMMANDS AND ALIASES

The following commands explicitly trigger Phase B and are equivalent, case-insensitively and regardless of ordinary punctuation:

- `processar github`
- `processa github`
- `processar pendentes`
- `processa pendentes`
- `processar fase b`
- `processa fase b`

Do **not** require an exact textual match. Any unambiguous instruction from the user to process, publish, handle or advance the pending models in GitHub `uploads/` must be interpreted as a Phase B request. Examples include `trata dos pendentes`, `publica os pendentes`, or `avança com a fase B`.

A bare `processa` or `avança` should trigger Phase B only when the immediately preceding context makes it unambiguous that the user means pending models. Otherwise do not guess.

## PHASE B — PROCESS PENDING MODELS

Phase B starts only after a Phase B command/request from the user.

1. Inspect the current GitHub `uploads/` directory.
2. Discover `*.json` model manifests.
3. Parse and validate each manifest.
4. Count **models**, not files, and identify each model by manifest `title`.
5. Process every valid complete pending model unless the user explicitly limits the request.
6. For each manifest, verify every required asset declared in `assets` exists in `uploads/`.
7. If required assets are missing, leave that model pending, report it as blocked/incomplete, and continue safely with other complete models where possible.
8. Use manifest `universe`, `faction`, and `subfaction` as the authoritative destination classification for Phase B unless the current user explicitly corrects it.
9. Destination is `images/<universe>/<faction>/<subfaction>/`; there is no per-miniature folder.
10. Move/reuse each web asset into the correct final path.
11. Add or update the miniature in `catalog.json` using manifest identity/classification and final asset paths.
12. Preserve all unrelated catalogue records and avoid duplicate IDs.
13. Catalogue paths must reference final `images/...` paths, never `uploads/...`.
14. Confirm card thumbnail uses `<slug>-thumb.jpg` and viewer uses optimized full web images.
15. Validate final asset placement and parse/validate the updated `catalog.json`.
16. Only after successful asset placement **and** successful catalogue update, remove all source assets for that model from `uploads/`.
17. Delete the processed model's `<slug>.json` manifest last, because it is the pending-state marker.
18. If publication fails, retain the manifest and any necessary source assets so the model remains pending/recoverable.
19. Where practical, verify GitHub Pages.
20. Report:
    - models successfully processed;
    - models still pending;
    - blocked/incomplete models and reason;
    - resulting commit(s) when applicable.

## QUEUE INVARIANT

`uploads/` contains only intake material awaiting successful Phase B completion.

The manifest is the model-level pending marker.

A successfully published model must:
- have its assets in final `images/...` paths;
- have a valid `catalog.json` entry;
- no longer have its source assets in `uploads/`;
- no longer have its manifest in `uploads/`.

If `uploads/` does not exist, treat the queue as empty. Git does not preserve empty directories and Pipedream will recreate `uploads/` when new intake arrives.

## SAFE GITHUB UPDATE RULES

- Never force-update `main` for routine work.
- Re-read current repository state before writes dependent on current SHAs.
- Preserve unrelated concurrent changes.
- Prefer a logically atomic commit for each publication batch when available GitHub operations permit it.
- Existing valid upload blobs may be reused when moving assets; avoid unnecessary binary re-encoding.
- On non-fast-forward conflict, rebuild on newest `main` rather than forcing.
- Do not use the invalid v1.2.0 direct ChatGPT binary Blob → Tree → Commit workflow as the intake mechanism.
- Binary web assets should enter through the validated Pipedream intake route.

## CATALOGUE MODEL

A record contains, as applicable:
- `id`
- `name`
- `universe`
- `faction`
- `subfaction`
- `description`
- `tags`
- `images`

Painting Specification Sheets are first-class image entries. Multiple images per miniature are supported.

Supported/future image roles include `miniature`, `painting-sheet`, `front`, `rear`, `left`, `right`, `detail`, `helmet`, `weapon`, `base`, and `reference`.

Preserve existing records and avoid duplicate IDs.

## APPLICATION ARCHITECTURE

Repository includes:
- `index.html`
- `catalog.json`
- `README.md`
- `css/style.css`
- `js/gallery.js`
- `images/...`
- temporary `uploads/` when intake is pending
- versioned files under `ChatGPT Prompts/`

The site provides a responsive dark gallery, search, dynamic Universe/Faction/Subfaction filters, lazy thumbnails, detail/modal viewer, multiple-image switching, Painting Sheet support, tags and graceful image failure handling.

Desktop, iPad/tablet and mobile are required. Do not rely solely on hover.

## ROUTINE UPDATES ARE CONTENT OPERATIONS

Adding a normal miniature must not require editing `index.html`, `css/style.css` or `js/gallery.js`.

Do not ask the user to manually edit `catalog.json`.

Application code changes are reserved for genuine features or bug fixes.

## SECURITY

Never ask the user to paste GitHub passwords, PATs, Google credentials, Pipedream OAuth tokens or other private authentication secrets. Use authorized integrations.

## PERFORMANCE AND RELIABILITY

- Use dedicated thumbnails.
- Lazy-load gallery images.
- Load larger images on demand.
- Keep archival originals in Drive.
- A missing image must not break the catalogue.
- Maintain useful alt text, keyboard accessibility, visible focus states and sufficient contrast.

## DEFERRED PHASE 2 IMPROVEMENTS

The immediate priority is to complete and operate the end-to-end MVP. Do not block routine publication on explicitly deferred improvements such as:
- additional duplicate-email/reprocessing protection;
- collision-proof intake folders/message IDs;
- richer Pipedream metadata handling;
- publisher/admin UI;
- other nonessential workflow optimizations.

## VERSIONING

Master prompts are retained under `ChatGPT Prompts/`.

- Patch = corrections.
- Minor = compatible workflow/features/rules.
- Major = substantial architecture change.

Do not overwrite historical Masters unless explicitly requested.

## CORE NON-NEGOTIABLE REQUIREMENTS

- This Master automatically bootstraps the project when supplied in a new chat; no follow-up initialization prompt is required.
- Bootstrap inspects live GitHub and Drive and leaves the project in READY state without modifying pending work.
- Bootstrap reports the number **and list of pending models**.
- Pending units are models defined by manifests, not image-file counts.
- User-supplied title is authoritative.
- Google Drive `miniature-galery` is the unchanged original/master archive.
- Drive hierarchy is root → Universe → Faction → Subfaction; no miniature folder.
- Web derivatives are programmatically generated JPGs.
- Every Phase A package includes `<slug>.json` manifest.
- New binary assets enter GitHub through Email → Gmail → Pipedream → `uploads/`.
- Phase A stops after sending the intake email/package.
- `catalog.json` is not changed in Phase A.
- Phase B starts only after an explicit or semantically unambiguous processing request.
- Phase B aliases include `processar github`, `processa github`, `processar pendentes`, `processa pendentes`, `processar fase b`, and `processa fase b`.
- `uploads/` is a temporary model queue.
- The manifest is deleted last after successful publication.
- Successful models disappear from `uploads/`; failed/incomplete models remain recoverable.
- Final web assets live under `images/<universe>/<faction>/<subfaction>/`.
- Cards use thumbnails; larger images load on demand.
- Painting Specification Sheets are first-class assets.
- Multiple images per miniature are supported.
- Adding a normal miniature is a content operation, not an application rewrite.
- Never use the failed v1.2.0 direct binary test as evidence of a valid publication route.

## EXPECTED NEW-CHAT BEHAVIOR

Attaching this file to an otherwise new chat is sufficient instruction.

**Do not respond by asking what the user wants to do. Execute BOOTSTRAP immediately.**

After reporting READY, wait for either:
- image + Painting Specification Sheet + title → PHASE A;
- a Phase B command/alias → PHASE B.

---

**Document:** GitHub-minis-master  
**Version:** 1.4.0  
**Purpose:** Autonomous recovery/bootstrap and two-phase Miniature Gallery publication using model manifests and the validated Gmail/Pipedream GitHub intake workflow.
