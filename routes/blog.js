"use strict"

import express from 'express'
import jwt from 'express-jwt'
import config from '../config/jwt.json'
import {BlogPosts} from '../src/db.js'
import {findUser} from './utils.js'
import Rx from 'rx'

const router = module.exports = express.Router()

var jwtCheck = jwt({
  secret: config.secret
});

function parsePost(req){
	const body = req.body.body
	const date = req.body.date
	return {
		body: body,
		date: date
	}
}

router.use('/blog/protected', jwtCheck);
//Fetch the user from db
router.use('/blog/protected', (req, res, next) => {
	if(!req.body.username){
		return res.status(400).send("Please enter username")
	}
	findUser(req)
		.then(d => {
			let user = d.dataValues
			req.user = user
			next()
		})
})

router.post('/blog/protected/addPost', (req, res) => {
	const user = req.user
	const post = parsePost(req)
	BlogPosts.create({body: post.body, date: post.body, uid: user.id})
		.then((d) => {
			if(d){
				res.status(201).send("Post added")	
			}else{
				res.status(400).send("Something went wrong")
			}
		})
})

router.get('/blog/:username', (req, res) => {
	req.body.username = req.params.username
	Rx.Observable.fromPromise(findUser(req))
		.flatMap(user => {
			return Rx.Observable.fromPromise(BlogPosts.findAll({
				where: {
					uid: user.id
				}
			}))
		})
		.subscribe(posts => {
			res.status(200).send(posts)
		})
		
})

