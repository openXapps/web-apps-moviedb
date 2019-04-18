import React from 'react';

const MovieDBPager = (props) => {
  const currentPage = props.pages.page + 1;
  const totalPages = props.pages.of;
  // console.log(`page ${currentPage} of ${totalPages}`);
  return (
    <React.Fragment>
      <div className="container mb-5">
        <button
          className="btn btn-outline-warning btn-block text-center"
          type="button"
          onClick={props.handleNextPage}
        >Show page {currentPage} of {totalPages}</button>
      </div>
    </React.Fragment>
  );
}

export default MovieDBPager;