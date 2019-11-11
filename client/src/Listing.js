import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class Listing extends Component {
    constructor() {
        super();
        this.state = {
            searchQuery: ''
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let copiedState = Object.assign({}, this.state);
        copiedState.searchQuery = event.target[0].value;
        this.props.parentCallback(this.state.searchQuery);
    }

    render() {
        return <div className="jumbotron text-center">
            <img className="App-logo" alt="logo" src="https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png" />
            <p>Search Tweets</p>
            <p>Using Twitter Streaming API</p>
            <div className="jumbotron display-content-center pd0">
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <div className="input-inline">
                        <input
                            type="text"
                            value={this.state.searchQuery}
                            required
                            className="form-control search-input"
                            placeholder="Search for tweet..."
                            size="50"
                            onChange={e => this.setState({ searchQuery: e.target.value })}
                        />
                        <button type="submit" className="btn btn-link">
                            <span className="glyphicon glyphicon-search"></span>
                        </button>
                        <button type="button" className="btn btn-primary">New Tweets
                         <span className="badge">7</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    }
}
export default Listing;