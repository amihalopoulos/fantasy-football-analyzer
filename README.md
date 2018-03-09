#Yahoo Fantasy Football Helper

## GOAL
1. analyze a fantasy team against that team's league by finding which position is weak and offer trade suggestions with another team that is strong in that position and weak in a position where you are strong.
2. Set up script to add players early in the morning on wednesday to beat waiver system

## DEV TODO
* convert app.js to use es6 with babel/webpack
* use routes to update loading status in app.js. check programming bookmarks

## MVP:
  * compare avg points for each position to rest of league

## to run app: 
1. get mongo running::: mongod
2. webpack          ::: webpack -d --watch
3. run SUDO nodemon ::: sudo nodemon
** also make sure that port 80 points to alexei.com -- important for oauth2 redirect in development