const express = require("express")
const tweetRouter = express.Router()
const db = require("../db/models")
const {Tweet} = db;
const { check, validationResult } = require('express-validator');
const tweet = require("../db/models/tweet");
const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => error.msg);
        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        return next(err)
    }
    next();
  }

const asyncHandler = (handler) => (req,res,next) => handler(req,res,next).catch(next)

const tweetNotFoundError = (id) => {
    const err = new Error(`Cannot find tweet with id of ${id}`)
    err.status = 404;
    return err
}
tweetRouter.get("/",asyncHandler(async (req,res) => {
    const tweets = await Tweet.findAll()
    res.json({tweets})
}))

tweetRouter.get("/:id", asyncHandler(async (req,res,next) => {
    const tweet = await Tweet.findByPk(req.params.id)
    console.log(tweet)
    if (tweet === null) {
        const error = tweetNotFoundError(req.params.id)
        next(error)
    } else {
        res.json({tweet})
    }

}))

tweetRouter.post("/tweets", handleValidationErrors, asyncHandler(async(req,res) => {
   const { message } = req.body.message;
   check('message').islength({ max: 280 });
    const tweet = await Tweet.create({
      message
    })
    res.json({tweet})
}))



module.exports = {
    tweetRouter
}
