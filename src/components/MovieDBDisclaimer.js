import React from 'react';

// Utils and CSS
import TMDBLogo from '../assets/icon-TMDB.png';

const Disclaimer = (props) => {
  return (
    <div className="modal fade" id="gd-mdb-disclaimer-modal" tabIndex="-1" role="dialog" aria-labelledby="gd-mdb-disclaimer-title" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-warning" id="gd-mdb-disclaimer-title">TMDb Disclaimer</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>This product uses the The Movie Database API, but is not endorsed or certified by The Movie Database (TMDb) organization. My gratitude goes out to TMDb team for providing this API ... you have my respect and support!</p>
            <p>Source code for this web app can be found at <a
              href="https://github.com/openXapps/web-apps-moviedb/"
              target="_blank"
              rel="noopener noreferrer"
              >GitHub</a></p>
          </div>
          <div className="modal-footer">
            <a
              className="mr-auto"
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
            ><img className="gd-mdb-img-tmdb-logo" src={TMDBLogo} alt="TMDB Logo"></img></a>
            <button type="button" className="btn btn-outline-warning" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Disclaimer;