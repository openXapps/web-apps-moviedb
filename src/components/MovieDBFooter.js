import React from 'react';

// Utilities and Assets
import { scrollTop, scrollBottom } from '../utilities/swissknife';

const MovieDBFooter = (props) => {
  return (
    <div className="fixed-bottom bg-secondary gd-mdb-footer">
      <div className="d-flex">
        <div className="flex-grow-1 text-warning text-truncate p-2">{props.filter}</div>
        <div className="">
          <i
            className="fas fa-arrow-circle-down text-warning gd-mdb-ico-lg"
            onClick={scrollBottom}
          ></i>
        </div>
        <div className="">
          <i
            className="fas fa-arrow-circle-up text-warning gd-mdb-ico-lg"
            onClick={scrollTop}
          ></i>
        </div>
      </div>
    </div>
  )
};

export default MovieDBFooter;