import React, { Component } from 'react'

// Sub-components

// Utilities and Assets
import { isLocalStorage } from '../utilities/localstorage';

// Generate a 10 year list for
// Top Movies by Year menu
const genYears = () => {
  const today = new Date();
  const year = today.getFullYear() - 1;
  const yearList = [];
  for (let n = 0; n < 20; n++) {
    yearList.push(year - n);
  }
  return yearList;
};

class MovieDBHeader extends Component {
  constructor(props) {
    super(props);
    // State
    this.state = {

    };
    // Handlers
    this.handleLatest = this.handleLatest.bind(this);
    this.handleOnMedia = this.handleOnMedia.bind(this);
    this.handleFavorites = this.handleFavorites.bind(this);
    this.handleTopPerYear = this.handleTopPerYear.bind(this);
    this.handleKeywordSearch = this.handleKeywordSearch.bind(this);
    // Refs
    this.refSearch = React.createRef();
  }

  handleLatest() {
    this.collapseNavBar();
    this.props.getMovies(0, '');
  }

  handleOnMedia() {
    this.collapseNavBar();
    this.props.getMovies(1, '');
  }

  handleFavorites() {
    this.collapseNavBar();
    this.props.getFavorites();
  }

  handleTopPerYear(event) {
    this.collapseNavBar();
    this.props.getMovies(3, event.target.innerText);
  }

  handleKeywordSearch(event) {
    this.collapseNavBar();
    event.preventDefault();
    // https://reactjs.org/docs/refs-and-the-dom.html
    const rawValue = this.refSearch.current.value;
    const trimmedValue = rawValue.trim().slice(0, 30);
    if (trimmedValue) {
      this.props.getMovies(4, trimmedValue);
    }
  }

  handleClearSearch(event) {
    const element = document.getElementById('gd-mdb-search');
    element.value = '';
    element.focus();
  }

  // Tries to toggle the navbar
  collapseNavBar() {
    let elToggler = document.getElementsByClassName('navbar-toggler');
    let elBar = document.getElementById('gd-mdb-navbar');
    if (elBar.classList.contains('show')) {
      elToggler[0].click();
    }
  }

  render() {
    const yearList = genYears();
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2 py-2">
          <a
            className="btn btn-outline-warning mr-md-2"
            href="/"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Go to OpenApps home page"
          ><i className="fa fa-home"></i></a>
          <button
            className="btn btn-outline-success"
            type="button"
            data-toggle="modal"
            data-target="#gd-mdb-disclaimer-modal"
          >Powered by TMDb</button>

          <button
            className="navbar-toggler btn btn-outline-warning"
            type="button"
            data-toggle="collapse"
            data-target="#gd-mdb-navbar"
            aria-controls="gd-mdb-navbar"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="gd-mdb-navbar">
            <div className="navbar-nav ml-auto">
              <button
                className="btn btn-outline-warning mr-lg-2 mr-0 mt-2 mt-lg-0"
                type="button"
                onClick={this.handleLatest}
              >Latest</button>
              <button
                className="btn btn-outline-warning mr-lg-2 mr-0 mt-2 mt-lg-0"
                type="button"
                onClick={this.handleOnMedia}
                data-toggle="tooltip"
                data-placement="bottom"
                title="Latest movies possibly on DVD"
              ><span
                className="mr-2 d-lg-none d-xl-inline-block"
              >On Media</span><i className="fa fa-compact-disc"></i></button>
              {isLocalStorage() ? (
                <button
                  className="btn btn-outline-warning mr-lg-2 mr-0 mt-2 mt-lg-0"
                  type="button"
                  onClick={this.handleFavorites}
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Show my Favorites"
                ><span
                  className="mr-2 d-lg-none d-xl-inline-block"
                >Favorites</span><i className="fa fa-heart"></i></button>
              ) : (null)}
              <div className="dropdown mr-lg-2 mr-0 mt-2 mt-lg-0">
                <button
                  className="btn btn-outline-warning dropdown-toggle"
                  id="gd-mdb-year-menu"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >Top Movies by Year</button>
                <div className="dropdown-menu mt-2" aria-labelledby="gd-mdb-year-menu">
                  {yearList.map((year, index) => {
                    return (
                      <button
                        key={index}
                        className="dropdown-item"
                        type="button"
                        onClick={this.handleTopPerYear}
                      >{year}</button>
                    );
                  })}
                </div>
              </div>
              <form className="form-inline mt-2 mt-lg-0" autoComplete="off" onSubmit={this.handleKeywordSearch}>
                <div className="input-group w-100">
                  <input
                    className="form-control"
                    id="gd-mdb-search"
                    ref={this.refSearch}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-warning"
                      type="button"
                      onClick={this.handleClearSearch}
                    ><i className="fa fa-backspace"></i>
                    </button>
                    <button className="btn btn-outline-warning" type="submit">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </nav>
      </React.Fragment>
    )
  }
}

export default MovieDBHeader;