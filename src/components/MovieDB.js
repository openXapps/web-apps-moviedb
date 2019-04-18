import React, { Component } from 'react';
import moment from 'moment';

// Sub-components
import MovieDBDisclaimer from './MovieDBDisclaimer';
import MovieDBHeader from './MovieDBHeader';
import MovieDBContent from './MovieDBContent';
import MovieDBFooter from './MovieDBFooter';
import MovieDBLoader from './MovieDBLoader';
import MovieDBPager from './MovieDBPager';
import MovieDBDataErr from './MovieDBDataErr';
import MovieDBEmpty from './MovieDBEmpty';

// Utilities and Assets
import '../assets/MovieDB.scss';
import { getLocalStorage, addLocalStorage, removeLocalStorage } from '../utilities/localstorage';
import { sortData, filterData, scrollTop } from '../utilities/swissknife';
import { myKey } from '../assets/TMDbKey';
import MovieDBSearchIDs from '../assets/MovieDBSearchIDs';

class MovieDB extends Component {
  constructor() {
    super();
    this.state = {
      isMovieListLoading: true,
      pages: { page: 1, of: 1 },
      currentFilter: MovieDBSearchIDs[0],
      currentURL: '',
      lastKeyword: '',
      dataError: false,
      movies: []
    };
    // Bind local methods for 'this'
    this.getData = this.getData.bind(this);
    this.getMovies = this.getMovies.bind(this);
    this.getFavorites = this.getFavorites.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.getByCast = this.getByCast.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  /**
   * Get data from REST API
   * @param {string} url URL to GET
   * @param {boolean} filter Should I clean-up the result
   * @param {any} sort Should I sort the result
   */
  getData(url, filter, sort) {
    // Simulate slow network
    setTimeout(() => {
      fetch(url)
        .then((response) => {
          if (response.ok) {
            // console.dir(response);
            return response.json();
          }
          throw new Error('Problem fetching movie list.');
        })
        .then((movies) => {
          // console.log(movies);
          // Mock results
          // let processedList = movies;
          // Live results
          let processedList = movies.results;
          if (filter) processedList = filterData(processedList);
          if (sort) processedList = sortData(processedList, sort);
          // console.log(processedList);
          // Live data state
          this.setState({
            isMovieListLoading: false,
            movies: processedList,
            pages: { page: movies.page, of: movies.total_pages }
          });
          // Mock service state
          // this.setState({
          //     isMovieListLoading: false,
          //     currentURL: url,
          //     movies: processedList,
          //     pages: { page: 1, of: 2 }
          // });
        }).catch((error) => {
          console.log(error.message);
          // console.log(`URL: ${url}`);
          this.setState({
            isMovieListLoading: false,
            dataError: true
          })
        });
    }, 500);
  }

  /**
   * Function to help building the REST API URL
   * @param {number} moviesSearchId Which search option is active
   * @param {any} value Optional value to help build API URL
   */
  getMovies(moviesSearchId, value) {
    // let url = 'http://localhost:4000/results'
    let url = 'https://api.themoviedb.org/3';
    let sort = {};
    let trigger = false;
    let lastKeyword = this.state.lastKeyword;
    let currentFilter = MovieDBSearchIDs[moviesSearchId];
    let fromSeconds = 0;
    let toSeconds = 0;

    switch (moviesSearchId) {
      case 0: // Latest
        fromSeconds = (new Date().getTime() / 1000) - (60 * 60 * 24 * 50)
        url += '/discover/movie';
        url += '?include_adult=false&language=en-US&region=US&vote_count.gte=100';
        url += `&release_date.gte=${moment.unix(fromSeconds).format('YYYY-MM-DD')}`;
        sort = { key: 'release_date', direction: 'desc' };
        trigger = true;
        break;
      case 1: // On media
        // 90 days back for 50 days duration
        fromSeconds = (new Date().getTime() / 1000) - (60 * 60 * 24 * 90);
        toSeconds = (60 * 60 * 24 * 50);
        url += '/discover/movie';
        url += '?include_adult=false&language=en-US&region=US&vote_count.gte=10&sort_by=popularity.desc';
        url += `&primary_release_date.gte=${moment.unix(fromSeconds - toSeconds).format('YYYY-MM-DD')}`;
        url += `&primary_release_date.lte=${moment.unix(fromSeconds).format('YYYY-MM-DD')}`;
        trigger = true;
        break;
      case 3: // By year
        url += '/discover/movie';
        url += '?include_adult=false&language=en-US&region=US&vote_count.gte=10&sort_by=popularity.desc';
        url += `&primary_release_year=${value.toString()}`;
        currentFilter = `${currentFilter}${value.toString()}`;
        trigger = true;
        break;
      case 4: // By keyword
        if (lastKeyword.indexOf(value) === -1) {
          url += '/search/movie';
          url += '?include_adult=false&language=en-US&region=US&vote_count.gte=10';
          url += `&query=${value}`;
          currentFilter = `${MovieDBSearchIDs[4]} [${value}]`;
          sort = { key: 'release_date', direction: 'desc' };
          lastKeyword = value;
          trigger = true;
        }
        break;
      case 5: // By cast
        // value passed should be { id: cast_id, name: cast_name }
        url += '/discover/movie';
        url += '?include_adult=false&language=en-US&vote_count.gte=10';
        url += `&with_cast=${value.id}`;
        currentFilter = `${MovieDBSearchIDs[5]} [${value.name}]`;
        sort = { key: 'release_date', direction: 'desc' };
        trigger = true;
        break;
      default:
        break;
    };
    url += `&api_key=${myKey()}`;
    url += `&page=${
      currentFilter.indexOf(this.state.currentFilter) > -1
        ? this.state.pages.page : 1
      }`;
    if (trigger) {
      this.setState({
        isMovieListLoading: true,
        dataError: false,
        currentFilter: currentFilter,
        currentURL: url,
        lastKeyword: lastKeyword
      });
      // console.log(`calling URL: ${encodeURI(url)}`);
      this.getData(encodeURI(url), true, sort);
    }
  }

  // Fetch next page of movies
  getNextPage() {
    let pages = { ...this.state.pages };
    let newURL = this.state.currentURL;
    // console.log(`old url: ${newURL}`);
    if (newURL.indexOf('page=') > -1 && pages.page < pages.of) {
      newURL = newURL.slice(0, newURL.indexOf('page='));
      newURL += `page=${pages.page + 1}`;
      this.setState({
        isMovieListLoading: true,
        currentURL: newURL
      });
      scrollTop();
      this.getData(encodeURI(newURL), true, null);
    }
    // console.log(`new url: ${newURL}`);
  }

  // Fetch movies by cast memeber (actor)
  getByCast(cast) {
    // console.log('Calling getByCast');
    // console.log(cast);
    if (cast.id) this.getMovies(5, cast);
  }

  // Fetch favorites from local storage
  getFavorites() {
    this.setState({
      isMovieListLoading: true,
      currentFilter: MovieDBSearchIDs[2],
      dataError: false,
      currentURL: '',
      pages: { page: 1, of: 1 }
    });
    // Simulate slow device
    setTimeout(() => {
      // Read local storage on browser
      const movies = getLocalStorage('gd-mdb-favorites');
      if (movies.statusOK) {
        this.setState({
          movies: movies.data,
          isMovieListLoading: false
        });
      } else {
        this.setState({
          movies: [],
          isMovieListLoading: false
        });
      }
    }, 500)
  }

  // Toggle favorite on and off
  toggleFavorite(movieId, action) {
    // Local storage target object
    let target = {};
    // Target movie to toggle
    let movie = [{}];
    // Filter through movies array to find target movie
    movie = this.state.movies.filter((item) => {
      // console.log(`Movie ID (${movieId}) === Item ID (${item.id}) : ${movieId === item.id}`);
      return item.id === movieId;
    })
    // console.dir(movie);
    target = {
      id: movie[0].id,
      title: movie[0].title,
      poster_path: movie[0].poster_path,
      release_date: movie[0].release_date
    }
    // Was it an ADD or REMOVE action from the user
    if (action === 'ADD') {
      addLocalStorage('gd-mdb-favorites', target);
    } else {
      removeLocalStorage('gd-mdb-favorites', target);
    }
  }

  // Component life cycle hooks
  componentDidMount() {
    this.getMovies(0, '');
    // this.getFavorites();
  }

  render() {
    const movies = this.state.movies;
    const numOfMovies = movies.length;
    const apiKey = myKey();
    return (
      <React.Fragment>

        <MovieDBHeader
          getMovies={this.getMovies}
          getFavorites={this.getFavorites}
        />

        {this.state.dataError
          ? (
            <MovieDBDataErr />
          ) : (
            this.state.isMovieListLoading
              ? (
                <MovieDBLoader />
              ) : (
                numOfMovies > 0
                  ? (
                    <React.Fragment>
                      <MovieDBContent
                        movies={movies}
                        apiKey={apiKey}
                        toggleFavorite={this.toggleFavorite}
                        handleCast={this.getByCast}
                      />
                      {this.state.pages.of > 1 && this.state.pages.page < this.state.pages.of ? (
                        <MovieDBPager
                          pages={{ ...this.state.pages }}
                          handleNextPage={this.getNextPage}
                        />
                      ) : (<div className="my-5"></div>)}
                    </React.Fragment>
                  ) : (
                    <MovieDBEmpty />
                  )
              )
          )}

        <MovieDBFooter
          filter={this.state.currentFilter}
        />

        <MovieDBDisclaimer />
      </React.Fragment>
    );
  }
}

export default MovieDB;