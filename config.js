const readline = require('readline')
const configfile = require('./config/config.json')
const fs = require('fs')
const fetch = require('node-fetch');
const { notificationBuilder } = require('./ntfy.js')
const query = `query {
	page: Page {
	  	notifications: notifications {
			... on AiringNotification {
				id
				type 
				animeId
				episode
				contexts
				createdAt
				media: media {
					id
					title { userPreferred }
					type
					coverImage { color, medium, large, extraLarge }
					siteUrl
		  		}
			}
	  	}
	}
}`

module.exports = {
    "configClass": class config {
        constructor() {
			this.token = {}
            for (let item in configfile) { this[item] = configfile[item]; }
			if (!this.refresh) {
				this.refresh = 60000;
			} else if (this.refresh < 15000) {
				this.refresh = 15000;
			}
            this.token_access()
        }
		async token_access() {
			fs.readFile('./token.json', {encoding:'utf8'}, (err, data) => {
				if (err) { console.error(err); return this.token_constructor(); } else {
					let tokenfile = JSON.parse(data);
					if (tokenfile === undefined) { return this.token_constructor(); } else { 
						if (!(tokenfile.token && tokenfile.expires)) { return this.token_constructor(); } else {
							this.token = {
								'token': tokenfile.token,
								'expires': tokenfile.expires
							}
							return;
						}
					}
				}
			})
		}
		async token_constructor() {
			console.clear()
			const cin = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});
			cin.question(`Please follow this URL to grant the server an auth token.\nhttps://anilist.co/api/v2/oauth/authorize?client_id=${this.id}&response_type=token\nYou will need to copy paste it into the console.\nYou only need to do this once a year (the lifespan of the token)\n`, async token => {
				let newtokenfile = {'token': token, 'expires': Date.now() + 31536000000}
				fs.writeFile('./token.json', JSON.stringify(newtokenfile), (err) => { 
					if (err) console.error(err);
					cin.close();
					process.exit();
				})
			});
		}
		async token_verify(manager) {
			let notification = new notificationBuilder()
			let url = 'https://graphql.anilist.co';
			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${this.token.token}`
				},
				body: JSON.stringify({
					'query': query
				})
			};
			let res_raw = await fetch(url, options); let res = await res_raw.json();
			if (res['errors'] != undefined) {
				if (res.errors[0].message === "Invalid token" && res.errors[0].status === 400) {
					notification.setTitle("AniList token expired.")
                    notification.setBody("Your AniList token has expired or is invalid. AniList tokens have a lifespan of 1 year. Please re-create the token to continue receiving your AniList push notifications.")
                    notification.setIcon('https://anilist.co/img/icons/android-chrome-512x512.png')
					notification.setClickEvent("https://anilist.co/settings/apps")
					notification.setPriority('urgent')
                    manager.send(notification)
				} else {
					notification.setTitle("Generic AniList API error.")
                    notification.setBody(`Error ${res.errors[0].status}: ${res.errors[0].message}`)
                    notification.setIcon('https://anilist.co/img/icons/android-chrome-512x512.png')
					notification.setClickEvent("https://anilist.co/settings/apps")
					notification.setPriority('high')
                    manager.send(notification)
				}
			} else {
				let now = Date.now();
				if ( (this.token.expires - now) <= 604800000 ) {
					let expiryDate = (new Date(this.token.expires)).toISOString()
					notification.setTitle("Your anilist token will expire within a week.")
                    notification.setBody(`Your AniList token will expire on: ${expiryDate}. AniList tokens have a lifespan of 1 year. Please re-create the token to continue receiving your AniList push notifications.`)
                    notification.setIcon('https://anilist.co/img/icons/android-chrome-512x512.png')
					notification.setClickEvent("https://anilist.co/settings/apps")
					notification.setPriority('default')
                    manager.send(notification)
				}
			}
		}
    },
    "query": query
}