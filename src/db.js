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
		type: Sequelize.TEXT,
		field: 'body'
	},
	tags: {
		type: Sequelize.TEXT,
		field: 'tags'
	},
	title: {
		type: Sequelize.TEXT,
		field: 'title'
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
	title: {
		type: Sequelize.STRING,
		field: 'title'
	},
	link: {
		type: Sequelize.STRING,
		field: 'link'
	},
	tags: {
		type: Sequelize.TEXT,
		field: 'tags'
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
	summary: {
		type: Sequelize.TEXT,
		field: 'summary'
	}
})

export function syncDatabase(){
	const cfg = {force: true}
	// Users.sync(cfg)
	BlogPosts.sync(cfg)
	// Repository.sync(cfg)
}



export {sequelize, Users, BlogPosts, Repository}