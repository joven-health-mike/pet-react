import { css } from 'styled-components';

const azure = '#385aa8';
const celestialBlue = '#4891ce';

const buttonStyles = css`
  margin-left: 25px;
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${azure} !important;
  color: whitesmoke;

  &:hover {
    background-color: ${celestialBlue} !important;
  }
`;

const h1Styles = css`
  text-align: center;
  color: ${azure};
`;

const linkStyles = css`
  color: ${azure} !important;
`;

const spanStyles = css`
  align-items: center !important;
  display: flex !important;
  margin-left: 16px;
`;

const inputStyles = css`
  display: block;
  padding: 1px;
  width: 25em !important;
  margin: auto;
  margin-bottom: 20px;
`;

export { buttonStyles, h1Styles, linkStyles, spanStyles, inputStyles };
