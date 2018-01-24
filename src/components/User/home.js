import React, { 'Component' } from 'react';

class User extends Component {
  state = {leagues: []}

  componentDidMount(){
    fetch('/leagues')
      .then(res => res.json())
      .then(leagues => this.setState({ leagues }))
  }

  render(){
    return (
        <div>
            <h1>{this.state.name}</h1>
        </div>
    );
  }
}

export default User