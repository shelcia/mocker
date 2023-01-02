const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/nightOwl");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Mocker Docs",
  tagline: "Documentation of Mocker",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  url: "https://mocker-docs.netlify.app/", // Your website URL
  baseUrl: "/",
  projectName: "Mocker Docs",
  organizationName: "Mocker",
  trailingSlash: false,
  themeConfig: {
    metadata: [
      {
        name: "keywords",
        content: "mocker, documentation",
      },
    ],
    prism: {
      theme: require("prism-react-renderer/themes/nightOwl"),
    },
    navbar: {
      title: "Mocker Docs",
      logo: {
        alt: "Mocker docs Logo",
        src: "img/favicon.ico",
      },
      items: [
        {
          type: "doc",
          docId: "intro",
          position: "left",
          label: "Documentation",
        },
        {
          href: "https://github.com/shelcia/mocker",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Documentation",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/shelcia/mocker",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mocker Docs. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        googleAnalytics: {
          trackingID: "G-E02ZGV8TT4",
          anonymizeIP: true,
        },
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/shelcia/mocker/docs/edit/master",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/shelcia/mocker/docs/edit/master",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;300;400;500;600;700;800;900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,500;1,600;1,700;1,800;1,900&display=swap",
  ],
};
