const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Credentials = require('../models/credentials-model');

const DbHelper = require('../helpers/db-helper');

const register = async (data, photo) => {
  await DbHelper.createConnection();

  let credentials = await Credentials.findOne({ where: { email: data.email } });
  if (credentials) {
    await DbHelper.closeConnection();
    throw new Error('Email has been already in use');
  }

  try {
    await Credentials.create({
      email: data.email,
      password: await bcrypt.hash(data.password, 10)
    });
  } catch (error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while creating credentials in database. ${error.message}`)
  }

  await DbHelper.closeConnection();
}

const login = async (data) => {
  await DbHelper.createConnection();

  const credentials = await Credentials.findOne({ where: { email: data.email } });

  if (!credentials) {
    await DbHelper.closeConnection();
    throw new Error('Incorrect email or password.');
  }

  if (!(await bcrypt.compare(data.password, credentials.password))) {
    await DbHelper.closeConnection();
    throw new Error('Incorrect email or password.');
  }

  const token = jwt.sign({
    id: credentials.id,
    email: credentials.email,
  }, 'secret');

  await DbHelper.closeConnection();
  return token;
}

module.exports = {
  register,
  login
};