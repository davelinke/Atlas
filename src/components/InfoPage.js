import React, { Component } from 'react';
import { Link } from 'react-router';

import './InfoPage.css';


class InfoPage extends Component {
  render(){
    return (
      <div className="demo-card-wide mdl-card mdl-shadow--2dp text-center">
        <h2>Info</h2>
        <p>Created to illustrate the whole React-Redux-ReactRouter interaction.</p>
        <p><Link to="/">Go back to Todos</Link></p>
      </div>
    )
  }
}

export default InfoPage;
