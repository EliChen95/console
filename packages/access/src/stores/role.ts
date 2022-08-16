const moduleName = 'globalroles';

interface GetPathOptions {
  cluster?: string;
  workspace?: string;
  namespace?: string;
  devops?: string;
}

function getPath(options?: GetPathOptions) {
  const cluster = options?.cluster;
  const workspace = options?.workspace;
  const namespace = options?.namespace;
  const devops = options?.devops;

  let path = '';

  if (cluster) {
    path += `/klusters/${cluster}`;
  }

  if (namespace) {
    return `${path}/namespaces/${namespace}`;
  }

  if (devops) {
    return `${path}/devops/${devops}`;
  }

  if (workspace) {
    return `/workspaces/${workspace}`;
  }

  return path;
}

export function getResourceUrl(params?: GetPathOptions) {
  return `kapis/iam.kubesphere.io/v1alpha2${getPath(params)}/${moduleName}`;
}
