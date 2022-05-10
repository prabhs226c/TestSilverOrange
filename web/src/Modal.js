import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { parse } from 'marked';

export default class Modal extends Component {
  state = {
    repo: [],
    commitInfo: [],
    readmeData: null,
  };
  componentDidUpdate() {
    if (
      this.props.selectedRepo.length > 0 &&
      this.state.repo !== this.props.selectedRepo[0]
    ) {
      this.setState({
        repo: this.props.selectedRepo[0],
      });
      if (this.props.selectedRepo[0].has_wiki) {
        this.getReadmeFile(this.props.selectedRepo[0].full_name);
      } else {
        this.setState({
          readmeData: null,
        });
      }
      this.getCommitInfo(this.state.repo.commits_url);
    }
  }

  getCommitInfo = async (_url) => {
    if (_url !== undefined) {
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

      if (response.status === 400) {
        this.setState({
          commitInfo: [],
        });
      }
    }
  };

  getReadmeFile = async (name) => {
    const url = `https://raw.githubusercontent.com/${name}/master/README.md`;

    const response = await fetch(url);

    if (response.ok) {
      const readmeData = await response.text();
      this.setState({
        readmeData,
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
              {this.state.readmeData !== null && (
                <>
                  <hr />

                  <div
                    dangerouslySetInnerHTML={{
                      __html: parse(this.state.readmeData),
                    }}
                  />
                </>
              )}
            </h3>
          </>
        )}
      </ReactModal>
    );
  }
}
