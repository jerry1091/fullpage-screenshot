chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleCapture(message.format).then(
    () => sendResponse({ ok: true }),
    () => sendResponse({ ok: false })
  );
  return true; // keep message channel open for async response
});

async function handleCapture(format) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tab.id;

  try {
    await chrome.debugger.attach({ tabId }, '1.3');

    let data, ext, mimeType;

    if (format === 'pdf') {
      const result = await chrome.debugger.sendCommand(
        { tabId },
        'Page.printToPDF',
        { printBackground: true, preferCSSPageSize: true }
      );
      data = result.data;
      ext = 'pdf';
      mimeType = 'application/pdf';
    } else {
      const metrics = await chrome.debugger.sendCommand(
        { tabId },
        'Page.getLayoutMetrics'
      );
      const width = Math.ceil(metrics.cssContentSize.width);
      const height = Math.ceil(metrics.cssContentSize.height);

      const result = await chrome.debugger.sendCommand(
        { tabId },
        'Page.captureScreenshot',
        {
          format: 'png',
          captureBeyondViewport: true,
          clip: { x: 0, y: 0, width, height, scale: 1 }
        }
      );
      data = result.data;
      ext = 'png';
      mimeType = 'image/png';
    }

    await chrome.debugger.detach({ tabId });

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    await chrome.downloads.download({
      url: `data:${mimeType};base64,${data}`,
      filename: `screenshot-${timestamp}.${ext}`,
      saveAs: false
    });

  } catch (err) {
    try { await chrome.debugger.detach({ tabId }); } catch {}
    console.error('Capture failed:', err);
    throw err;
  }
}
