"use strict"

import express from 'express'
import jwt from 'jsonwebtoken'
import {Users} from '../src/db.js'
import _ from 'lodash'
import config from '../config/jwt.json'

const router = module.exports = express.Router()

function createToken(user){
	return jwt.sign(_.omit(user, 'password'), config.secret, {expriesIn: 60*60*5})
}

function getUser(req){

	var userName;
	var type;

	if(req.body.username){
		userName = req.body.username
	}

	return {
		userName: userName
	}

}

function checkIfUserExists(reqUser){
	return Users.findOne({
		where: {
			userName: reqUser.userName
		}
	})
}

router.post('/addUser', (req, res) => {

})

router.post('/sessions/create', function(req, res, next) {

	const reqUser = getUser(req)	
	console.log(reqUser);

	if(!reqUser.userName || !req.body.password) {
		return res.status(400).send("Please enter both username and password.")
	}

	checkIfUserExists(reqUser).then(data => {
		let user
		if(data){
			user = data.dataValues			
		}else{
			return res.status(401).send("Usename or password dont match")
		}
		console.log(user)

		if(user.password !== req.body.password) {
			return res.status(401).send("Usename or password dont match")
		}

		res.status(201).send({
			id_token: createToken(user)
			
		})
	})
});

module.exports = router;
