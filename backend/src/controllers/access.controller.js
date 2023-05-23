'use strict'

const { CREATED, OK, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")
// const accessService = require("../services/access.service")

class AccessController {

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  signUp = async (req, res, next) => {

    new CREATED({
      message: 'Register Ok',
      metadata: await AccessService.signUp(req.body)
    }).send(res)
    //200 ok, 201 created
    // return res.status(201).json(await AccessService.signUp(req.body))

  }

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }

  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'get token success',
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
    }).send(res)
  }

}

module.exports = new AccessController()