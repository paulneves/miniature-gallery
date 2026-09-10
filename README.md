# Miniature Gallery

A static, configurable miniature catalogue designed for GitHub Pages.

## Updating the catalogue

Normal catalogue updates only require editing `catalog.json`. The HTML, CSS and JavaScript do not need to change.

Each miniature supports:

- Universe
- Faction
- Subfaction
- Paint Brand
- Description
- Tags
- Any number of images
- Local image paths or remote image URLs
- Optional source links and credits for every image

## Paint Brand

Use the `paintBrand` field on catalogue records, for example:

```json
"paintBrand": "AK Interactive"
```

Current/planned canonical values include:

- `AK Interactive`
- `Vallejo`
- `Army Painter`

The website derives the Paint Brand filter dynamically from catalogue data. Legacy records created before Paint Brand support are treated as `AK Interactive`, because all sheets loaded before this change use AK Interactive. New records should store `paintBrand` explicitly.

## Image entry

```json
{
  "type": "miniature",
  "title": "Front View",
  "url": "https://example.com/image.jpg",
  "link": "https://example.com/original-page",
  "credit": "Example Studio"
}
```

`url` can also be a local repository path such as `images/star-wars/captain-rex/front.jpg`.

## Adding a miniature

Add another object to the `miniatures` array in `catalog.json`. Filters for Universe, Faction, Subfaction and Paint Brand are generated automatically from the data.

A new record should include its paint brand:

```json
{
  "id": "example-miniature",
  "name": "Example Miniature",
  "universe": "Star Wars",
  "faction": "Galactic Empire",
  "subfaction": "Stormtroopers",
  "paintBrand": "AK Interactive",
  "images": []
}
```

## GitHub Pages

The site contains only static HTML/CSS/JavaScript and can be published directly with GitHub Pages from the repository root on the `main` branch.

## Intake workflow

New model packages are prepared in Phase A and enter GitHub through Gmail → Pipedream → `uploads/`. Each package includes optimized JPG assets and a `<slug>.json` manifest. From Master v1.5.0 onward, new manifests include `paintBrand`, which Phase B writes into `catalog.json` when publishing the model.
