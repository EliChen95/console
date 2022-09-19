export type LabelValue = { label: string; value: string };

export type NavItem = {
  name: string;
  icon?: string;
  title?: string;
  authKey: string;
  tabs?: NavItem[];
  children?: NavItem[];
  [key: string]: unknown;
};
