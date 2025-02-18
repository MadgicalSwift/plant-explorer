# Project Title: 
Plant Explorer Bot 🌱

# Project Description:
The Plant Explorer Bot is an interactive bot designed to help users learn about different flowering plants through exploration and quizzes. It provides information on various plant species along with images, and users can test their plant knowledge with fun, educational quizzes.

# Key Features:
Plant Information Display: Displays plant names and images for easy identification and learning.
Quiz Functionality: Interactive quizzes to test knowledge about plant characteristics, uses, and symbolism.
Explanations for Answers: Detailed explanations for quiz answers to enhance learning.

# Prerequisites
Before you begin, ensure you have met the following requirements:

* Node.js and npm installed
* Nest.js CLI installed (npm install -g @nestjs/cli)
* DynamoDb database accessible

## Getting Started
### Installation
* Fork the repository
Click the "Fork" button in the upper right corner of the repository page. This will create a copy of the repository under your GitHub account.


* Clone this repository:
```
https://github.com/MadgicalSwift/plant-explorer.git
```
* Navigate to the Project Directory:
```
cd plant-explorer
```
* Install Project Dependencies:
```bash
$ npm install or npm i
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Add the following environment variables:

```bash
USERS_TABLE= testing-table-1
REGION= ap-south-1
ACCESS_KEY_ID= ACCESS_KEY_ID
SECRET_ACCESS_KEY=SECRET_ACCESS_KEY
API_URL = API_URL
BOT_ID = BOT_ID
API_KEY = API_KEY
```
# API Endpoints
```
POST api/message: Endpoint for handling user requests. 
Get/api/status: Endpoint for checking the status of  api
```

# Make their local server to public server
```
Install and run ngrok using command "ngrok http 3000" Copy forwarding Url
Install and run postman and past url in the body 
and send PUt request Url https://v1-api.swiftchat.ai/api/bots/Bot_Id/webhook-url
```



# folder structure

```bash
src/
├── app.controller.ts
├── app.module.ts
├── main.ts
├── chat/
│   ├── chat.service.ts
│   └── chatbot.model.ts
├── common/
│   ├── exceptions/
│   │   ├── custom.exception.ts
│   │   └── http-exception.filter.ts
│   ├── middleware/
│   │   ├── log.helper.ts
│   │   └── log.middleware.ts
│   └── utils/
│       └── date.service.ts
├── config/
│   └── database.config.ts
├── i18n/
│   ├── en/
│   │   └── localised-strings.ts
│   └── hi/
│       └── localised-strings.ts
├── localization/
│   ├── localization.service.ts
│   └── localization.module.ts
│
├── message/
│   ├── message.service.ts
│   └── message.service.ts
└── model/
│   ├── user.entity.ts
│   ├──user.module.ts
│   └──query.ts
└── swiftchat/
    ├── swiftchat.module.ts
    └── swiftchat.service.ts

```

# Link
* [Documentation](https://app.clickup.com/43312857/v/dc/199tpt-7824/199tpt-19527)

