import { Button } from '@kubed/components';
import styled from 'styled-components';

export const TableActionButton = styled(Button)`
  min-width: 96px;
  margin-left: 12px;
`;

export const BatchActionButton = styled(Button)`
  min-width: 96px;
  & + button {
    margin-left: 12px;
  }
`;
