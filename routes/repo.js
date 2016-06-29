import express from 'express'
import jwt from 'express-jwt'
import config from '../config/jwt.json'
import {Repository, sequelize} from '../src/db.js'
import {parseReq, addOrUpdateRow, userQuery, tagQuery, postIdQuery} from './utils.js'
import Rx from 'rx'

const router = module.exports = express.Router()

var jwtCheck = jwt({
  secret: config.secret
});



router.use('/repo/protected', jwtCheck);

router.post('/repo/protected/removeElem', (req, res) => {
	const {user, data} = parseReq(req)
	const {id} = data
	Repository.destroy({where:{
		id: id
	}})
	.then(r => {
		res.status(201).send("Removed post")
	})
})

router.post('/repo/protected/addElem', (req, res) => {
	const {user, data} = parseReq(req)
	const {link, summary, id, title, tags} = data
	console.log(data)
	console.log(id)

	let row = {}

	if(id > -1){
		row = {
			summary,
			title,
			tags,
			link,
			uid: user["id"],
			id: id
		}
	}else{
		row = {
			summary,
			title,
			link,
			tags,
			uid: user["id"]
		}
	}

	Repository.upsert(row)
	.then(d => {
		if(d){
			res.status(201).send(d)
		}else{
			console.log(d)
			res.status(400).send(d)
		}
	})
})

router.get('/repo/search', (req, res) => {
	const {username="", id=0, tags, postId} = req.query
	searchRepo(id, tags)
	.then(r => {
		if(r){
			res.status(200).send(r[0])
		}else{
			res.status(400).send(r)
		}
	})
})

function searchRepo(uid, tags, postId){
	let uidCond = userQuery(uid)
	let tagsCond = tagQuery(tags)
	let q = "SELECT * FROM repositories WHERE "+uidCond+" and "+tagsCond;
	return sequelize.query(q)
}