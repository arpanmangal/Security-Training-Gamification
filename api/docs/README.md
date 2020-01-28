# About Game Connections 

We have developed 2 separate scenes in unity, one for initialising the game and other for updating the final scores.
**Data.cs** C# script is a static class that holds data that needs to be stored and updated throughout the gameplay which helps in easy handling of data across scenes.
**Initialise_Game.cs** is the main C# script that is used in initialising of data and fetching it from the server. It also validates if your are eligible for gameplay according to your Cyber_IQ.
**END_Game.cs** is a script that is used to update the logs to server, update the leaderboards and final scores.

We use Unity Webrequests to make corresponding get and post requests.
## Authentication Token 
Each request to the backend server is authenticated with access token provided by the user set in the headers of each request. If the token is not present, the request is discarded. We have saved the access token on client side in **window.localStorage.accesstoken** in the browser. We allow our game to access this token saved in the browser and use it to make subsequent requests on behalf of the user. This allows for personalised game content desired by the user.
Token is grabbed by a javascript plugin at **/Assets/Plugins/token.jslib**
This is utilised within both **Initialise_Game.cs** and **END_Game.cs** to set request headers.

## Game Loading (Scene 1 Before gameplay)

### Create Level details in logs 
**(Initialisation of level logs)**

Makes a request to **/api/logs/create_level**
Checkout API docs for signature.
We give 1 thing as input:
1. **name**: To index the level from which data is required

There is a server side validation of Cyber_IQ and if the player in not eligible for the game, server returns a response code of 999 corresponding to which game exits.

### Get Attributes/data from database
**(Fetches the data from server)**

Makes a request to **/api/level/getAttributes**
Checkout API docs for signature.
We give 3 things as input:
1. **name**: To index the level from which data is required
2. **keys**: These are attribute key strings separated by commas. These tell the server what all attributes need to be fetched.
3. **len**: These are also a string which is essentially comma separated values (It is parsed server side). This data tells the server the amount of data needs to be fetched from corresponding attribute. It also has options for setting parameters for fetching all values of the attribute or integer amount of values and random selection of data.

```
eg: 
keys_to_fetch = "passwords,news"
(passwords and news are 2 different attributes that need to be fetched)
len_to_fetch = "10T, -1F"
(10T suggests that we need to fetch 10 values from password field and T suggests that fetched values are shuffled before fetching whereas -1 suggests that we need to fetch all values corresponding to attribute news and F means no need to shuffle the data.)
```

## Updating game status (Scene 2 After Gameplay)

### Update basic data/score and leaderboard 
**(To update and save the score of a player)**

Makes a request to **/api/logs/modify_basic**
Checkout API docs for signature.
We give 3 things as input:
1. **name**: To index the level from which data is required
2. **success**: 1 means level crossed and 0 means level failed.
3. **coins**: Coins/Score which is earned by the player in the particular game.
This call also updates the max coins earned in this level and updates the leaderboard.

### Update Logs 
**(To update and save the logs sampled throughout the game)**

Makes a request to **/api/logs/modify**
Checkout API docs for signature.
We give 2 things as input:
1. **name**: To index the level from which data is required
2. **log_object**: The log_object stored in Data.cs file which is basically the data sampled throughout the game to save as logs.

### Update coins 
**(To update total_coins of a player)**

Makes a request to **/api/user/updateCoins**
Checkout API docs for signature.
We give 1 thing as input:
1. **coins**: total_coins uptil now. (We update total coins by giving total coins as input and not the coins earned in this level as in case some error crops up due to lack of network connectivity, 2nd request does not lead to updations twice. Updating total_coins gives us a safe allowance for multiple duplicate requests)

### Other Parameters
We need to set the level name within both the C# scripts which tells our game the name of the level from which we will fetch pur data.
Moreover for testing needs one can switch off the Token grabbing call withing C# script and manually enter the token. The reason is that tokens can't be grabbed by the javascrip plugin if we are testing the game from within the unity editor as there is no browser. Javascript plugin will only work in WebGl build that runs on a browser.

### Build and publish
To publish the game follow the steps:

```
1. Develop unity WebGl build
2. The build will contain 2 folders(Build and TemplateData) and 1 index.html. Copy and Paste these 3 files inside api/build/games/<Level_Name>/. 
   (DO NOT COMMIT THE BUILD HERE)
3. Your level is deployed.
4. Remember to set your level name and request URLs properly within the game scripts. Also, remember to use Token call function within the script to allow the game grab token from the browser.
-------------------------------
5. Ask your Super Admin to create a level from his account, giving your <Level_Name>. (Ignore if already done).
6. Ask your Level Admin to edit your level filling the necessary details,
   and most importantly setting the game url to: <Portal_Link>/game/<Level_Name>, and setting isAvailable.
7. Test with your Player Account.
```


### Other Documents
- **Portal Setup**: [`INSTALL.md`](../../INSTALL.md)
- **Server Setup**: [`api/README.md`](../README.md)