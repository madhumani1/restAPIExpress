/**
 * What is Middleware?
 * Functions that execute after the server receives the request
 * and before the controller action sends the response.
 * middleware functions have access to the response (res) and
 * request (req) variables and can modify them or use them as needed.
 * Middleware functions also have a third parameter which is a next function.
 * This function is important since it must be called from a middleware
 * for the next middleware to be executed. If this function is not called
 * then none of the other middleware
 * including the controller action will be called.
 */

// 1. Basic structure using express
 const express = require('express');
 const app = express();
 const data = require('../data');
 const port = process.env.PORT  || 4011;

//only next list is step 3. Use what you created in step2
app.use(logMiddleware);

 app.get('/', (req,res) => {
     res.send('<h1>Home Page</h1>');
 });

 app.get('/api/v1/doctors',(req,res) => res.json(data.doctors));

 app.listen(port, () => console.log(`listening to port ${port}`));

 // 2. function logMiddleware
 function logMiddleware(req, res, next) {
     //console.log('my first middleware');
     console.log(`${new Date().toISOString()}: ${req.originalUrl}`)
     //step 4.
     /**
      * The application is now using the middleware
      * that we defined and if we restart our server
      * and navigate to any of the pages in our app
      * you will notice that in the console the message
      * Inside Middleware appears. This is OK, but
      * there is a slight problem. The application now
      * loads forever and never actually finishes the
      * request. This is because in our middleware we
      * are not calling the next function so the controller
      * action never gets called. We can fix this by calling
      * next after our logging.
      */
    next();
 }
