const express = require("express")
const tweetRouter = express.Router()
const db = require("../db/models")
const {Tweet} = db;

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

tweetRouter.post("/tweets")


module.exports = {
    tweetRouter
}