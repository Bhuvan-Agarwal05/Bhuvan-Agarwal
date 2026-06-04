# Bhuvan Agarwal — Resume Website

A static one-page resume site built from `Bhuvan_Agarwal_SDE_5Y.pdf`.

## View locally

Open `index.html` in your browser, or serve the folder:

```bash
npx serve .
```

## Structure

- `index.html` — page content and sections
- `css/styles.css` — layout and theme
- `js/main.js` — scroll animations and mobile nav
- `js/recommendations.js` — builds recommendation cards on the page
- `data/recommendations.json` — **only place to edit** recommendation text and grouping
- `Bhuvan_Agarwal_SDE_5Y.pdf` — downloadable resume

## LinkedIn recommendations

Edit **`data/recommendations.json` only** (not the `.js` file). The JS file just reads that JSON and draws the layout.

Recommendations are grouped by career phase. Add entries under the matching `periods[].items` array:

```json
{
  "periods": [
    {
      "id": "kornferry-dev2",
      "role": "Developer II",
      "company": "Korn Ferry",
      "dates": "Jan 2025 — Present",
      "items": [
        {
          "author": "Full Name",
          "authorUrl": "https://www.linkedin.com/in/...",
          "role": "Optional title",
          "quote": "Recommendation text"
        }
      ]
    }
  ]
}
```

Period IDs: `kornferry-dev2`, `kornferry-associate`, `tcs`, `college`. Empty periods are hidden on the site.
