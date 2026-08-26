/**
 * 🇮🇳 BHARAT SAFE YATRA — TOAST NOTIFICATION ENGINE
 */

let toastContainer = null;

export function showToast(message, type = 'info', duration = 3500) {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('role', 'status');
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  const icons = {
    success: '✓',
    warning: '⚠️',
    danger: '🚨',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <span style="font-size: 1.1rem;">${icons[type] || 'ℹ️'}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 200ms ease-out';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}
