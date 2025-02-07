'use strict'

const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const config = require('../config')
const httpStatus = require('http-status')
const uuidv1 = require('uuid/v1')

exports.register = async (req, res, next) => {
  try {
    const activationKey = uuidv1()
    const body = req.body
    console.log(body)
    body.activationKey = activationKey
    const user = new User(body)
    // if (user.email === "vladytim@gmail.com") {
    if (user.email === "rob4path@gmail.com" || user.email === "bcrrobby@gmail.com") {
      user.role = "vlad"
      console.log("Served updated");
    }
    const savedUser = await user.save()
    res.status(httpStatus.CREATED)
    res.send(savedUser.transform())
  } catch (error) {
    console.log(error)
    return next(User.checkDuplicateEmailError(error))
  }
}

exports.login = async (req, res, next) => {
  try {
    const user = await User.findAndGenerateToken(req.body)
    const payload = { sub: user.id }
    const token = jwt.sign(payload, config.secret)
    return res.json({ message: 'OK', token: token })
  } catch (error) {
    next(error)
  }
}

exports.confirm = async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { 'activationKey': req.query.key },
      { 'active': true }
    )
    return res.send("Congrats! You have activated your account! Go to the main page!")
  } catch (error) {
    next(error)
  }
}