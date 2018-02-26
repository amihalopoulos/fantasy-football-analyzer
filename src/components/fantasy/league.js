import React, { Component } from 'react';

class LeaguesList extends Component{

  render() {
    console.log(this.props)
      return <div>This is a league component. Add info {this.props.name} </div>
  };
}

export default LeaguesList;