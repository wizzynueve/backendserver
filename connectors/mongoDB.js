const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/mongoDB/user');

const _ = require('lodash');
const { noRoleError } = require('./../errors/error');

function checkRoles(input) {
  return User.findOne({ _id: input.myid }).then((res) => {
    if (res > "") {
      if (_.intersectionWith(res.roles, input.expectedRoles, _.isEqual).length >= 1) {
        return { authenticated: true };
      } else return { authenticated: false };
    } else return { authenticated: false };
  });
}

const getUser_C = user => {
  //return User.find({ _id: user.id }, { roles: 1 }); // do not feed password back to query, password stays in database
  return User.find({ _id: user.id }).then((res) => {
    if (res.length > 0) {
      return { name: res[0].name, email: res[0].email, message : "User not found, Please logout and login again." }
    } else {
      return { name: "", email: "", message : "User not found, Please logout and login again." };
    }
  });
};

const checkUserExists_C = input => {
  return User.find({ email: input.email }, { name: 1, email: 1, roles: 1 });
};

const loginUser_C = input => {
  return User.find({ email: input.email, password: input.password }).then((res) => {
    //after successfull login, return JWT token
    // do not feed password back to query, password stays in database
    if (res.length > 0) {
      pswd = jwt.sign(
        { id: res[0].id, email: res[0].email, name: res[0].name },
        process.env.JWT_SECRET,
        { expiresIn: '1y' }
      );
      return { token: pswd, message: "" };
    } else {
      return { token: "", message: "UserID/Password didn't match with records." };
    }
  }
  );
}

const addUser_C = input => {
  input.roles = ["dummy"]; // assign a dummy roles at first time user is created
  let user = new User(input);
  return User.find({ email: input.email }).then((res) => {
    if (res.length > 0) {
      return { name: "", email: "", password: "", message : "User email is already taken." };
    } else {
      user.save();
      return input
    }
  });
}

const updateUser_C = input => {
  // don't let user update his own role, only admin can update roles
  return User.findByIdAndUpdate(input.id, input, function (err, res) {
    if (err) {
      console.log(err);
    }
    if (res) {
      return { name: res.name, email: res.email, message: "Success" };
    } else {
      return { name: "", email: "", message: "Not able to update data." };
    }
  });
};