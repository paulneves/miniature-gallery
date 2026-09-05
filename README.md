# Miniature Gallery

A static, configurable miniature catalogue designed for GitHub Pages.

## Updating the catalogue

Normal catalogue updates only require editing `catalog.json`. The HTML, CSS and JavaScript do not need to change.

Each miniature supports:

- Universe
- Faction
- Subfaction
- Description
- Tags
- Any number of images
- Local image paths or remote image URLs
- Optional source links and credits for every image

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

Add another object to the `miniatures` array in `catalog.json`. Filters for Universe, Faction and Subfaction are generated automatically from the data.

## GitHub Pages

The site contains only static HTML/CSS/JavaScript and can be published directly with GitHub Pages from the repository root on the `main` branch.

## Note about demo images

The initial `catalog.json` uses remote placeholder images to demonstrate external-image support. Replace these URLs with the actual miniature and painting-sheet images when ready.
