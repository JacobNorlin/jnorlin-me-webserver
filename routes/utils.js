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

export function postIdQuery(postId){
	console.log(postId)
	if(postId === 'undefined')
		return "true"
	else
		return "id="+postId
}

export function userQuery(uid){
	switch (uid) {
		case undefined:
			return "true"
		default:
			return "uid="+uid
	}
}

export function tagQuery(tags){
	switch (tags) {
		case undefined:
			return "true"
		default:{
			let ts = tags.split(' ').reduce((acc, t) => {
				return acc+"|"+t
			})
			return "tags REGEXP '"+ts+"'"
		}
	}

}