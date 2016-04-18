"use strict"

import express from 'express'
import jwt from 'express-jwt'
import config from '../config/jwt.json'
import {Blog} from '../src/db.js'

const router = module.exports = express.Router()

var jwtCheck = jwt({
  secret: config.secret
});

router.use('/blog/protected', jwtCheck);

router.post('/blog/protected/addPost', (req, res) => {
	res.status(200).send("Kek")
	// Blog.create({})
})

