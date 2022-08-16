import styled from 'styled-components';
import { Button } from '@kubed/components';

export const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: solid 2px #ffffff;
`;

export const CreateButton = styled(Button)`
  min-width: 96px;
  margin-left: 12px;
`;

export const BatchActionButton = styled(Button)`
  min-width: 96px;

  & + button {
    margin-left: 12px;
  }
`;
