const http = require('http');
function httpsPost({body, ...options}) {
    return new Promise((resolve,reject) => {
        const req = http.request({
            method: 'POST',
            ...options,
        }, res => {
            const chunks = [];
            res.on('data', data => chunks.push(data))
            res.on('end', () => {
                let resBody = Buffer.concat(chunks);
                switch(res.headers['content-type']) {
                    case 'application/json':
                        resBody = JSON.parse(resBody);
                        break;
                }
                resolve(resBody)
            })
        })
        req.on('error',reject);
        if(body) {
            req.write(body);
        }
        req.end();
    })
}

module.exports = {
    "notificationManager": class notificationManager{
        constructor(address, port, topic, authType, username, password) {
            this.address = address
            this.port = isNaN(port) ? 80 : port
            this.topic = topic
            this.username = username
            this.password = password
            this.authType = (authType === undefined) ? 'none' : ((authType === 'header') ? 'header' : ((authType === 'param') ? 'param' : undefined))
            this.authHeader = Buffer.from(`${this.username}:${this.password}`).toString('base64')
            this.authParam = Buffer.from("Basic " + this.authHeader).toString('base64')
        }
        async send(notification) {
            let path;
            if (this.authType === 'none' || this.authType === undefined) {
                path = `/${this.topic}`
            } else if (this.authType === 'header') {
                path = `/${this.topic}`
                notification.headers.Authorization = `Basic ${this.authHeader}`
            } else if (this.authType === 'param') {
                path = `/${this.topic}?auth=${this.authParam}`
            }
            const res = await httpsPost({
                hostname: this.address,
                port: this.port,
                path: path,
                headers: notification.headers,
                body: notification.body
            })
        }
    },
    "notificationBuilder": class notificationBuilder{
        constructor() {
            this.headers = {}
            this.body = ""
        }
        setBody(body) {
            this.body = body
        }
        setTitle(title) {
            this.headers.Title = title
        }
        setPriority(priority) {
            if (priority == 5 || priority == 'max' || priority == 'urgent') {
                this.headers.Priority = 'urgent'
            } else if (priority == 4 || priority == 'high') {
                this.headers.Priority = 'high'
            } else if (priority == 3 || priority == 'default') {
                this.headers.Priority = 'default'
            } else if (priority == 2 || priority == 'low') {
                this.headers.Priority = 'low'
            } else if (priority == 1 || priority == 'min') {
                this.headers.Priority = 'min'
            } else {
                this.headers.Priority = 'default'
            }
        }
        addTags(tags) {
            if (Array.isArray(tags)) {
                if (tags.length > 0) {
                    if (!this.headers.Tags) this.headers.Tags = ""
                    for (let tag in tags) {
                        if (this.header.Tags.length > 0) this.header.Tags+=','
                        this.headers.Tags+=tag.toString()
                    }
                }
            }
        }
        scheduleDelivery(time) {
            this.headers.At = time
        }
        setClickEvent(url) {
            this.headers.Click = url
        }
        setAttachment(url) {
            this.headers.Attach = url
        }
        setIcon(url) {
            this.headers.Icon = url
        }
    }
}