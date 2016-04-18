"use strict"

import express from 'express'
import jwt from 'jsonwebtoken'
import {Users} from '../src/db.js'
import _ from 'lodash'
import config from '../config/jwt.json'
import {findUser} from './utils.js'

const router = module.exports = express.Router()

function createToken(user){
	return jwt.sign(_.omit(user, 'password'), config.secret, {expriesIn: 60*60*5})
}




router.post('/addUser', (req, res) => {

})

router.post('/sessions/create', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).send("Please enter both username and password.")
	}

	findUser(req)
		.then(user => {
			if(user === null){
				return res.status(401).send("Usename or password dont match")
			}
			if(user.password !== req.body.password) {
				return res.status(401).send("Usename or password dont match")
			}

			res.status(201).send({
				id_token: createToken(user)

			})
			
		})
});

export {router}