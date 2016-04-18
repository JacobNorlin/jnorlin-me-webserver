"use strict"
import {Users} from '../src/db.js'

function findUser(req){
	let userName = req.body.username
	return Users.findOne({
		where: {
			userName: userName
		}
	})
}

export {findUser}