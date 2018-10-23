const { createError } = require('apollo-errors');

const AuthorizationError = createError('AuthorizationError', { message: 'You are not authorized.'});
const noInputError = createError('noInputError', { message: 'No valid Input is provided.'});

module.exports = { AuthorizationError, noInputError};