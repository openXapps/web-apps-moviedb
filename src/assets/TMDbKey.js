/**
 * Use your own key in .env.local
 */
const myKey = () => {
    return process.env.REACT_APP_API_KEY;
}

module.exports.myKey = myKey;