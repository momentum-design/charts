module.exports = {
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
  docMenuLabel: 'Docs',
  get menus() {
    return [
      {
        type: 'docSidebar',
        sidebarId: 'tutorialSidebar',
        position: 'left',
        label: this.docMenuLabel,
      },
      { href: '/api/index.html', label: 'API', position: 'left', prependBaseUrlToHref: true },
      { to: '/blog', label: 'Blog', position: 'left' },
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
            label: this.docMenuLabel,
            to: '/docs/getting-started',
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
};
