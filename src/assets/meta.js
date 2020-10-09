const meta = () => {
    return (
        {
            tmdb: process.env.REACT_APP_TMDB,
            imdb: process.env.REACT_APP_IMDB
        }
    );
}

module.exports.meta = meta;