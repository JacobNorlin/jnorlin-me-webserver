"use strict"

import express from 'express'
import {BlogPosts} from '../src/db.js'
import {findUser, parseReq, addOrUpdateRow} from './utils.js'
import Rx from 'rx'

const router = module.exports = express.Router()

const REPO = 'REPO'
const BLOG = 'BLOG'
const types = [REPO, BLOG]

router.get('/search', (req, res) => {
	const {username, id, type, tags, words} = req.query
	searchBlogPromise(tags, words, id)
			.then(r => {
				if(r){
					res.status(200).send(r)
				}else{
					res.status(400).send(r)
				}
			})
})

function searchBlogPromise(tags, words, userid){
	return BlogPosts.findAll({
		where: {
				uid: userid,
		}
	})
}

function containsTags(tags){
	return {
		tags:{
			$like:{
				$any: tags
			}
		}
	}
}

function containsWords(words){
	return {
		$or:{
			title:{
				$like: {
					$any: words
				}
			},
			body:{
				$like: {
					$any: words
				}
			}
		}
	}
}