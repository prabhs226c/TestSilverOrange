import React, { Component } from 'react';
import './main.css';

const SERVER = 'localhost:4000';

const requestHeaders = {
  method: 'GET',
  mode: 'cors',
  cache: 'no-cache',
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'follow',
  referrerPolicy: 'no-referrer',
};

export default class MainPage extends Component {
  state = {
    repos: [],
  };

  componentDidMount() {
    this.getRepos();
  }

  getRepos = async () => {
    const url = `http://${SERVER}/repos`;
    console.log(url);
    const response = await fetch(url, requestHeaders);

    if (response.ok) {
      const repos = await response.json();

      this.setState({
        repos,
      });
    }
  };

  render() {
    return (
      <>
        {this.state.repos.length > 0 ? (
          <table>
            <tr key={0}>
              <th>Name</th>
              <th>Description</th>
              <th>forks count</th>
              <th>Action</th>
            </tr>
            {this.state.repos.map((repo) => {
              return (
                <tr key={repo.id}>
                  <td>{repo.name}</td>
                  <td>{repo.description}</td>
                  <td>{repo.forks_count}</td>
                  <td>View</td>
                </tr>
              );
            })}
          </table>
        ) : (
          <h2>No Repo</h2>
        )}
      </>
    );
  }
}
