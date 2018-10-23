const jwt = require('jsonwebtoken');
const { AuthorizationError, noInputError } = require('./../errors/error');

function checkToken(context){
	const token = context.headers.token;
	if(!token){
		throw new AuthorizationError({
			message: `Unauthorized client token..`
		});
	}
	const decoded = jwt.verify(
		token.replace('Bearer ', ''), process.env.JWT);

	return decoded;
}

const getUser_R = (context, connectorQuery) => {
	return connectorQuery.apply(this, [checkToken(context)]);
};


const checkIfUserExists_R = (input, connectorQuery) => {
  if(!input) {
    throw new noInputError({
      message: `Please provide a valid Input!`
  });
}
  return connectorQuery.apply(this, [input]);
};

const loginUser_R = (input, connectorQuery) => {
  if(!input) {
    throw new noInputError({
      message: `Please provide a valid Input!`
  });
}
  return connectorQuery.apply(this, [input]);
};

const addUser_R = (input, connectorQuery) => {
  if(!input) {
    throw new noInputError({
      message: `Please provide a valid Input!`
  });
}
  return connectorQuery.apply(this, [input]);
};

const updateUser_R = (context,input,connectorQuery) => {
  input["id"] = checkToken(context).id;
  return connectorQuery.apply(this, [input]);
};

module.exports = { 
  getUser_R,
  checkIfUserExists_R,
  loginUser_R,
  addUser_R,
  updateUser_R
}