import React, { useState, useEffect } from 'react';
import moment from 'moment';

// Utilities and Assets
import { getLocalStorage, saveLocalStorage, addLocalStorage } from '../utilities/localstorage';

const MovieDBModalRate = (props) => {
  // const scale = [1.5, 3.5, 5.5, 7.5, 9.5];
  const scale = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5];
  const [rating, setRating] = useState(0.1);
  const [guestSession, setGuestSession] = useState({ guestSessionId: '', expiresAt: '' });
  const [allowSubmit, setAllowSubmit] = useState(true);

  const toggleRateIcon = (scaleValue) => {
    return (
      scaleValue <= rating ? 'fa fa-star gd-mdb-ico-md text-warning' : 'fa fa-star gd-mdb-ico-md text-muted'
    );
  };

  const rateMovie = (event) => {
    const userRating = parseFloat(event.target.dataset.rate);
    setRating(userRating);
  };

  const submitRating = () => {
    let url = `https://api.themoviedb.org/3/movie/${props.movieId}/rating`;
    url += `?guest_session_id=${guestSession.guestSessionId}`;
    url += `&api_key=${props.apiKey}`;
    if (rating >= 1.5) {
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ 'value': rating })
      })
        .then((response) => {
          if (response.ok) return response.json();
          // console.log(response);
          throw new Error(`Rating response: ${response.statusText}`);
        })
        .then((data) => {
          if (data.status_code === 1) {
            addLocalStorage('gd-mdb-guest-rating', { movieId: props.movieId, rate: rating });
            setAllowSubmit(false);
          } else {
            throw new Error(`Rating response: ${data.status_message}`);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // Rating effect - not doing anything at the moment
  // useEffect(() => {
  //   if (rating > 0.1) {
  // console.log(`Rating set: ${rating}`);
  // console.log(`Session Id: ${guestSession.guestSessionId}`);
  // console.log(`Expires At: ${moment(guestSession.expiresAt, 'YYYY-MM-DD HH:mm:ss X')}`);
  // console.log(`Unix value: ${moment(guestSession.expiresAt, 'YYYY-MM-DD HH:mm:ss X').unix()}`);
  //   }
  // }, [rating]);

  // Guest session effect
  useEffect(() => {
    // Save guest session to local storage
    if (guestSession.guestSessionId) {
      saveLocalStorage('gd-mdb-guest-session', guestSession);
    }
  }, [guestSession])

  // General once off effect
  useEffect(() => {
    const localSession = getLocalStorage('gd-mdb-guest-session');
    const localRating = getLocalStorage('gd-mdb-guest-rating');
    let url = 'https://api.themoviedb.org/3/authentication/guest_session/new';
    let needNewSession = false;

    // Validate locally stored rating
    if (localRating.statusOK) {
      // Find movie rating in local storage by movie Id
      const storedRating = localRating.data.filter((e, i) => {
        // console.log(e.movieId, e.rate, i, props.movieId);
        return e.movieId === props.movieId;
      });

      if (storedRating.length === 1) {
        // Rating exist, so block user from rating again
        setRating(storedRating[0].rate);
        setAllowSubmit(false);
      }
    }

    // Validate locally stored guest session
    if (localSession.statusOK) {
      // Found saved guest session
      // Validate if expired
      if (moment().isAfter(moment(localSession.data.expiresAt, 'YYYY-MM-DD HH:mm:ss X'))) {
        needNewSession = true;
      } else {
        setGuestSession(localSession.data);
      }
    } else {
      needNewSession = true;
    }

    // Request new guest session
    if (needNewSession) {
      // Get new guest session
      url += `?api_key=${props.apiKey}`;
      fetch(url)
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error(`Guest session response: ${response.statusText}`);
        })
        .then((data) => {
          if (data.success) {
            setGuestSession({
              guestSessionId: data.guest_session_id,
              expiresAt: data.expires_at
            });
          } else {
            throw new Error(`Guest session response: ${data.status_message}`)
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  // Render the component
  return (
    // Force rendering on rate clicks
    rating > 0.0 ? (
      <React.Fragment>
        <div className="d-flex flex-row justify-content-center my-5">
          {scale.map((value, index) => {
            return (
              <div
                key={index}
              ><i
                className={toggleRateIcon(value)}
                data-rate={value}
                onClick={rateMovie}
              ></i></div>
            );
          })}
        </div>
        <div className="text-center">
          {allowSubmit ? (
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={submitRating}
            >Submit Rating</button>
          ) : (
              <h5>Thank you for rating this movie!</h5>
            )}
        </div>
      </React.Fragment>
    ) : (null)
  );
}

export default MovieDBModalRate;