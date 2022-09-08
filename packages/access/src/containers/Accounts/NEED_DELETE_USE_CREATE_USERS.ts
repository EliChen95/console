import type { UserCreateParams } from '../../types/user';
import { useUserCreateMutation } from '../../stores/user';

function addLeadingZero(value: number, size: number = 3) {
  let str = value.toString();
  while (str.length < size) {
    str = `0${str}`;
  }

  return str;
}

interface CreateUsersOptions {
  mutate: (params: UserCreateParams) => void;
  count: number;
  start: number;
  namespace?: string;
}

function createUsers({ mutate, count, start, namespace = '' }: CreateUsersOptions) {
  let index = start;

  while (index <= count) {
    const str = addLeadingZero(index);
    const name = namespace.trim() ? `${namespace}-${str}` : str;
    const params = {
      metadata: {
        annotations: {
          'iam.kubesphere.io/uninitialized': 'true',
          'iam.kubesphere.io/globalrole': 'test-role',
          'kubesphere.io/description': `${name} description`,
        },
        name,
      },
      apiVersion: 'iam.kubesphere.io/v1alpha2',
      kind: 'User',
      spec: { email: `${name}@email.com`, password: 'An123456' },
    } as const;

    mutate(params);

    index++;
  }
}

export function useCreateUsers({
  count,
  start,
  namespace = '',
}: Omit<CreateUsersOptions, 'mutate'>) {
  const { mutate } = useUserCreateMutation();

  return {
    mutate: () => createUsers({ mutate, count, start, namespace }),
  };
}
