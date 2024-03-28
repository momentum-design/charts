import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  document.addEventListener('click', (evt) => {
    const button = window.lookupElement(evt.target, (ele) => ele.tagName === 'BUTTON');
    if (button && window.isThemeButton(button)) {
      setTimeout(() => {
        window.initTheme();
      }, 10);
    }
  })
}