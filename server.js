const fetch = require('node-fetch')
const fs = require('fs')
const { configClass, query } = require('./config.js')
const { notificationManager, notificationBuilder } = require('./ntfy.js')
const config = new configClass();
const manager = new notificationManager(config.ntfy.address, config.ntfy.port, config.ntfy.topic, config.ntfy.authType, config.ntfy.username, config.ntfy.password)

async function main() {
    let url = 'https://graphql.anilist.co';
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${config.token.token}`
        },
        body: JSON.stringify({
            'query': query
        })
    };
    let res_raw = await fetch(url, options); let res = await res_raw.json();
    if (res.errors) {
        for (let i in res.errors) { console.error(`Anilist API error: \"${res.errors[i].message}\"; Code: ${res.errors[i].status}`); }
    } else {
        let notifications = res.data.page.notifications;
        let notificationIDs = notifications.map(({ id }) => id)
        fs.readFile('./notifications.json', {encoding:'utf8'}, (err, data) => {
            if (err) { 
                console.error(err)
                let notificationsFile = [];
                fs.writeFile('./notifications.json', JSON.stringify(notificationIDs), (err) => {
                    for (let i = 0;i < notifications.length;i++) {
                        if (notificationsFile.indexOf(notifications[i].id) == -1) {
                            let apiNotification = notifications[i];
                            let notification = new notificationBuilder();
                            if (apiNotification.type == 'AIRING') {
                                notification.setTitle(`A new episode of ${apiNotification.media.title.userPreferred} has aired.`)
                                notification.setBody(apiNotification.contexts[0]+apiNotification.episode.toString()+apiNotification.contexts[1]+apiNotification.media.title.userPreferred+apiNotification.contexts[2])
                                notification.setIcon(apiNotification.media.coverImage.medium)
                                notification.setClickEvent(apiNotification.media.siteUrl)
                                manager.send(notification)
                            } else {
                                notification.setTitle("New AniList notification.")
                                notification.setBody("You have recieved a new anilist notification.")
                                notification.setIcon('https://anilist.co/img/icons/android-chrome-512x512.png')
                                notification.setClickEvent("https://anilist.co/notifications")
                                notification.setPriority('low')
                                manager.send(notification)
                            }
                        }
                    }
                })
            } else {
                let notificationsFile = JSON.parse(data); if (notificationsFile == undefined) { notificationsFile = [] };
                fs.writeFile('./notifications.json', JSON.stringify(notificationIDs), (err) => {
                    for (let i = 0;i < notifications.length;i++) {
                        if (notificationsFile.indexOf(notifications[i].id) == -1) {
                            let apiNotification = notifications[i];
                            let notification = new notificationBuilder();
                            if (apiNotification.type == 'AIRING') {
                                notification.setTitle(`A new episode of ${apiNotification.media.title.userPreferred} has aired.`)
                                notification.setBody(apiNotification.contexts[0]+apiNotification.episode.toString()+apiNotification.contexts[1]+apiNotification.media.title.userPreferred+apiNotification.contexts[2])
                                notification.setIcon(apiNotification.media.coverImage.medium)
                                notification.setClickEvent(apiNotification.media.siteUrl)
                                manager.send(notification)
                            } else {
                                notification.setTitle("New AniList notification.")
                                notification.setBody("You have recieved a new anilist notification.")
                                notification.setIcon('https://anilist.co/img/icons/android-chrome-512x512.png')
                                notification.setClickEvent("https://anilist.co/notifications")
                                notification.setPriority('low')
                                manager.send(notification)
                            }
                        }
                    }
                })
            }
        })
    }
}

setTimeout(() => {if (config.token.token) {config.token_verify(manager)}}, 1000)
setInterval(() => {if (config.token.token) {main()}}, config.refresh);
setInterval(() => {if (config.token.token) {config.token_verify(manager)}}, 86400000);