import React, { Component } from 'react';

class LeaguesList extends Component{

  render() {
      return <div key={this.props.league_key}>
        <a 
          href="" 
          onClick={e => {
            e.preventDefault() 
            this.props.onClick(this.props.league_key)
          }}
        >
          {this.props.name}
        </a>
      </div>
  };
}

export default LeaguesList;