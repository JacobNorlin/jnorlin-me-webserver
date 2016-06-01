"use strict"

import express from 'express'
import jwt from 'express-jwt'
import config from '../config/jwt.json'
import {BlogPosts, sequelize} from '../src/db.js'
import {parseReq, addOrUpdateRow, userQuery, tagQuery, postIdQuery} from './utils.js'
import Maybe from 'data.maybe'

const router = module.exports = express.Router()

var jwtCheck = jwt({
	secret: config.secret
});


router.use('/blog/protected', jwtCheck);

function searchBlog(uid, tags, postId){
	let uidCond = userQuery(uid)
	let tagsCond = tagQuery(tags)
	let postIdCond = postIdQuery(postId)
	let q = "SELECT * FROM blogposts WHERE "+uidCond+" and "+tagsCond + " and " + postIdCond;
	return sequelize.query(q)
}


router.get('/blog/search', (req, res) => {
	const {username="", id=0, tags, postId} = req.query
	searchBlog(id, tags, postId)
	.then(r => {
		if(r){
			res.status(200).send(r[0])
		}else{
			res.status(400).send(r)
		}
	})
})


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
	const {body, id, tags, title} = data
	let row = {}

	if(id > -1){
		row = {
			body,
			id,
			tags,
			title,
			uid: user["id"],
		}
	}else{
		row = {
			body,
			tags,
			title,
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

