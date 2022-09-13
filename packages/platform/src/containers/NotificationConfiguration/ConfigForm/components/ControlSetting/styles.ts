import styled from 'styled-components';

export const CssContainer = styled.div`
  .wrapper {
    margin-top: 12px;
    padding: 12px;
    border-radius: 4px;
    background: ${({ theme }: any) => theme.palette.accents_0};
  }

  .desc {
    color: ${({ theme }) => theme.palette.accents_5};
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }

  .annotation {
    display: flex;
    flex: 1;
    padding-left: 12px;
    color: ${({ theme }) => theme.palette.accents_7};

    svg {
      margin-top: 4px;
      margin-right: 6px;
      flex-shrink: 0;
    }

    .desc {
      display: inline-flex;
      margin: 0;
    }
  }

  .errorText {
    padding: 3px 68px 3px 17px;
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.67;
    letter-spacing: normal;
    color: ${({ theme }) => theme.palette.colors.red[2]};
  }

  .condition-item {
    display: flex;
    align-items: center;

    .selectWrapper {
      flex: 1;
    }
  }
`;
