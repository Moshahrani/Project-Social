const baseUrl = process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://project-socialmedia.herokuapp.com";

module.exports = baseUrl;
