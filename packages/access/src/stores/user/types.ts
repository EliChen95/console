interface OriginalUser {
  apiVersion?: string;
  kind?: string;
  metadata: {
    name: string;
    uid: string;
    resourceVersion: string;
    generation: number;
    creationTimestamp: string;
    annotations: {
      'iam.kubesphere.io/globalrole'?: string;
      'iam.kubesphere.io/last-password-change-time': string;
      'iam.kubesphere.io/uninitialized': string;
      'kubesphere.io/creator': 'string';
      'kubesphere.io/description'?: string;
    };
    finalizers: string[];

    managedFields: {
      manager: string;
      operation: string;
      apiVersion: string;
      time: string;
      fieldsType: string;
      fieldsV1: {
        'f:metadata': {
          'f:annotations': {
            '.': {};
            'f:iam.kubesphere.io/aggregation-roles': {};
            'f:kubesphere.io/creator': {};
          };
        };
      };
    }[];
  };
  spec: {
    email: string;
  };
  status: {
    state: string;
    lastTransitionTime: string;
  };
}

export type { OriginalUser };
