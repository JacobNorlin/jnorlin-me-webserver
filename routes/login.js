import express from 'express';
import request from 'request';
import {githubOAuth} from '../github.cfg';
var OAuth2 = require('oauth').OAuth2;
var qs = require('querystring');


const  router = express.Router();

console.log(githubOAuth);

var clientID = githubOAuth.clientId;
var clientSecret = githubOAuth.clientSecret;
var oauth2 = new OAuth2(clientID,
	clientSecret,
	'https://github.com/', 
	'login/oauth/authorize',
	'login/oauth/access_token',
	null); /** Custom headers */
/* GET home page. */
router.get('/login', function(req, res, next) {
	var p = req.url.split('/');
	var pLen = p.length;
	console.log(pLen);
	console.log(p[1].indexOf('code'))
	
	var authURL = oauth2.getAuthorizeUrl({
		redirect_uri: 'http://localhost:3000/login',
		scope: ['user'],
		state: 'some random string to protect against cross-site request forgery attacks'
	});
	var body = '<a href="' + authURL + '"> Get Code </a>';
	if (pLen === 2 && p[1] === 'login') {
		res.writeHead(200, {
			'Content-Length': body.length,
			'Content-Type': 'text/html' });
		res.end(body);
	} else if (pLen === 2 && p[1].indexOf('code') != -1) {
		/** Github sends auth code so that access_token can be obtained */
		var qsObj = {};
		
		/** To obtain and parse code='...' from code?code='...' */
		qsObj = qs.parse(p[1].split('?')[1]); 
		console.log(qsObj);

		/** Obtaining access_token */
		oauth2.getOAuthAccessToken(
			qsObj.code,
			{'redirect_uri': 'http://localhost:3000/login'},
			function (e, access_token, refresh_token, results){
				if (e) {
					console.log(e);
					res.end(e);
				} else if (results.error) {
					console.log(results);
					res.end(JSON.stringify(results));
				}
				else {
					console.log('Obtained access_token: ', access_token);
					res.end( access_token);
				}
			});

	} else {
        // Unhandled url
    }
});

function auth(){

}

module.exports = router;
