# Night Switch

Night Switch is a small bookmarklet for people who want a quick dark mode without installing a browser extension.

It ships as a tiny landing page, a drag-to-bookmarks bookmarklet, and a reset fallback for recovery.

## What it does

- Bright pages get a darker treatment.
- Already-dark pages stay mostly as they are.
- The floating control lives in a shadow root so the host page has less room to interfere.
- A reset bookmarklet is included in case a page needs a clean exit.
- A small site-profile list keeps a few complex web apps on a gentler preset.
- A user-editable skip list lets you exclude sites you do not want to touch at all.

## Trust

- No remote code is loaded at runtime.
- No analytics or tracking scripts are included.
- The release tag and fingerprints on the landing page match the exact bookmarklet text you drag to your bookmarks bar.
- There is no remote code and no analytics.

## Use it

1. Open the landing page.
2. Drag the green button to your bookmarks bar.
3. Open a site that feels too bright.
4. Click the bookmarklet.

If you want to undo it on a problem page, drag the gray reset bookmarklet to your bookmarks bar and click it on that site.

## Limits

- You still need to click the bookmarklet on each page load.
- Some sites with strict CSP rules may block the injected styling.
- Very complex pages may still need a little tuning.

## Compatibility

| Environment | Status | Notes |
| --- | --- | --- |
| Chrome desktop | Tested | Best setup path for the bookmarklet page |
| Edge desktop | Tested | Behaves the same as Chrome for normal use |
| Firefox desktop | Limited | Bookmarklet behavior can vary by browser settings |
| Safari desktop | Limited | Bookmarklet and clipboard behavior can differ |
| Mobile browsers | Limited | Bookmarklets are usually awkward to set up |

## Local use

Open `index.html` in a browser.

From there you can:

- drag the green button to your bookmarks bar
- click `Copy code` if you prefer to paste the bookmarklet into a bookmark manually
- use the reset bookmarklet if a page gets into a bad state

## Sharing it

If you want other people to use it, publish this folder with GitHub Pages and share the page link.

Live site: https://qarait.github.io/night-switch/

That keeps the setup simple:

1. they open the page
2. they drag the button
3. they use the bookmarklet on any site

## Launch copy

Use this if you want a short repo description or a post that sounds plain and direct:

> Night Switch is a bookmarklet for quick dark mode on bright websites. Open the page, drag one button to your bookmarks bar, and click it on any site that needs a darker treatment.

If you are posting on Reddit or GitHub, keep the first line focused on the use case, then link the live page and ask for feedback on usability rather than announcing it like a product launch.

## Files

- `index.html`: landing page
- `style.css`: page styling
- `app.js`: bookmarklet generator

## Development notes

- Keep darkening-rule changes conservative.
- Before changing the rules again, sanity-check a bright news page, an already-dark page, and a content-heavy forum page.
- Check one complex web app from the site-profile list as well, because that preset is the one most likely to drift.

## Notes

- This is a bookmarklet, not an extension.
- It is meant to be easy to try, easy to share, and easy to tweak later.
