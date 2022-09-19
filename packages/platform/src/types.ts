export type LabelValue = { label: string; value: string };

export type NavItem = {
  name: string;
  icon?: string;
  title?: string;
  authKey: string;
  tabs?: NavItem[];
  children?: NavItem[];
  [key: string]: any;
};

export type ListItem = {
  title: string;
  details?: any;
  description?: string;
  titleClass?: string;
  operations?: any;
};
