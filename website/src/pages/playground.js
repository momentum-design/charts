import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function Playground() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={`${siteConfig.tagline}`}>
      <iframe style={{ width: '100%', height: 'calc(100vh - 311px)' }} scrolling="no" title="Hello World" src="https://codepen.io/bndynet/embed/xxmpYYg?default-tab=html%2Cresult&editable=true&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
        See the Pen <a href="https://codepen.io/bndynet/pen/xxmpYYg">
          Hello World</a> by Bendy Zhang (<a href="https://codepen.io/bndynet">@bndynet</a>)
        on <a href="https://codepen.io">CodePen</a>.
      </iframe>
    </Layout>
  );
}

