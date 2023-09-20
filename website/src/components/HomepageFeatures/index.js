import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Web Components',
    Svg: require('@site/static/img/web-components-logo.svg').default,
    svgClassName: 'wc',
    description: (
      <>
        Web Components allows you to create reusable custom elements — with their functionality encapsulated away from the rest of your code.
      </>
    ),
  },
  {
    title: 'Based on Chart.js',
    Svg: require('@site/static/img/chartjs-logo.svg').default,
    svgClassName: 'chartjs',
    description: (
      <>
        Simple yet flexible JavaScript charting library for the modern web.
        It is currently the most popular one according to GitHub stars (~60,000) and npm downloads (~2,400,000 weekly).
      </>
    ),
  },
  {
    title: 'Canvas Rendering',
    Svg: require('@site/static/img/canvas-icon.svg').default,
    svgClassName: 'canvas',
    description: (
      <>
        Renders chart elements on an HTML5 canvas unlike several others,
        mostly D3.js-based, charting libraries that render as SVG.
        It makes rendering quite fast.
      </>
    ),
  },
];

function Feature({Svg, title, description, svgClassName}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg + ' ' + (svgClassName ? styles[svgClassName] : '')} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
