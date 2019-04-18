import React, { useState, useEffect } from 'react'

// This functional component uses hooks

const MovieDBModalCast = (props) => {
  const [cast, setCast] = useState([])

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${props.movieId}/credits?api_key=${props.apiKey}`;
    fetch(url)
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Problem fetching movie credits.');
      })
      .then(data => {
        setCast(data.cast.slice(0, 15));
        // console.log(data.cast[0]);
      })
      .catch(error => {
        console.log(error.message);
      });
  }, []);

  // console.log(cast);
  return (
    <React.Fragment>
      {cast.map((member, index) => {
        return (
          <button
            key={index}
            className="btn btn-secondary btn-sm btn-block text-left text-truncate"
            data-id={member.id}
            data-name={member.name}
            type="button"
            onClick={props.handleCast}
          >{member.name} * <span className="text-warning">{member.character}</span></button>
        );
      })}
    </React.Fragment>
  );
}

export default MovieDBModalCast;