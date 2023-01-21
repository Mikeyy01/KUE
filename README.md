# **Kue**

  

A application which allows the user to request a song to the DJ with a click of a button.

  

**Live Demo Site: https://kue.onrender.com/**

## Running the Web Application

### Setting up the Database

Clone the repository to your local machine using
 ```git clone https://git.fhict.nl/I476238/kue.git```

  

Change directory into the project by running 
```cd kue```


Start up a terminal and enter the db directory by running
 ```cd db```

Start the database by running 
```json-server --watch db.json```

### Starting the App

Start up another terminal and enter the todo directory by running
 ```cd todo```

  

Install the required dependencies by running
 ```yarn install```

  

Start the app by running 
```yarn start```



The database should now be running on http://localhost:3000 and the app should be running on  http://localhost:3001

***LocalHost:3000 will be occupied by the json-server, so make sure the react application is running on another port***

## User Interface

![Client Side](https://i.imgur.com/SBAJpH6.jpg)

![DJ Dashboard](https://i.imgur.com/olwAr4I.jpg)


## Video Trailer

[![](https://i.imgur.com/57cF0En.png)](https://www.youtube.com/watch?v=IX5ZLV0LYSs)



## Usage

To use the app, simply open it in your browser at http://localhost:3001. You can then request songs by clicking on Request and entering a song of your choosing. After you check out, the request will be sent to http://localhost:3001/list, this is where the DJ can manage the requests.
To view your position in the queue, visit: http://localhost:3001/queue

  

## Note!!

Make sure you have json-server installed on your machine. If not, you can install it by running
 ```npm install -g json-server```


**Thank you for using Kue!**
