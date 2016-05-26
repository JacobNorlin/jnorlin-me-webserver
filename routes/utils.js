"use strict"
import {Users} from '../src/db.js'

export function findUser(req){
	let userName = req.body.username
	return Users.findOne({
		where: {
			userName: userName
		}
	})
}

export function parseReq(req){
	let {data, user} = req.body
	data = JSON.parse(data)
	user = JSON.parse(user)
	return {
		data,
		user
	}
}