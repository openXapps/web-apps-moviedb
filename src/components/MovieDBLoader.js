import React from 'react';

const MovieDBLoader = () => {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-grow text-warning m-3 gd-mdb-spinner" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default MovieDBLoader;