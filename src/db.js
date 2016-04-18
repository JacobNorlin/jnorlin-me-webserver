"use strict";

import Sequelize from 'sequelize';
import {cfg} from '../config/db.cfg';


const sequelize = new Sequelize(cfg.database, cfg.user, cfg.password, {
	host: cfg.host,
	dialect: 'mysql',
	pool:{
		max: 5,
		min: 0,
		idle: 10000
	}
})

//MODELS

const Users = sequelize.define('users', {
	userName: {
		type: Sequelize.STRING,
		field: 'username'
	},
	password: {
		type: Sequelize.STRING,
		field: 'pw'
	},
	id: {
		type: Sequelize.INTEGER,
		field: 'id',
		primaryKey: true,
		autoIncrement: true
		}
})

const BlogPosts = sequelize.define('blogposts', {
	body: {
		type: Sequelize.STRING,
		field: 'body'
	},
	date: {
		type: Sequelize.DATE,
		field: 'date'
	},
	id: {
		type: Sequelize.INTEGER,
		field: 'id',
		primaryKey: true,
		autoIncrement: true
	},
	uid: {
		type: Sequelize.INTEGER,
		references: {
			model: Users,
			key: 'id'
		}
	}
});

const Repository = sequelize.define('repository', {
	type: {
		type: Sequelize.STRING,
		field: 'type'
	},
	link: {
		type: Sequelize.STRING,
		field: 'link'
	},
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	uid: {
		type: Sequelize.INTEGER,
		references: {
			model: Users,
			key: 'id'
		}
	},
	body: {
		type: Sequelize.STRING,
		field: 'body'
	}
})



export {sequelize, Users, BlogPosts}