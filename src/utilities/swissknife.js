/**
 * Utility function to sort an object
 * @param {any} obj Object (Array) to sort
 * @param {any} action Object {sort member, sort direction (asc, desc)}
 * @returns Return a new array list of sorted data
 */
const sortData = (obj, action) => {
  let sortedList = obj.sort((a, b) => {
    if (action.direction === 'asc') {
      return (a[action.key] > b[action.key]) ? 1 : ((a[action.key] < b[action.key]) ? -1 : 0);
    } else {
      return (b[action.key] > a[action.key]) ? 1 : ((b[action.key] < a[action.key]) ? -1 : 0);
    }
  });
  return sortedList;
};

/**
 * Filter junk movies from list
 * @param {array} data Array of data to filter
 * @returns Return a new array list of filtered data
 */
const filterData = (data) => {
  let filteredData = [];
  filteredData = data.filter(item => {

    // Validation filters
    if (item.genre_ids.length < 1) return false;
    if (item.vote_average < 1) return false;
    if (!(item.poster_path)) return false;
    // if (!(v.original_language == 'en')) pass = false;

    return true;
  });
  return filteredData;
};

/**
 * Build a return a formated movie file name
 * @param {string} title Movie name
 * @param {string} date Movie release date
 */
const buildFileName = (title, date) => {
  let fileName = title.replace(/[:\s]|\s{2,}|\./g, ' ');
  fileName = fileName.replace(/\s[&]\s/g, ' and ');
  fileName += ` (${date.slice(0, 4)})`;
  return fileName;
};

/**
 * Scroll screen to top
 */
const scrollTop = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

/**
 * Scroll screen to bottom
 */
const scrollBottom = () => {
  window.scrollTo(0, document.body.scrollHeight);
}

/**
 * Generic function to GET data from a URL
 * @param {string} url API GET string
 * @param {number} delay Number of milliseconds to mimic slow network
 */
const getData = (url, delay) => {
  // Simulate slow network
  setTimeout(() => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          // console.dir(response);
          return response.json();
        }
        throw new Error('Problem fetching data.');
      })
      .then((data) => {
        // console.log(data);
        return data;
      }).catch((error) => {
        console.log(error.message);
        // console.log(`URL: ${url}`);
      });
  }, delay);
}

// Export module functions
module.exports.sortData = sortData;
module.exports.filterData = filterData;
module.exports.buildFileName = buildFileName;
module.exports.scrollTop = scrollTop;
module.exports.scrollBottom = scrollBottom;
module.exports.getData = getData;
