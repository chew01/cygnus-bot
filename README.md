# cygnus-bot
Discord bot for Maplestory using the Discord.js library.

This bot was originally meant to use data from [Cygnus Parser](https://github.com/chew01/cygnus-parser). However, due to hardware constraints, this bot is currently set to draw data from the Maplestory.gg API. Effectively, this is the Maplestory.gg bot, using the new Application Command interface in Discord.

#### Commands
`/ms p <character name>`

Fetches data about a character (GMS NA only) and sends it in a Discord embed. Caching feature is enabled to prevent excessive loading times.

#### Usage
1. Install [Node.js (16.14.2 LTS)](https://github.com/nodejs/node). Your installation should include [npm](https://github.com/npm/cli).
2. Run `npm install`. This will install the required dependencies.
3. Fill in the required fields in the `.env.example` file, and rename the file to `.env`.
4. Run `npm run build`. This will compile the code into a `build` folder and run the app.
5. You can use [pm2](https://github.com/Unitech/pm2) as a process manager to run the bot.
