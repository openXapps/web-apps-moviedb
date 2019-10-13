import React, { Component } from 'react';

// Sub-components
import MovieDBModal from './MovieDBModal';

// Utilities and Assets
import { isLocalStorage, getLocalStorage } from '../utilities/localstorage';

// Component starts here
class MovieDBContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLS: false,
      favorites: [{ id: 0, title: '', poster_path: '', release_date: '' }],
      movieId: 0
    };
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleFavoriteToggle = this.handleFavoriteToggle.bind(this);
    this.isFavorite = this.isFavorite.bind(this);
  }

  // Pop open modal component
  handleModalOpen(event) {
    const movieId = parseInt(event.target.dataset.id);
    this.setState({
      movieId: movieId
    });
  }

  // Destroy modal component
  handleModalClose(cast) {
    const backdrop = document.getElementsByClassName('modal-backdrop');
    this.setState({
      movieId: 0
    });
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
    document.body.removeChild(backdrop[0]);
    if (cast.id) this.props.handleCast(cast);
  }

  // Toggle favorite
  handleFavoriteToggle(event) {
    const targetElement = event.target;
    let action = 'ADD';
    // Should we ADD or REMOVE the favorite
    if (targetElement.classList.contains('text-warning')) action = 'REMOVE';
    // Toggle favorite star class
    targetElement.classList.toggle('text-warning');
    targetElement.classList.toggle('text-muted');
    // Call parent handler
    this.props.toggleFavorite(parseInt(targetElement.dataset.id), action);
  }

  // Validate favorites - set button CSS
  isFavorite(movieId) {
    return (
      // Fucken IE can't use Array​.prototype​.findIndex()
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
      // this.state.favorites.findIndex((favorite) => {
      // console.log(movieId.toString(), favorite.id, (movieId === favorite.id));
      // return movieId === favorite.id;
      // }) > -1 ? 'fa fa-heart gd-mdb-ico-md text-warning' : 'fa fa-heart gd-mdb-ico-md text-muted'

      // Workaround is to use Array​.prototype​.some()
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
      this.state.favorites.some((favorite) => {
        return movieId === favorite.id;
      }) ? 'fa fa-heart gd-mdb-ico-md text-warning' : 'fa fa-heart gd-mdb-ico-md text-muted'
    );
  }

  componentDidMount() {
    let favoritesCheck = getLocalStorage('gd-mdb-favorites');
    // Setup favorites
    if (favoritesCheck.statusOK) {
      this.setState({
        isLS: isLocalStorage(),
        favorites: favoritesCheck.data
      });
    } else {
      this.setState({
        isLS: isLocalStorage()
      });
    }
  }

  componentWillUnmount() {
    // console.log('Content component is unmounting...');
  }

  render() {
    // console.log(this.state.favorites);
    return (
      <>
        {this.state.movieId > 0 ? (
          <MovieDBModal
            apiKey={this.props.apiKey}
            movieId={this.state.movieId}
            isLS={this.state.isLS}
            handleClose={this.handleModalClose}
          />
        ) : (null)}

        <div className="container mt-3">
          <div className="row">
            {this.props.movies.map((movie, index) => {
              return (
                <div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card mb-3 text-center">
                    <p className="card-header text-truncate text-white gd-mdb-card-header">{movie.title}</p>
                    <div className="">
                      <img
                        className="mx-auto d-block img-fluid gd-mdb-img-thumbnail"
                        src={"https://image.tmdb.org/t/p/w342" + movie.poster_path}
                        alt={movie.title}
                        data-id={movie.id}
                        onClick={this.handleModalOpen}
                      ></img>
                    </div>
                    <div className="card-footer">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>{movie.release_date}</div>
                        {this.state.isLS ? (
                          <i
                            className={this.isFavorite(movie.id)}
                            data-id={movie.id}
                            onClick={this.handleFavoriteToggle}
                          ></i>
                        ) : (null)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default MovieDBContent;