import express from 'express'
import jwt from 'express-jwt'
import config from '../config/jwt.json'
import {Repository} from '../src/db.js'
import {findUser, parseReq} from './utils.js'
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
	const {type, link, summary, id, title} = data
	console.log(data)

	let row = {}

	if(id > -1){
		row = {
			summary,
			title,
			type,
			link,
			uid: user["id"],
			id: id
		}
	}else{
		row = {
			summary,
			title,
			type,
			link,
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

router.get('/repo/:username', (req, res) => {
	req.body.username = req.params.username
	Rx.Observable.fromPromise(findUser(req))
		.flatMap(user => {
			return Rx.Observable.fromPromise(Repository.findAll({
				where: {
					uid: user.id
				}
			}))
		})
		.subscribe(posts => {
			res.status(200).send(posts)
		})
		
})
