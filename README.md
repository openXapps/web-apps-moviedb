# OpenApps - MovieDb

MovieDb is a pet project, available for anyone to use at their own discretion. I was looking for a simple movie search engine that gives me results quickly and effectively. I couldn't find what I wanted, so I created my own.

The API is powered by [TMDb](https://www.themoviedb.org/).

This web app is hosted at [OpenApps](https://www.openapps.co.za/).

## Search filters

Search filters are located in the top bar. All searches are limited at 20 results per page (API call).

### Latest

Fetches all the latest and most popular movies.

### On Media

Fetches movies that were released a few months back. These movies might be available on Blu-ray at your local stores.

### Favorites

Fetches movies marked as your favorites. MovieDb stores your favorites on your local drive per device. If you use more than one devices, then your favorites will be different between the devices. If you clear your browser data, your favorites are wiped as well.

### Top Movies by Year

Fetches popular movies for the year you select.

### Keyword Search

Fetches movies by keywords you supplied. The result is sorted on release date in descending order.

## Rating a Movie

If you'd like to rate a movie, all you have to do is click on a movie, which will open a movie details modal. In the modal you can access the Rate Movie tab. You can rate a movie only once, so please think about your rating before sending it off to The Movie Db guys. You rating is anonymous and processed through a guest session ID.

## Cloning this project

You are welcome to clone this project and play with the code. Please note that you'll have to supply your own TMDb API key in file:

```
<project>/src/assets/TMDbKey.js
```

## Built With

* [Bootstrap](https://getbootstrap.com/) - Layout and decoration
* [React](https://reactjs.org/docs/create-a-new-react-app.html) - Web framework
* [NPM](https://www.npmjs.com/) - Dependency management
* [TMDb](https://www.themoviedb.org/) - Data provider

## Contributing

TBA...

## Versioning

I use [SemVer](http://semver.org/) for versioning. 

## Authors

* **Gavin Dalton** - *Initial work* - [GitHub](https://github.com/gavin-dalton/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Wish List

* Add TMDb user authentication.
* Add cast member images.
* Add export button for local storage data. Allows to backup your favorites and ratings.
