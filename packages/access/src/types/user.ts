import { BaseInfo, OriginData } from '@ks-console/shared';

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

interface FormattedUser extends BaseInfo {
  username: string;
  email: string;
  role: string;
  globalrole: string;
  clusterrole: string;
  workspacerole: string;
  roleBind: string;
  groups: any[];
  status: string;
  conditions: any[];
  lastLoginTime: string;
  _originData: OriginData<OriginalUser>;
}

type UserStatusMutationType = 'active' | 'disabled';

interface UserFormValues {
  metadata: {
    name: string;
    annotations: {
      'iam.kubesphere.io/globalrole'?: string;
      'kubesphere.io/description'?: string;
    };
  };
  spec: {
    email: string;
    password?: string;
  };
}

interface UserActionValues extends UserFormValues {
  apiVersion: 'iam.kubesphere.io/v1alpha2';
  kind: 'User';
}

type UserCreateParams = UserActionValues & {
  metadata: {
    annotations: {
      'iam.kubesphere.io/uninitialized': 'true';
    };
  };
};

type UserEditParams = UserActionValues & {
  metadata: {
    resourceVersion: string;
  };
  spec: {
    email: string;
    password?: string;
    lang?: string;
  };
  password?: string;
  lang?: string;
  [key: string]: any;
};

export type {
  OriginalUser,
  FormattedUser,
  UserStatusMutationType,
  UserFormValues,
  UserActionValues,
  UserCreateParams,
  UserEditParams,
};
