export type BaseTemplateParam = {
  name: string;
};

export type ReceiverTemplateParam = BaseTemplateParam & { type: string };

export type BaseTemplate = {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
  };
  spec?: Record<string, unknown>;
  type?: string;
};
