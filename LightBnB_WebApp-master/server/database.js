const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`SELECT id, name, email, password
    FROM users
    WHERE users.email = $1;
  `, [`${email}`])
  .then(res => {
    if (!res.rows[0]) return null
    return res.rows[0]})
  .catch(err => console.error('query error', err.stack));
  
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`SELECT id, name, email, password
    FROM users
    WHERE users.id = $1;
  `, [`${id}`])
  .then(res => {
    if (!res.rows[0]) return null
    return res.rows[0]})
  .catch(err => console.error('query error', err.stack));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {

  return pool.query(`INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [`${user.name}`, `${user.email}`, `${user.password}`])
  .then(res => {
    return res.rows[0]})
  .catch(err => console.error('query error', err.stack));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`SELECT reservations.*, properties.*, avg(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY start_date
  LIMIT $2;`, [`${guest_id}`, limit])
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  let values = [limit];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON property_id = properties.id`

  if (options.city || options.owner_id || options.minimum_price_per_night || options.maximum_price_per_night) {
    queryString += `
    WHERE `;
  }

  if (options.city) {
    values.push(`${options.city}`)
    queryString += `city LIKE $${values.length}`;
  }

  if (options.city && options.owner_id) {
    queryString += ` AND `;
  }

  if (options.owner_id) {
    values.push(`${options.owner_id}`)
    queryString += `owner_id LIKE $${values.length}`;
  }

  if ((options.city || options.owner_id) && options.minimum_price_per_night) {
    queryString += ` AND `;
  }

  if (options.minimum_price_per_night) {
    values.push(`${options.minimum_price_per_night}`)
    queryString += `cost_per_night >= $${values.length}`;
  }

  if ((options.city || options.owner_id || options.minimum_price_per_night) && options.maximum_price_per_night) {
    queryString += ` AND `;
  }

  if (options.maximum_price_per_night) {
    values.push(`${options.maximum_price_per_night}`)
    queryString += `cost_per_night <= $${values.length}`;
  }

  queryString += `
  GROUP BY properties.id`;

  if (options.minimum_rating) {
    values.push(`${options.minimum_rating}`)
    queryString += `
    HAVING avg(property_reviews.rating) >= $${values.length}`;
  }
  
  queryString += `
    ORDER BY cost_per_night
    LIMIT $1;`;
  
  return pool.query(queryString, values)
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
