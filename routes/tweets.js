const express = require("express")
const tweetRouter = express.Router()
const db = require("../db/models")
const {Tweet} = db;
const { check, validationResult } = require('express-validator');
const validateTweet = [
    check("message")
    .exists({checkFalsy: true})
    .withMessage("Tweet must have message")
    .isLength({max:280})
    .withMessage("Tweet must not exceed 280 characters")
  ]

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

tweetRouter.post("/", validateTweet,handleValidationErrors, asyncHandler(async(req,res) => {
   console.log(req.body.message)
    const message  = req.body.message;
    const tweet = await Tweet.create({
      'message':message
    })
    res.json({tweet})
}))

tweetRouter.put("/:id",validateTweet,handleValidationErrors,asyncHandler(async(req,res,next) => {
    const tweet = await Tweet.findByPk(req.params.id);
    if (tweet === null) {
        const error = tweetNotFoundError(req.params.id)
        next(error)
    } else {
        const message = req.body.message
        const updatedTweet = await tweet.update({"message":message})
        res.json({updatedTweet})
        
    }
}))

tweetRouter.delete("/:id",handleValidationErrors,asyncHandler(async(req,res,next) => {
    const tweet = await Tweet.findByPk(req.params.id)
    console.log(tweet)
    if (tweet === null) {
        const error = tweetNotFoundError(req.params.id)
        next(error)
    } else {
        const deletedTweet = await tweet.destroy()
        res.json({tweet})
    }  
    
    
}))

module.exports = {
    tweetRouter
}
