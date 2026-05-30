import type { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span>MiniStack UI</span>,
  project: {
    link: 'https://github.com/ministack-ui/ministack-ui',
  },
  docsRepositoryBase: 'https://github.com/ministack-ui/ministack-ui/tree/main/apps/docs',
  footer: {
    text: 'MiniStack UI — Open-source local debugging for AWS-compatible stacks',
  },
};

export default config;
