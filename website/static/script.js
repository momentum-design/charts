const themeColorSetMapping = {
  light: 'default',
  dark: 'dark',
};
const defaultTheme = localStorage.getItem('theme'); // light or dark
if (defaultTheme) {
  // eslint-disable-next-line no-undef
  mdw.settings.set({ theme: defaultTheme, colorSet: themeColorSetMapping[defaultTheme] });
}
setTimeout(() => {
  const btnElements = document.querySelectorAll('#__docusaurus > .navbar > .navbar__inner > .navbar__items--right button');
  btnElements.forEach(function (element) {

    // toggle of color mode
    if (element.className.indexOf('ColorModeToggle') > 0) {
      element.addEventListener('click', function () {
        setTimeout(() => {
          const theme = localStorage.getItem('theme');
          // eslint-disable-next-line no-undef
          mdw.changeTheme(theme, themeColorSetMapping[theme]);
        }, 100);
      });
    }
  });
}, 2000);