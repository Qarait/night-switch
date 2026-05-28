# Night Switch

Night Switch is a small bookmarklet for people who want a quick dark mode without installing a browser extension.

## What it does

- Bright pages get a darker treatment.
- Already-dark pages stay mostly as they are.
- The floating control lives in a shadow root so the host page has less room to interfere.
- A reset bookmarklet is included in case a page needs a clean exit.

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

Tested in Chrome and Edge. Other browsers may behave differently with bookmarklets, clipboard access, or site restrictions.

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

## Files

- `index.html`: landing page
- `style.css`: page styling
- `app.js`: bookmarklet generator

## Notes

- This is a bookmarklet, not an extension.
- It is meant to be easy to try, easy to share, and easy to tweak later.
