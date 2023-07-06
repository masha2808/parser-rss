const authenticationService = require('../services/authentication-service');
const { authenticationSchema } = require('../schemas/authentication-schema');

const register = async (req, res) => {
  try {
    const data = req.body;
    await authenticationSchema.validateAsync(data);
    await authenticationService.register(data);
    res.status(200).send({
      "message": "Profile created successfully"
    });
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const login = async (req, res) => {
  try {
    const data = req.body;
    await authenticationSchema.validateAsync(data);
    const jwtToken = await authenticationService.login(data);
    res.status(200).send({
      jwtToken
    });
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  register,
  login
};
