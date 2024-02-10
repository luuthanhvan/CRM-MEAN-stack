## How to install and run?
This repo is separated into two main directories ```ui``` and ```server```. <br />
```ui``` contains the UI code (Angular) <br />
```server``` contains the BE code (NodeJS and ExpressJS) <br />
So first of all you need to install the necessary libraries and run the code separately in these two directories.

### UI
Open a termial and run these following commands line by line
```
1. cd ui
2. npm install
3. ng serve
```
### Server
* First, rename the file ```.env_example``` to ```.env``` (in ```server``` directory) <br />
* Open another termial and run these following commands
```
1. cd server
2. npm install
3. npm start
```
* After running the server successfully, you need to run the script to add some user data
(the sample data is in server/json-data/sample-users.json file) <br />
Just open a new terminal and run these following commands to run the script
```
1. cd server/scripts
2. node createUsers.js
```

## Customization
In case you want to change the running port of server, you need to
1. Change the ```SERVER_PORT``` in ```server/.env``` file.
2. Change the same port number of the ```baseUrl``` in ```ui/src/assets/environment.json```<br />

Example:
If your ```SERVER_PORT``` is <b>4000</b>, then the ```baseUrl``` will be http://localhost:<b>4000</b>