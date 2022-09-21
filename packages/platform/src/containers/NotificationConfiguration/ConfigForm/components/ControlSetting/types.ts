export type Condition = {
  key: string;
  operator: string;
  values: string[];
};

export type Color = {
  primary: string;
  secondary: string;
};

export type SeverityLevel = {
  type: string;
  prefixIcon: string;
  color: Color;
  label: string;
  value: string;
};
