import styled from 'styled-components';

export const ConditionEditorWrapper = styled.div`
  margin-top: 12px;
  padding: 12px;
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.accents_0};
`;

export const ErrorText = styled.div`
  padding: 3px 68px 3px 17px;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.67;
  letter-spacing: normal;
  color: ${({ theme }) => theme.palette.colors.red[2]};
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

export const Desc = styled.p`
  display: inline-flex;
  margin: 0;
  color: ${({ theme }) => theme.palette.accents_5};
`;

export const Annotation = styled.div`
  display: flex;
  flex: 1;
  padding-left: 12px;
  color: ${({ theme }) => theme.palette.accents_7};

  svg {
    margin-top: 4px;
    margin-right: 6px;
    flex-shrink: 0;
  }
`;

export const ConditionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const SelectWrapper = styled.div`
  margin-right: 16px;
  flex: 1;
  display: flex;
  gap: 16px;
`;
