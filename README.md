<h1 align="center">anilist-notifications</h1>
<p>
  <img src="https://img.shields.io/badge/node-18.x-blue.svg" />
  <a href="https://github.com/emmaexe/anilist-notifications/wiki" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/emmaexe/anilist-notifications/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/emmaexe/anilist-notifications/blob/main/LICENSE" target="_blank">
    <img alt="License: GPL-3.0-ONLY" src="https://img.shields.io/github/license/emmaexe/anilist-notifications" />
  </a>
</p>

> A notification server for Anilist that uses ntfy.

### 🏠 [Repository](https://github.com/emmaexe/anilist-notifications)

## **Dependencies**

- NodeJS 18.x
  - node-fetch

## **Installation**

Download or clone the [latest release](https://github.com/emmaexe/anilist-notifications/releases/latest).

Enter the directory and run:

```sh
npm install
```

## **Setup/configuration**

[Go to the anilist website and navigate to Settings -> Apps -> Developer.](https://anilist.co/settings/developer) Press on "Create New Client. Pick whatever you want as the Name and enter ``https://anilist.co/api/v2/oauth/pin`` as the Redirect URL. After the app is created, click on it and copy the number under the ID field. Ignore all other fields (Secret, Name, Redirect URL). The config-template folder in the root directory of the project contains the template for the configuration file. Create a folder called ``config`` (or just rename ``config-template`` to ``config``), copy the config template into it and rename it to `config.json` (from ``config.json.template``). Fill in the configuration file (this is where you paste the previously copied Api Client ID) and run the bot.

Quick explanation of the config.json file:

```json
{
    "ntfy": {
        "address": STRING,
        "port": INT,
        "topic": STRING,
        "authType": STRING,
        "username": STRING,
        "password": STRING 
    },
    "id": STRING,
    "refresh": INT
}
```

- `ntfy` contains settings regarding the ntfy server you are connecting to:
  - `address` is just the address of the server and nothing else (e.g. `ntfy.sh`).
  - `port` is the port where the ntfy server is hosted.
  - `topic` is the topic to which this server will send notifications to. Quoting the ntfy docs: "Topics are created on the fly by subscribing or publishing to them. Because there is no sign-up, the topic is essentially a password, so pick something that's not easily guessable."
  - `authType` is the auth type for the ntfy server. This is only useful if using a selfhosted ntfy server where you use credentials to log in. If you are using such a server you can also ignore the quote on topic names from the previous config entry. Possible auth types are `header` and `param`. Header sends the auth username+password as a header and param as a URL parameter. If the key is left empty, something random is typed in or the key is deleted, no authentication will be used
  - `username` ntfy username used in auth
  - `password` ntfy password used in auth
- `id` is the Api Client ID you copied before. Make sure to enter it in the config as a string not an integer.
- `refresh` is the delay between checking for notifications with the Anilist API (in miliseconds). The default is 60000 (that is 60 seconds, just divide by 1000) and the minimum is 15000 (15 seconds). If you try to go lower the delay will be increased to 15000 automatically to not spam the Anilist API.

When starting the bot up for the first time after finishing the config file, you will be prompted to follow a URL and authorize the application you made earlier to access your account. You will then recieve a token you will need to paste into the console. This token grants the server 1 year of access to your account's API. You will recieve a notification via the same ntfy topic you use for Anilist notifications when the token gets close to expiry. The same topic will be used for notifications of any Anilist errors that may occur. Should something go wrong or your token is revoked and the app does not request you re-create the token, simply delete the `token.json` file in the root of the project to make the server forget the previous token and prompt you to set it up again.

## **Usage**

Run this command in the root directory of the cloned repository:

```sh
node .
```

## **Author**

👤 **Emmaexe**

- Github: [@emmaexe](https://github.com/emmaexe)
- Discord: [@emmaexe#0859](https://discord.gg/v4YrAgBRvz)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/emmaexe/anilist-notifications/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [GPL-3.0-only](https://github.com/emmaexe/anilist-notifications/blob/main/LICENSE) licensed.
