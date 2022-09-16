type OriginalWorkspace = {
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

type FormattedWorkspace = {
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

interface WorkspaceFormValues {
  metadata: {
    name: string;
    annotations: {
      'kubesphere.io/alias-name'?: string;
      'kubesphere.io/description'?: string;
      'kubesphere.io/creator'?: string;
    };
  };
  spec: {
    template: {
      spec: {
        manager: string;
      };
    };
    placement?: {
      cluster: string;
    };
  };
}

interface WorkspacesActionValues extends WorkspaceFormValues {
  apiVersion: 'iam.kubesphere.io/v1alpha2';
  kind: 'Workspaces';
}

type WorkspacesCreateParams = WorkspacesActionValues;

type WorkspacesEditParams = WorkspacesActionValues;

export {
  OriginalWorkspace,
  FormattedWorkspace,
  WorkspaceFormValues,
  WorkspacesActionValues,
  WorkspacesCreateParams,
  WorkspacesEditParams,
};
