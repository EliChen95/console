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

type UserCreateParams = UserFormValues & {
  apiVersion: 'iam.kubesphere.io/v1alpha2';
  kind: 'User';
  metadata: {
    annotations: {
      'iam.kubesphere.io/uninitialized': 'true';
      // 'kubesphere.io/creator': string;
    };
  };
};

export type { UserFormValues, UserCreateParams };
