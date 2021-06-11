# Customer Relationship Management Web Application

# Environment setup

## Install Node.js and Angular

1. Install Node.js through nvm (Node Version Manager)
- Access the nvm repository: https://github.com/nvm-sh/nvm
- Copy the cURL command in "Install & Update script" and run it in your terminal.
- See all Node.js version by nvm: `nvm list-remote`
- Install the a specific Node.js version using nvm: `nvm [node.js version]`. Example, if you want to install node.js version v14.17.0, you will run the command: `nvm v14.17.0`
- Check the installation
```
node --version # or node -v
npm --version # or npm -v
```

2. Install angular-cli through npm (Node Package Manager)
```npm install -g @angular/cli```


## Install MongoDB Server
- Download here: https://www.mongodb.com/try/download/community
- Check the installation: open your terminal and run `mongo`

## Install XamPP for Apache server and MySQL (Optional)

Download here https://www.apachefriends.org/index.html
```
cd Downloads # the directory store all download files
ls 
chmod 755 xampp-linux-x64-7.4.10-0-installer.run
ls -al
sudo ./xampp-linux-x64-7.4.10-0-installer.run # run it to install
sudo /opt/lampp/manager-linux-x64.run # open xampp
```
* Note: if the Apache server cannot started, fix
- Stop the apache service: `sudo /etc/init.d/apache2 stop`
- Start again: `sudo /opt/lampp/lampp start`
- Stop: `sudo /opt/lampp/lampp stop`

# Create the workspace

## Create a new project

```
cd your-dir
ng new your-project-name
```

## Install dependencies

1. Dependencies for Node.js

```
npm install express
npm install mongoose
npm install dotenv
npm install cors
npm install morgan
npm install -g nodemon
```

2. Dependencies for Angular

```ng add @angular/material```

# Running

## Server side
```
cd server
nodemon index.js
```

## Client side
1. Development server

Run `ng serve -o` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. 
* Note: If there is error occur like "system limit for number of file watchers reached"
* Fix: run the command in your terminal 
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

2. Code scaffolding

Run `ng generate component component-name` or `ng g c component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

3. Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

4. Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

5. Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

6. Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.