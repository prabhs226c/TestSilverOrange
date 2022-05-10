import React, { Component } from 'react';
import ReactModal from 'react-modal';

export default class Modal extends Component {
  state = {
    repo: [],
    commitInfo: [],
  };
  componentDidUpdate() {
    if (
      this.props.selectedRepo.length > 0 &&
      this.state.repo !== this.props.selectedRepo[0]
    ) {
      this.setState({
        repo: this.props.selectedRepo[0],
      });
      this.getCommitInfo(this.state.repo.commits_url);
    }
  }

  getCommitInfo = async (_url) => {
    const url = _url.replace('{/sha}', '');
    const response = await fetch(url);
    if (response.ok) {
      const info = await response.json();
      info.sort((a, b) => {
        return a.commit.author.date < b.commit.author.date;
      });
      this.setState({
        commitInfo: info[0],
      });
    }
  };

  render() {
    return (
      <ReactModal
        ariaHideApp={false}
        shouldCloseOnEsc={true}
        isOpen={this.props.isOpen}
        onRequestClose={() => {
          this.props.onCloseModal();
        }}
      >
        {this.props.selectedRepo.length > 0 && (
          <>
            <h3>
              Name: <span className={'detail'}>{this.state.repo.name}</span>
            </h3>
            <h3>
              Author:{' '}
              <span className={'detail'}>
                {this.state.commitInfo.commit !== undefined
                  ? this.state.commitInfo.commit.author.name
                  : 'N/A'}
              </span>
            </h3>
            <h3>
              Description:{' '}
              <span className={'detail'}>{this.state.repo.description}</span>
            </h3>
            <h3>
              Language:{' '}
              <span className={'detail'}>{this.state.repo.language}</span>
            </h3>
            <h3>
              Last Commit:{' '}
              <span className={'detail'}>
                {this.state.commitInfo.commit !== undefined
                  ? new Date(
                      this.state.commitInfo.commit.author.date
                    ).toLocaleString('en-us')
                  : 'N/A'}
              </span>
            </h3>
            <h3>
              Message:{' '}
              <span className={'detail'}>
                {this.state.commitInfo.commit !== undefined
                  ? this.state.commitInfo.commit.message
                  : 'N/A'}
              </span>
            </h3>
            {this.state.repo.has_wiki ? 'nonono' : 'yeyye'}
          </>
        )}
      </ReactModal>
    );
  }
}
