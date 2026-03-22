# Full Page Screenshot

A minimal Chrome extension that captures full-page screenshots and PDFs directly in the browser — no data ever leaves your machine.

## Why this exists

Most screenshot extensions (including popular ones like GoFullPage) require an active internet connection to function. This raises the question: are they transmitting your screenshots to external servers?

This extension was built to eliminate that concern entirely. It uses Chrome's built-in [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) — the same API that powers Chrome's own DevTools screenshot and print features — and saves files directly to your Downloads folder. There are no external servers, no analytics, no cloud sync, and no network calls of any kind.

## Features

- **Full-page PNG screenshot** — captures the entire scrollable page, not just the visible viewport
- **Full-page PDF** — uses Chrome's native print engine, producing a real PDF with selectable text
- Works completely **offline**
- Open source — inspect every line

## Permissions

| Permission | Why it's needed |
|---|---|
| `debugger` | Calls Chrome DevTools Protocol to capture the page |
| `downloads` | Saves the file to your Downloads folder |
| `activeTab` | Identifies which tab to capture |
| `tabs` | Queries the active tab when the popup button is clicked |

No host permissions, no access to browsing history, no network access.

## Installation

Chrome does not allow sideloaded extensions in production mode without publishing to the Web Store. To install locally:

1. Clone or download this repo
2. Open `chrome://extensions/`
3. Enable **Developer mode** (toggle, top right)
4. Click **Load unpacked** and select this folder

## Usage

Click the extension icon in the toolbar and choose **Save as PNG** or **Save as PDF**. The file saves automatically to your Downloads folder.

> **Note:** While capturing, Chrome briefly shows a yellow "Chrome is being debugged" bar at the top of the tab. This is a Chrome security notice that appears any time the debugger API is used. It disappears as soon as the capture completes.

## How it works

- **PNG**: Calls `Page.getLayoutMetrics` to get the full page dimensions, then `Page.captureScreenshot` with `captureBeyondViewport: true` to capture content outside the visible area.
- **PDF**: Calls `Page.printToPDF` with `printBackground: true`, equivalent to Chrome's built-in "Print → Save as PDF".

## License

MIT
