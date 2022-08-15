import type { ReactNode } from 'react';
import type { StatusDotProps } from '@kubed/components';

type BlueAlias = 'draft' | 'pending-review' | 'to-be-reviewed' | 'creating';

type SuccessAlias =
  | 'success'
  | 'succeeded'
  | 'successful'
  | 'ready'
  | 'running'
  | 'jobrunning'
  | 'active'
  | 'normal'
  | 'bound'
  | 'available'
  | 'healthy'
  | 'ok'
  | 'working'
  | 'passed'
  | 'published';

type WarningAlias =
  | 'warning'
  | 'updating'
  | 'upgrading'
  | 'syncing'
  | 'building'
  | 'notrunning'
  | 'waiting'
  | 'terminating'
  | 'released'
  | 'unfinished'
  | 'firing'
  | 'major'
  | 'deleting'
  | 'in-review';

type ErrorAlias =
  | 'error'
  | 'deleting'
  | 'deleted'
  | 'lost'
  | 'unschedulable'
  | 'failed'
  | 'critical'
  | 'rejected';

type DefaultAlias =
  | 'default'
  | 'stopped'
  | 'disabled'
  | 'pending'
  | 'unknown'
  | 'draining'
  | 'terminated'
  | 'completed'
  | 'minor'
  | 'paused'
  | 'inactive'
  | 'suspended';

export interface ColorAlias {
  blue: BlueAlias[];
  success: SuccessAlias[];
  warning: WarningAlias[];
  error: ErrorAlias[];
  default: DefaultAlias[];
}

type LowerCaseType = BlueAlias | SuccessAlias | WarningAlias | ErrorAlias | DefaultAlias;

export interface StatusProps extends Omit<StatusDotProps, 'color'> {
  type?: LowerCaseType | Uppercase<LowerCaseType> | Capitalize<LowerCaseType>;
  color?: Exclude<StatusDotProps['color'], Exclude<keyof ColorAlias, 'blue'>>;
  children?: ReactNode;
}
