import styled from 'styled-components';

export const CssContainer = styled.div`
  .mb-12 {
    margin-bottom: 12px;
  }

  .gap {
    margin-right: 12px;
  }

  .title {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .content {
    padding: 12px;
    margin-bottom: 12px;
    background-color: ${({ theme }) => theme.palette.accents_0};
    border-radius: 4px;
  }

  .horizon {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .form-item-wrapper {
      flex: none;
      margin-bottom: 0;
    }
  }

  .footer-btn {
    padding-top: 12px;
    text-align: right;
  }

  .loading {
    margin-left: 50%;
    transform: 'translateX(-50%)';
  }

  .items {
    padding: 12px;
    border: solid 1px ${({ theme }) => theme.palette.accents_2};
    border-radius: 4px;
    background: white;

    .field-avatar {
      margin-top: -16px;
    }
  }
`;
