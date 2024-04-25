import React, { useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

import BrowserWindow from '@site/src/components/BrowserWindow';

const js = `<script src="https://unpkg.com/@momentum-design/charts/dist/charts.umd.js"></script>\n`;

export default function HomepageDemo() {
  const winRef = React.createRef();
  const bwRef = React.createRef();
  const codeRef = React.createRef();
  const [theme, setTheme] = React.useState(null);
  const copy = () => {
    const copyText = codeRef.current.innerText.replace(/\\x3/g, '<');
    console.log('Below context copied.', copyText);
    navigator.clipboard.writeText(copyText);
  };

  let code;
  let timeoutId;
  const setCode = () => {
    code = code ??
      (js + bwRef.current.cloneNode(true).innerHTML
        .replace(/<!--.*?<\/canvas>/g, '')
        .replace(/ data/g, '\n  data')
        .replace(/ options/g, '\n  options')
        .replace(/></g, '>\n<')
        .replace(/,/g, ',\n  ')
        .replace(/"{/g, '\'{\n  ')
        .replace(/}"/g, '\n  }\'\n')
      )
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      ;
    codeRef.current.dataset.highlighted = '';
    codeRef.current.innerHTML = code;
    window.hljs.highlightElement(codeRef.current);
  }
  useEffect(() => {
    setCode();
    setTheme(window.getCurrentTheme());
    window.listenThemeChange((theme) => {
      setTheme(theme);
      timeoutId = setTimeout(() => {
        window.initTheme();
      }, 100);
    });
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }, [theme]);
  return (
    <section className={styles.section}>
      <div className={clsx('container', styles.container)}>
        <div className={styles.demo}>
          <h2 className={styles.h2}>
            Start your charts
            <button onClick={copy} title='Copy to clipboard' className={clsx(styles.btncp, 'flex items-center border-0 justify-center w-8 h-8 rounded focus:outline-none')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill='#efefef' d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" /></svg>
            </button>
          </h2>
          <pre className={styles.pre}><code className={clsx('language-html', styles.code)} ref={codeRef}></code></pre>
        </div>

        <div ref={winRef} className={styles.win}>
          <BrowserWindow className={styles.bw} url="http://localhost:3000" minHeight="400">
            <div key={theme} ref={bwRef}>
              <div className='grid grid-cols-2'>
                <md-chart
                  type="pie"
                  data='{
                "Brunei Darussalam": 739,
                "Jordan": 763,
                "Burkina Faso": 604,
                "Cook Islands": 509,
                "Monaco": 205,
                "Switzerland": 108
              }'
                ></md-chart>
                <md-chart
                  type="donut"
                  data-url="https://momentum-design.github.io/charts/data.json#pie"
                ></md-chart>
              </div>
              <md-chart
                type="column"
                style={{ height: '300px' }}
                data-url="https://momentum-design.github.io/charts/data.json#column"
                options='{"categoryAxis":{"dataKey":"year"}}'
              ></md-chart>
            </div>
          </BrowserWindow>
        </div>

      </div>
    </section>
  );
}
