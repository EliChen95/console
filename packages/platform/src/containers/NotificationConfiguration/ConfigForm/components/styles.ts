import styled from 'styled-components';

export const FooterBtnWrapper = styled.div`
  padding-top: 12px;
  text-align: right;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  div {
    flex: 1;
  }
`;

export const BoxInputWrapper = styled.div`
  .title {
    font-size: 12px;
    line-height: 32px;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    font-weight: bold;
    color: ${({ theme }) => theme.palette.accents_8};
    margin-bottom: 0;
  }
`;

export const UrlInputWrapper = styled.div`
  .url-input-wrapper {
    max-width: 479px;

    div {
      margin: 0;
    }
  }
`;
