/*
    ===============   RULES   =============== 
    * Always send the status code with each req

    ===============   QUESTION   =============== 
    WHAT: 
        app, route(), get(), post(), MW, (req, res) cycle, router, mounting a router, param MW
    
    WHY: MW, param MW,

    WHAT AND WHY: chaining multiple MW functions
*/

// ROUTING: It means how an application responds to a certain client request or a certain url or http request
// the "app.js" file V generally use for MW declaration

// const fs = require("fs");
// express is a function
const express = require("express");
const dotenv = require('dotenv');

// Locate the path of env file
// dotenv.config({path: './config.env'});
// // logging out env vars
// console.log(process.env);
  
// requiring "morgan" => 3rd party middleware
const morgan = require('morgan');

// here "express()" function is called and it will make all it's function available to "app" var
const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// *************** 1) MIDDLEWARES  ***************   ***************
// ***************   ***************   ***************   ***************

// using morgan => this will return all the details about the req made the user
// app.use(morgan('dev'));
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Middleware => it is just a function which can modify the incoming req data
// it's ka middleware bcoz it stands bt req and response
// here "express.json()" is middleware. Here this statement will return a function which will be added to middleware stack. Bcoz of this V R able to access the "body" on req object
// "use()" is the function which V use for using the middleware
app.use(express.json());

// Defining a MW function for using static files
// without defining this MW function if V try to access "127.0.0.1:3000/overview.html" then this will not work bcoz V still haven't allowed the Express to use static files
app.use(express.static(`${__dirname}/public`));
// Now "127.0.0.1:3000/overview.html" this will work

// Creating our own middleware function MW = A
app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
    // It's mandatory to call next() in each middleware o/w "req and res cycle" will stop (=> and this will not allow to run all the MW present after this or those are in the MW queue for execution) and will not able to send the response to the client
});
// this MW will be callled for every call/req bcoz V haven't specify any route here

// defining a new MW => here V R manupulating the "req" object. V R doing so by making a situation in which V want to add the current time at which the req(on which MW is used) is made
// suppose V wants to find when a certain req is made => so V will use this MW. V have used this in the getAllTours()
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log();
    next();
});
// "toISOString()" will Returns a date as a string value in ISO format. More readable date  


// *************** 2) ROUTE HANDLERS  ***************   ***************
// ***************   ***************   ***************   ***************

// Defining a function for route handler
// const getAllTours = (req, res) => {

//     // V wants to find at which time this req was made  => Here using the above our own defined MW 
//     console.log("getAllTours() req is made at: " + req.requestTime);

//     // after sending the "res.json/send" V complete/end the (req, res) cycle
//     res.status(200).json({
//         status: 'success',
//         requestedAt: req.requestTime, 
//         results: tours.length, 
//         data: {
//             tours
//         }
//     });
// };
// "requestedAt: req.requestTime" => means V wants to send the req time at which this req was made with the response 

// const getTour = (req, res) => {
//     const id = req.params.id * 1; 
//     const tour = tours.find(el => el.id === id);

//     if (!tour) {   // no tour found for the given id
//         return res.status(404).json({
//             status: 'fail',
//             message: "Invalid ID"
//         });
//     }
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// } 

// const createTour = (req, res) => {
//    const newId = tours[tours.length-1].id + 1;

//    const newTour = Object.assign({id: newId}, req.body);

//    tours.push(newTour);

//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).send({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         });
//     });
// }

/*
    here: "(req, res) => {}" this anonymous function is ka Route Handler
*/
// app.get('/', (req, res) => {
//     // sedning the simple data
//     // res.status(200).send("Hello from the server side");

//     // sending the json
//     res.status(200).json({message: "Hello from the server side", app: "Natours"});
// });

// app.post('/', (req, res) => {
//     res.send("You can send to this endpoint...");
// }); 

// This is the top level code => will only execute once
// reading the json file
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
// console.log(tours);
 
// here "tours" is a resource => bcoz at here the user will get something
 
// app.get('/api/v1/tours', (req, res) => { 
//     res.status(200).json({
//         status: 'success',   
//         results: tours.length, 
//         data: {
//             // tours: tours    
//             // tours => this came from the get endpoint
//             // : tours => var defined above for reading the JSON file
//             // when "objectName: propertyName" both are same then V can send only one of them
//             tours
//         }
//     })   
// });




// app.post('/api/v1/tours', (req, res) => {
//     // here the "body" (it is the property) is available on the req bcoz of middleware: express.json()
//     // here "body" means the data V have send to the server (in postman) or the whole object send by the user
//     // console.log(req.body);

//     // Now V wants to save the data posted in our JSON
//     /*
//         In DB an id is assigned to the data automatically but here V don't have DB so V need to specify the id 
//         To set the id for new onject, V need to get the id of last item from JSON file and add 1 to it
//         Here: "tours[tours.length-1]" will give the last object and ".id" V access the id 
//     */
//    const newId = tours[tours.length-1].id + 1;

//     // defining a new tour
//    const newTour = Object.assign({id: newId}, req.body);
//    /*
//         "Object.assign" => allows us to create a new object by combining 2 existing objects
//         here: {id: newId} is the 1st object
//         req.body: 2nd object
//    */

//     // saving to the array
//     tours.push(newTour);

