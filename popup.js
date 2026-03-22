const status = document.getElementById('status');

function capture(format) {
  status.textContent = 'Capturing...';
  chrome.runtime.sendMessage({ format }, (response) => {
    if (response?.ok) {
      status.textContent = 'Saved to Downloads.';
      setTimeout(() => window.close(), 800);
    } else {
      status.textContent = 'Error — check console.';
    }
  });
}

document.getElementById('png').addEventListener('click', () => capture('png'));
document.getElementById('pdf').addEventListener('click', () => capture('pdf'));
