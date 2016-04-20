"use strict"

import express from 'express'
import jwt from 'express-jwt'
import config from '../config/jwt.json'
import {BlogPosts} from '../src/db.js'
import {findUser, parseReq, addOrUpdateRow} from './utils.js'
import Rx from 'rx'

const router = module.exports = express.Router()

var jwtCheck = jwt({
  secret: config.secret
});


router.use('/blog/protected', jwtCheck);
//Fetch the user from db
// router.use('/blog/protected', (req, res, next) => {
// 	if(!req.body.username){
// 		return res.status(400).send("Please enter username")
// 	}
// 	findUser(req)
// 		.then(d => {
// 			let user = d.dataValues
// 			req.user = user
// 			next()
// 		})
// })

router.post('/blog/protected/removePost', (req, res) => {
	const {user, data} = parseReq(req)
	const {id} = data
	BlogPosts.destroy({where:{
		id: id
	}})
	.then(r => {
		res.status(201).send("Removed post")
	})
})

router.post('/blog/protected/addPost', (req, res) => {
	const {user, data} = parseReq(req)
	const {body, id} = data
	console.log(data)
	let row = {}

	if(id > -1){
		row = {
			body: body,
			uid: user["id"],
			id: id
		}
	}else{
		row = {
			body: body,
			uid: user["id"]
		}
	}

	BlogPosts.upsert(row)
	.then(d => {
		if(d){
			res.status(201).send(d)
		}else{
			console.log(d)
			res.status(400).send(d)
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

