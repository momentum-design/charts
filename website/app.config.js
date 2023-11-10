module.exports = {
  staticDirectories: ['static', '../'],
  url: 'https://momentum-design.github.io',
  baseUrl: '/',
  logoUrl: '/img/logo.png',
  footerLogoUrl: 'img/md-logo.svg',
  name: 'WIDGETS',
  title: 'Widgets from Momentum Design',
  tagline: 'A component-based widget library includes some charts based on Chart.js which can be used in any front-end framework.',
  githubUser: 'momentum-design',
  githubRepo: 'momentum-widgets',
  copyright: `Copyright © ${new Date().getFullYear()} Cisco and/or its affiliates. All rights reserved.`,
  get menus() {
    return [
      {
        type: 'docSidebar',
        sidebarId: 'tutorials',
        position: 'left',
        label: 'Tutorials',
      },
      {
        type: 'docSidebar',
        sidebarId: 'api',
        position: 'left',
        label: 'API',
      },
      { to: '/blog', label: 'Blog', position: 'left' },
      { to: '/playground', label: 'Playground', position: 'left' },
      {
        href: `https://github.com/${this.githubUser}/${this.githubRepo}`,
        position: 'right',
        className: 'header-github-link',
        'aria-label': 'GitHub repository',
      },
    ];
  },
  get footerLinks() {
    return [
      {
        items: [{
          html: `<img src="${this.baseUrl}${this.footerLogoUrl}" style="height: 60px; position: relative; top: 20px;" />`,
        }],
      },
      {
        title: 'This Site',
        items: [
          {
            label: 'Tutorials',
            to: '/docs/tutorials',
          },
          {
            label: 'API',
            to: '/docs/api',
          },
          {
            label: 'Blog',
            to: '/blog',
          },
          {
            label: 'GitHub',
            href: `https://github.com/${this.githubUser}/${this.githubRepo}`,
          },
        ],
      },
      {
        title: 'Momentum Design',
        items: [
          {
            label: 'System',
            href: 'https://momentum.design/system',
          },
          {
            label: 'Token',
            href: 'https://momentum.design/tokens',
          },
          {
            label: 'Icons',
            href: 'https://momentum.design/icons',
          },
        ],
      },
      {
        title: 'More',
        items: [
          {
            label: 'Chart.js',
            href: 'https://www.chartjs.org/',
          },
          {
            label: 'MDX',
            href: 'https://mdxjs.com/',
          }
        ],
      },
    ];
  },
  get externalStylesheets() {
    return [`${this.baseUrl}dist-lib/widgets.css`];
  },
  get externalScripts() {
    return [`${this.baseUrl}dist-lib/widgets.umd.js`, `${this.baseUrl}data.js`];
  }
};
