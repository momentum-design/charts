/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
var themeColorSetMapping = {
  light: 'default',
  dark: 'dark',
};

initTheme();

function getCurrentTheme() {
  return localStorage.getItem('theme') ?? 'light'; // light or dark
}

function initTheme() {
  const theme = getCurrentTheme();
  // eslint-disable-next-line no-undef
  md.settings.set({ theme: theme, colorSet: themeColorSetMapping[theme] });
}

function isThemeButton(element) {
  if (!element) {
    return false;
  }
  const cls = element.getAttribute('class');
  return cls && (cls.indexOf('ColorModeToggle') > 0 || cls.indexOf('toggleButton') > 0);
}

function getThemeButton() {
  const btnElements = document.querySelectorAll('#__docusaurus > .navbar > .navbar__inner > .navbar__items--right button');
  return Array.from(btnElements).find(element => isThemeButton(element));
}

function listenThemeChange(callback, listenEventOptions) {
  const btnElement = getThemeButton();
  if (btnElement) {
    const fnCallback = () => {
      setTimeout(() => {
        callback(getCurrentTheme());
      }, 200);
    }
    btnElement.addEventListener('click', fnCallback, listenEventOptions);
  }
}

function lookupElement(element, fnCondition) {
  if (!element)
    return null;

  return fnCondition(element) ? element : lookupElement(element.parentNode, fnCondition);
}

// set http
md.settings.setHttpClient(new function () {
  this.get = function (url) {
    return fetch(url).then((response) => {
      return response.json();
    });
  }

  this.post = function (url, data) {
    return fetch(url, {
      method: 'POST',
      body: typeof data === 'object' ? JSON.stringify(data) : data,
    }).then((response) => {
      return response.json();
    });
  }
});
