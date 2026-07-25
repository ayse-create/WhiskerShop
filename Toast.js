// ===== ui/Toast.js =====

let stackEl = null;

function ensureStack() {
  if (!stackEl) {
    stackEl = document.createElement('div');
    stackEl.className = 'toast-stack';
    document.body.appendChild(stackEl);
  }
  return stackEl;
}

export function showToast(message, { type = 'default', icon = '' } = {}) {
  const stack = ensureStack();
  const el = document.createElement('div');
  el.className = `toast ${type !== 'default' ? type : ''}`.trim();
  el.innerHTML = `${icon ? `<span>${icon}</span>` : ''}<span>${message}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 3100);
}
