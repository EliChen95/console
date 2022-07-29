interface Globals {
  app?: any;
  config?: any;
  installedPlugins?: any;
  context?: any;
  run?: any;
  user?: any;
  manifest?: Record<string, string>;
}

interface Window {
  globals: Globals;
  t: any;
}

declare var t: any;
declare var globals: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare var __ENABLED_PLUGINS__: string[];
