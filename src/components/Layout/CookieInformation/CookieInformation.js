import React from 'react';
// import './cookieInformation.css';
import Button from '../../UI/Button/Button';
import LangContext from '../../../hoc/context/LangContext';
import { txt } from '../../../shared/dict';

const cookieInformation = (props) => {
  return (
    <LangContext.Consumer>
      {(context) => (
          <div>
          <h2>{txt.COOKIE_TITLE[context.lang]}</h2>
          <br/>
          <p>{txt.COOKIE1[context.lang]}<br/>
          {txt.COOKIE2[context.lang]}<br/>
          </p>
          <Button callClick={props.clickCall}>{txt.OK[context.lang]}</Button>
        </div>
      )}
    </LangContext.Consumer>
  )
};

export default cookieInformation;
