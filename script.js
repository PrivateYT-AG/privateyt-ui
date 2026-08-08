// dialog stuff
const dialog = document.querySelectorAll('dialog');
const showModal = document.querySelectorAll('.showModal');
const closeModal = document.querySelectorAll('.closeModal');

dialog.forEach(dialog => {
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();

    const isInDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!isInDialog) {
      dialog.classList.add('closing');
      setTimeout(() => {
        dialog.close();
        dialog.classList.remove('closing');
      }, 200)
    }
  });
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    dialog.classList.add('closing');
    setTimeout(() => {
      dialog.close();
      dialog.classList.remove('closing');
    }, 200)
  })
});

showModal.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.dialog;
    const dialog = document.getElementById(id);
    if (dialog) {dialog.showModal()}
  })
});

closeModal.forEach(btn => {
  btn.addEventListener('click', () => {
    const dialog = btn.closest('dialog');
    if (dialog) {
      dialog.classList.add('closing');
      setTimeout(() => {
        dialog.close();
        dialog.classList.remove('closing');
      }, 200)
    }
  })
});

// Todo: Accessibility (none here for now)
const dropdownBtns = document.querySelectorAll('.dropdown-btn');
document.querySelectorAll('.dropdown-menu button, .dropdown-menu .link-button').forEach(btn => {
  btn.setAttribute('tabindex', '-1');
});

dropdownBtns.forEach(btn => {
  const menu = btn.nextElementSibling;
  const items = menu.querySelectorAll('button, .link-button');
  btn.addEventListener('click', function () {
    const isOpen = menu.classList.contains('show');

    closeAll();

    if (!isOpen) {
      menu.classList.add('show');
      btn.setAttribute('aria-expanded', 'true');
      items[0].focus();
    }
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      menu.classList.add('show');
      btn.setAttribute('aria-expanded', 'true');
      items[0].focus();
    }
  });

  items.forEach((item, index) => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(index + 1) % items.length].focus();
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(index - 1 + items.length) % items.length].focus();
      }

      if (e.key === 'Escape') {
        closeAll();
        btn.focus();
      }
    });
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown-container')) {
    closeAll(true);
  }
});

function closeAll(restoreFocus = false) {
  document.querySelectorAll('.dropdown-container').forEach(container => {
    const menu = container.querySelector('.dropdown-menu');
    const btn = container.querySelector('.dropdown-btn');
    const wasOpen = menu.classList.contains('show');

    menu.classList.remove('show');
    btn.setAttribute('aria-expanded', 'false');

    if (wasOpen && restoreFocus) {
      btn.focus();
    }
  })
}

// theme switching (needs improvement, to be honest)
const lightBtn = document.getElementById('light-mode-btn');
const darkBtn = document.getElementById('dark-mode-btn');
const oledDarkBtn = document.getElementById('oled-dark-btn');
const systemBtn = document.getElementById('system-theme-btn');

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme) {
  document.body.classList.remove('dark-mode');
  document.body.classList.remove('oled-dark');

  if (theme ==='dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('oled-dark');
  } else if (theme === 'oled-dark') {
    document.body.classList.add('oled-dark');
    document.body.classList.remove('dark-mode');
  }
  else if (theme === 'system') {
    if (mediaQuery.matches) {
      document.body.classList.add('dark-mode')
    }
  }
}

lightBtn.addEventListener('click', () => {
  localStorage.setItem('theme', 'light');
  applyTheme('light');
  updateActive();
});

darkBtn.addEventListener('click', () => {
  localStorage.setItem('theme', 'dark');
  applyTheme('dark');
  updateActive();
});

oledDarkBtn.addEventListener('click', () => {
  localStorage.setItem('theme', 'oled-dark');
  applyTheme('oled-dark');
  updateActive();
});

systemBtn.addEventListener('click', () => {
  localStorage.setItem('theme', 'system');
  applyTheme('system');
  updateActive();
});

mediaQuery.addEventListener('change', () => {
  if (localStorage.getItem('theme') === 'system') {
    applyTheme('system');
  }
});

function updateActive() {
  const theme = localStorage.getItem('theme') || 'system';

  lightBtn.classList.toggle('active', theme === 'light');
  darkBtn.classList.toggle('active', theme === 'dark');
  oledDarkBtn.classList.toggle('active', theme === 'oled-dark');
  systemBtn.classList.toggle('active', theme === 'system');
}

const savedTheme = localStorage.getItem('theme') || 'system';
applyTheme(savedTheme);
updateActive();

// Custom context menu

const contextMenuTrigger = document.getElementById('custom-context-menu-trigger');

contextMenuTrigger.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});