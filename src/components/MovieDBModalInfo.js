import React, { useState } from 'react'

// Sub-components
// import MovieDBLoader from './MovieDBLoader'

// Utilities and Assets
import { buildFileName } from '../utilities/swissknife';

const MovieDBModalInfo = (props) => {
  const [hideOther, setHideOther] = useState(true);
  const [tor, setTor] = useState([])
  const colLeft = 'col-3 col-sm-3 col-md-3';
  const colRight = 'col-9 col-sm-9 col-md-9';
  const movie = props.movie;
  const fileName = buildFileName(movie.title, movie.release_date);

  const getTor = () => {
    // https://yts.lt/api
    const url = `https://yts.lt/api/v2/list_movies.json?&query_term=${movie.imdb_id}`;
    fetch(url, {
      // mode: 'cors',
      // credentials: 'include',
      // headers: {
      //   "Content-Type": "application/json",
      //   "Accept": "application/json"
      // }
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Problem fetching movie list.');
      })
      .then((data) => {
        // console.dir(data);
        // console.log(data.data.movie_count);
        if (data.data.movie_count > 0) {
          // console.dir(data.data.movies[0]);
          setTor(data.data.movies[0].torrents);
        }
        // console.log(`torrents: ${tor}`);
        setHideOther(false);
      }).catch((error) => {
        console.log('YTS error: ', error.message);
        // console.log(`URL: ${url}`);
        setTor([]);
        setHideOther(false);
      });
  };

  return (
    <>
      <div className="row">
        <div className={colLeft}><p>Genre:</p></div>
        <div className={colRight}>
          {movie.genres.length > 0 ? (
            <p className="text-primary">{movie.genres.map((v, i) => {
              return ((i + 1) < movie.genres.length) ? `${v.name}, ` : v.name;
            })}</p>
          ) : (
              <p className="text-primary">No data available</p>
            )}
        </div>
      </div>
      <div className="row">
        <div className={colLeft}><p>Released:</p></div>
        <div className={colRight}><p className="text-primary">{movie.release_date}</p></div>
      </div>
      <div className="row">
        <div className={colLeft}><p>Rating:</p></div>
        <div className={colRight}>
          <p className="text-primary">{movie.vote_average} ({movie.vote_count} votes)</p>
        </div>
      </div>
      <div className="row">
        <div className={colLeft}><p>Open In:</p></div>
        <div className={colRight}>
          <a
            className="btn btn-outline-primary btn-sm mr-2"
            role="button"
            href={`https://www.imdb.com/title/${movie.imdb_id}/`}
            target="_blank"
            rel="noopener noreferrer"
          >IMDb</a>
          <a
            className="btn btn-outline-primary btn-sm mr-2"
            role="button"
            href={`https://www.youtube.com/results?search_query=${encodeURI(fileName)} trailer`}
            target="_blank"
            rel="noopener noreferrer"
          >You Tube</a>
          <a
            className="btn btn-outline-primary btn-sm mr-2"
            role="button"
            href={`https://www.themoviedb.org/movie/${movie.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >TMDb</a>
        </div>
      </div>
      <div className="row mt-2">
        <div className={colLeft}>
          <p>Story:</p>
          <div
            className="gd-mdb-hidden"
            onClick={getTor}
          >OOOOOOOOOO</div>
        </div>
        <div className={colRight}><p className="text-primary">{movie.overview}</p></div>
      </div>
      {/* <div className="row">
        <div className={colLeft}><p>File Name:</p></div>
        <div className={colRight}><p className="text-primary">{fileName}</p></div>
      </div> */}
      {hideOther ? (
        null
      )
        : (tor.length > 0 ? (
          <ul className="list-group text-center">
            {tor.map((t, i) => {
              return (
                <a
                  key={i}
                  href={t.url}
                  className="list-group-item list-group-item-action bg-secondary"
                >{`${t.quality} (${t.size} ${t.type})`}</a>
              );
            })}
          </ul>
        ) : (
            <p className="text-muted">No results found</p>
          )
        )}
    </>
  )
}

export default MovieDBModalInfo;






















