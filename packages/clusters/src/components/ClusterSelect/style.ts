import { Alert } from '@kubed/components';
import styled from 'styled-components';
import ClusterTitle from '../ClusterTitle';

export const ClusterSelectWrapper = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.palette.colors.white[0]};
`;

export const ClusterSelectItemWrapper = styled.div`
  display: flex;
  position: relative;
  padding: 12px;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 4px 8px 0 rgba(36, 46, 66, 0.2);
    border-color: ${({ theme }) => theme.palette.accents_5};
  }

  & + .item {
    margin-top: 8px;
  }

  &.disabled {
    opacity: 0.7;
    &:hover {
      box-shadow: none;
      border-color: ${({ theme }) => theme.palette.border};
    }
  }
`;

export const ClusterItem = styled(ClusterTitle)`
  flex: 1;
  overflow: hidden;
  margin-left: 12px;
`;

export const AlertWrapper = styled(Alert)`
  margin-bottom: 12px;
`;
