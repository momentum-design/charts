/* eslint-disable no-undef */
const themeColorSetMapping = {
  light: 'default',
  dark: 'dark',
};
var defaultTheme = getCurrentTheme()
if (defaultTheme) {
  // eslint-disable-next-line no-undef
  mdw.settings.set({ theme: defaultTheme, colorSet: themeColorSetMapping[defaultTheme] });
}

function getCurrentTheme() {
  return localStorage.getItem('theme'); // light or dark
}

function listenThemeChange(callback, sender, listenEventOptions) {
  const btnElements = document.querySelectorAll('#__docusaurus > .navbar > .navbar__inner > .navbar__items--right button');
  btnElements.forEach(function (element) {

    // toggle of color mode
    if (element.className.indexOf('ColorModeToggle') > 0 || element.className.indexOf('toggleButton') > 0) {
      const fnCallback = () => {
        setTimeout(() => {
          const theme = localStorage.getItem('theme');
          callback.call(sender, theme);
        }, 200);
      }
      element.addEventListener('click', fnCallback, listenEventOptions);
    }
  });
}

setTimeout(() => {
  listenThemeChange((theme) => {
    mdw.changeTheme(theme, themeColorSetMapping[theme]);
  })
}, 2000);

// set http
mdw.settings.setHttpClient(new function () {
  this.get = function (url) {
    return axios.get(url).then((response) => {
      return response.data;
    });
  }

  this.post = function (url, data) {
    return axios.post(url, data).then((response) => {
      return response.data;
    });
  }
});
