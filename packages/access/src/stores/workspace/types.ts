export type OriginalWorkspace = {
  kind?: string;
  apiVersion?: string;
  metadata?: {
    name?: string;
    uid?: string;
    resourceVersion?: string;
    generation?: number;
    creationTimestamp?: string;
    annotations?: Record<string, string>;
    finalizers?: string[];
    managedFields: Array<{
      manage: string;
      manager: string;
      operation: string;
      apiVersion: string;
      time: string;
      fieldsType: string;
      fieldsV1: Record<string, unknown>;
    }>;
  };
  spec?: {
    template: {
      metadata: {
        creationTimestamp: string | null;
      };
      spec: {
        manager: string;
      };
    };
    placement: {};
  };
};

export type MappedWorkspace = {
  uid: string;
  name: string;
  creator: string;
  description: string;
  aliasName: string;
  createTime: string;
  resourceVersion: string;
  isFedManaged: boolean;
  annotations: Record<string, string>;
  manager: string;
  clusters: string[];
  networkIsolation: boolean;
  overrides: string[];
  clusterTemplates: Record<string, any>;
  _originData: Record<string, any>;
};
