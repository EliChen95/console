import styled from 'styled-components';

export const CssContainer = styled.div`
  .title {
    margin-bottom: 4px;
  }

  .ml-12 {
    margin-left: 12px;
  }

  .url-input-wrapper {
    max-width: 479px;

    div {
      margin: 0;
    }
  }

  .inputWrapper {
    display: flex;
    align-items: center;

    div {
      flex: 1;
    }
  }

  .list-item {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    margin-bottom: 8px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.palette.accents_0};
    border: solid 1px ${({ theme }) => theme.palette.accents_3};
    transition: all 0.3s ease-in-out;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      border-color: ${({ theme }) => theme.palette.accents_5};
      box-shadow: 0 4px 8px 0 rgba(36, 46, 66, 0.2);

      .buttons {
        display: block;
      }
    }

    .buttons {
      display: none;
    }

    .texts {
      display: flex;
      overflow: hidden;
      flex: 1;
    }

    .text {
      min-width: 160px;
      padding-right: 20px;

      &:first-of-type {
        min-width: 200px;
      }
    }

    .ellipisis {
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
      overflow: hidden;
    }

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

    .button-flat {
      border: 1px solid transparent;
      background-color: transparent;

      &:hover {
        background-color: ${({ theme }) => theme.palette.accents_2};
      }

      &:active {
        background-color: #d8dee5;
      }
    }
  }
`;
