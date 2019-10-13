import React, { Component } from 'react';

// Sub-components
import MovieDBDataErr from './MovieDBDataErr';
import MovieDBLoader from './MovieDBLoader';
import MovieDBModalInfo from './MovieDBModalInfo';
import MovieDBModalCast from './MovieDBModalCast';
import MovieDBModalRate from './MovieDBModalRate';

// Utilities and Assets
import { getScrollBarWidth, getScrollBarState } from '../utilities/scrollbar';

class MovieDBDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: {
        title: 'Loading ...'
      },
      isMovieLoading: true,
      dataError: false
    };
    this.handleCast = this.handleCast.bind(this);
  }

  // https://api.themoviedb.org/3/movie/299537?api_key=19a9c9fad8512cbc1824cd036e881463&language=en-US

  getMovieDetails(url) {
    // Load empty modal
    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop');
    backdrop.classList.add('show');
    document.body.appendChild(backdrop);
    document.body.classList.add('modal-open');
    if (getScrollBarState().vScrollBar) {
      document.body.style.paddingRight = getScrollBarWidth().toString() + 'px';
    }
    // Simulate slow network
    setTimeout(() => {
      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Problem fetching movie details.');
        })
        .then((movie) => {
          // console.log(movie);
          this.setState({
            movie: movie,
            isMovieLoading: false,
          });
        }).catch((error) => {
          console.log(error.message);
          console.log('URL: ' + url);
          this.setState({
            isMovieLoading: false,
            dataError: true
          })
        });
    }, 1000);
  }

  // Handle a cast search action
  handleCast(event) {
    // console.log(event.target.dataset);
    const cast = {
      id: event.target.dataset.id,
      name: event.target.dataset.name
    };
    // console.log(cast);
    this.props.handleClose(cast);
  }

  componentDidMount() {
    const url = `https://api.themoviedb.org/3/movie/${this.props.movieId}?&language=en-US&api_key=${this.props.apiKey}`;
    if (this.props.movieId > 0) this.getMovieDetails(encodeURI(url));
  }

  render() {
    const modalStyle = { display: 'block' };
    return (
      <>
        {this.props.movieId > 0 ? (
          <div
            className="modal show gd-mdb-modal-animated gd-mdb-modal-fadeIn"
            style={modalStyle}
            id="gd-mdb-movie-modal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="gd-mdb-movie-modal-label"
            aria-modal="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-title h5 text-warning" id="gd-mdb-movie-modal-label">{this.state.movie.title}</div>
                  <button className="close" type="button" onClick={this.props.handleClose} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <ul className="nav nav-tabs nav-justified">
                    <li className="nav-item">
                      <a className="nav-link active" data-toggle="tab" href="#gd-mdb-tab-info">Movie Info</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-toggle="tab" href="#gd-mdb-tab-cast">Movie Cast</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-toggle="tab" href="#gd-mdb-tab-rate">Rate Movie</a>
                    </li>
                  </ul>

                  <div className="tab-content mt-3">
                    <div className="tab-pane container active" id="gd-mdb-tab-info">
                      {this.state.dataError
                        ? (
                          <MovieDBDataErr />
                        ) : (
                          <>
                            {this.state.isMovieLoading ? (
                              <MovieDBLoader />
                            ) : (
                                <MovieDBModalInfo
                                  movie={this.state.movie}
                                />
                              )}
                          </>
                        )}
                    </div>
                    <div className="tab-pane container fade" id="gd-mdb-tab-cast">
                      <MovieDBModalCast
                        apiKey={this.props.apiKey}
                        movieId={this.props.movieId}
                        handleCast={this.handleCast}
                      />
                    </div>
                    <div className="tab-pane container fade" id="gd-mdb-tab-rate">
                      {this.props.isLS ? (
                        <MovieDBModalRate
                          apiKey={this.props.apiKey}
                          movieId={this.props.movieId}
                        />
                      ) : (
                          <div className="text-center text-muted h5 my-5">
                            Sorry, your browser is too old for rating movies. Please upgrade to a newer browser like Google Chrome!
                        </div>
                        )}
                    </div>
                  </div>

                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-warning btn-block"
                    type="button"
                    onClick={this.props.handleClose}
                  >Close</button>
                </div>
              </div>
            </div>
          </div>
        ) : (null)}
      </>
    );
  }
}

export default MovieDBDetails;