//     // write to the file
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         // What V wants to do as soon as the data is written to the file => V will send the newly created object as the response
//         // 201: means "Created" => V have created a new response to the server
//         res.status(201).send({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         });
//     });
//     /*
//         why "JSON.stringify()": V have pushed our newTour into an array but our file is of type JSON, so to put a simple array into a JSON file V caonvert the normal array to JSON array, and the 2nd arg of writeFile() needs to be: "of type string or an instance of Buffer, TypedArray, or DataView"
//         To see the difference try this

//         console.log("Normal and JSON array");
//         console.log(tours);
//         console.log(JSON.stringify(tours));
//     */

//     // res.send('Done posting...');
// })




// Defining route params
// In this route V need to find the item with the send id and then pass the whole found object as response to the user

// app.get('/api/v1/tours/:id', (req, res) => {
//     // console.log(typeof req.params.id);
    // console.log(req.params);    // this will print the whole object "params"
    // console.log(req.params.id);    // this will print the id field present in the object "params"
     
//     // M-1
//     // const data = tours[req.params.id];
//     // console.log(data);

//     // M-2:
//     const id = req.params.id * 1; 
//     // as req.params is a string so above statement will convert it to the num
//     const tour = tours.find(el => el.id === id);
//     // array.find() => will loop through the array and return all the elements which satisfy the given condition. If there are more than 1 then it will return an array of matching item

    
//     // if the user entered (id > length) => if V will not do this then even in case of failure the below code(X) will execute and it will send the status code of 200, which V don't want
//     // if (id > tours.length) {
//     if (!tour) {   // no tour found for the given id
//         return res.status(404).json({
//             status: 'fail',
//             message: "Invalid ID"
//         });
//     }
       // X
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// });

  


// const updateTour = (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour: '<Updated tour will be here>'
//         }
//     });
// }

// for updating
// app.patch('/api/v1/tours/:id', (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour: '<Updated tour will be here>'
//         }
//     });
// });


// const deleteTour = (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }

//     // 204 => no content
//     res.status(204).json({
//         status: 'success',
//         data: {
//             tour: '<Deleted>'
//         }
//     });
// }

// Route handlers for users route
// const getAllUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };
// // 500: internal server error

// const getUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };

// const createUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };

// const updateUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };

// const deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };

// app.delete('/api/v1/tours/:id', (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }

//     // 204 => no content
//     res.status(204).json({
//         status: 'success',
//         data: {
//             tour: '<Deleted>'
//         }
//     });
// });

/*  
    Different methods of defining routes and using route handlers with them
        M-1: Normal method : when V define a get or post req for a route and use the route handler function inside that
        M-2: V define a get or post method but define the route handler function outside and pass that function into the get/post (done below)
        M-3: V merge the get and post method working on the same route and connect them on the single "app" var
*/

// M-2
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour); 
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// M-3: A more better version of above code

// *************** 3) ROUTES  ***************   ***************
// ***************   ***************   ***************   ***************

// app
//     .route('/api/v1/tours')
//     .get(getAllTours)
//     .post(createTour);

// both of above (get amd post) will work on the same route "/api/v1/tours"

// If V use our own MW here, and call the above route, then it will not execute Bcoz the (req, res) cycle has been completed by above route call i.e "/api/v1/tours"
// Creating our own middleware function MW = B. MW = A will run but this will not bcoz it occurs before all res.send/json
app.use((req, res, next) => {
    console.log('Hello from the SECOND middleware');
    next();
});
// If V run any of the below routes then this MW will run bcoz then it will be saved and will come before any of the below routes in the middleware queue 


// app
//     .route('/api/v1/tours/:id')
//     .get(getTour)
//     .patch(updateTour)
//     .delete(deleteTour);
    
// Defining the route for users
// app
//     .route('/api/v1/users')
//     .get(getAllUsers)
//     .post(createUser);

// app
//     .route('/api/v1/users/:id')
//     .get(getUser)
//     .patch(updateUser)
//     .delete(deleteUser);   


// Defining a new router for "tours" and users. this is k/a Mounting a Router
// const tourRouter = express.Router();
// const userRouter = express.Router();

// tourRouter
//     .route('/')   
//     .get(getAllTours)
//     .post(createTour);
// // V have used "/" instead of "/api/v1/tours" bcoz which using the tourRouter or userRouter V have defined a root route for them on which will be used(which is "/api/v1/tours"), here "/" = "/api/v1/tours"

// tourRouter
//     .route('/:id')
//     .get(getTour)
//     .patch(updateTour)
//     .delete(deleteTour);

// for users
// userRouter
// .route('/')
// .get(getAllUsers)
// .post(createUser);

// userRouter
//     .route('/:id')
//     .get(getUser)
//     .patch(updateUser)
//     .delete(deleteUser);


app.use('/api/v1/tours', tourRouter);
/*
    "tourRouter" is a MW and V wants to use it for the route "/api/v1/tours"
    in "app.use" V have specified the MW function "tourRouter" and than V have defined a route ("/api/v1/tours") for which V wants it to act as MW
*/
app.use('/api/v1/users', userRouter);

// Now how to connect the "tourRouter" with our application => V will use it as a MW bcoz "tourRouter" is a MW

// *************** 4) START SERVER  ***************   ***************
// ***************   ***************   ***************   ***************
// const port = 3000;
// app.listen(port, () => {
//     console.log(`App is running on port ${port}`);
// });

module.exports = app;    








































