export type Router = {
  index?: boolean;
  name?: string;
  path?: string;
  children?: Array<Router>;
  element?: any;
};

export type LabelValue = { label: string; value: string };

export type NavItem = {
  name: string;
  icon?: string;
  title?: string;
  authKey: string;
  tabs?: Array<NavItem>;
  children?: Array<NavItem>;
  [key: string]: any;
};

export type ListItem = {
  title: string;
  details?: any;
  description?: string;
  titleClass?: string;
  operations?: any;
};
