import React from 'react';
import ReactDOM from 'react-dom';
import FeedItems from './components/FeedItems';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 

    }

  }


  render () {
    return (
      <div>
        <FeedItems 
          list=responseFromeAPI
        />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));