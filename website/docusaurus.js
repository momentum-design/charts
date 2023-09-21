// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const getConfig = (app) => (
  {
    title: app.title,
    tagline: app.tagline,
    favicon: 'img/favicon.ico',
    staticDirectories: ['static', 'dist-lib'],

    // Set the production url of your site here
    url: app.url,
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: app.baseUrl,

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: app.githubUser, // Usually your GitHub org/user name.
    projectName: app.githubRepo, // Usually your repo name.

    onBrokenLinks: 'log',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },

    markdown: {
      mermaid: true,
    },

    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve('./sidebars.js'),
            // Please change this to your repo.
            // Remove this to remove the "edit this page" links.
            editUrl:
              `https://github.com/${app.githubUser}/${app.githubRepo}/tree/main/website/`,
          },
          blog: {
            showReadingTime: true,
            // Please change this to your repo.
            // Remove this to remove the "edit this page" links.
            editUrl:
              `https://github.com/${app.githubUser}/${app.githubRepo}/tree/main/website/`,
          },
          theme: {
            customCss: require.resolve('./src/css/custom.scss'),
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',

        // This would become <meta name="keywords" content="cooking, blog"/> in the generated HTML
        metadata: [{ name: 'keywords', content: 'bendy, bing, blog' }],

        navbar: {
          title: app.name,
          logo: {
            alt: app.title,
            src: app.logoUrl,
          },
          items: app.menus,
        },
        footer: {
          style: 'dark',
          links: app.footerLinks,
          copyright: app.copyright,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
          magicComments: [
            // Remember to extend the default highlight class name as well!
            {
              className: 'theme-code-block-highlighted-line',
              line: 'highlight-next-line',
              block: { start: 'highlight-start', end: 'highlight-end' },
            },
            {
              className: 'code-block-error-line',
              line: 'This will error',
            },
          ],
        },
        imageZoom: {
          // CSS selector to apply the plugin to, defaults to '.markdown img'
          selector: '.markdown img',
        },
      }),

    themes: ['@docusaurus/theme-live-codeblock', '@docusaurus/theme-mermaid'],

    plugins: [
      'plugin-image-zoom',
      'docusaurus-plugin-sass',
      '@cmfcmf/docusaurus-search-local',
    ],

    stylesheets: ['dist-lib/widgets.css'],

    scripts: ['dist-lib/widgets.umd.js'],
  });

module.exports = {
  getConfig,
};
