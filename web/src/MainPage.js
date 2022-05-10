import React, { Component } from 'react';
import './main.css';
import Modal from './Modal';

const SERVER = '192.168.2.40:4000';

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
    languages: [],
    filter: null,
    isModalOpen: false,
    selectedRepo: [],
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
      repos.sort((a, b) => {
        return a.created_at < b.created_at;
      });

      const languages = [];

      repos.forEach((repo) => {
        if (languages.indexOf(repo.language) === -1) {
          languages.push(repo.language);
        }
      });

      this.setState({
        repos,
        languages,
      });
    }
  };

  filters = () => {
    return (
      <div className={'filterContainer'}>
        <button
          onClick={() => {
            this.filterLanguage(null);
          }}
          key={`filter${0}`}
        >
          All
        </button>
        {this.state.languages.map((language) => {
          return (
            <button
              onClick={() => {
                this.filterLanguage(language);
              }}
              key={`filter${language}`}
            >
              {language}
            </button>
          );
        })}
      </div>
    );
  };

  filterLanguage = (language) => {
    this.setState({
      filter: language,
    });
  };

  handleCloseModalRequest = () => {
    this.setState({ isModalOpen: false });
  };

  handleOpenModalRequest = (repoId) => {
    const selectedRepo = this.state.repos.filter((repo) => {
      return repo.id === repoId;
    });
    this.setState({
      isModalOpen: true,
      selectedRepo,
    });
  };

  render() {
    return (
      <>
        {this.state.languages.length > 0 && this.filters()}
        {this.state.repos.length > 0 ? (
          <table>
            <thead key={0}>
              <th>Name</th>
              <th>Description</th>
              <th>Language</th>
              <th>forks count</th>
              <th>Created at</th>
              <th>Action</th>
            </thead>
            <tbody>
              {this.state.repos.map((repo) => {
                let result = <></>;
                if (
                  this.state.filter === null ||
                  repo.language === this.state.filter
                ) {
                  result = (
                    <tr
                      onClick={() => {
                        this.handleOpenModalRequest(repo.id);
                      }}
                      key={repo.id}
                    >
                      <td>{repo.name}</td>
                      <td>{repo.description}</td>
                      <td>{repo.forks_count}</td>
                      <td>{repo.language}</td>
                      <td>
                        {new Date(repo.created_at).toLocaleDateString('en-us')}
                      </td>
                      <td>View</td>
                    </tr>
                  );
                }
                return result;
              })}
            </tbody>
          </table>
        ) : (
          <h2>No Repo</h2>
        )}
        <Modal
          isOpen={this.state.isModalOpen}
          onCloseModal={this.handleCloseModalRequest}
          selectedRepo={this.state.selectedRepo}
        />
      </>
    );
  }
}
