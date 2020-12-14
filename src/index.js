const data = require('../data');
const port = process.env.PORT  || 4001;

/**
 * Like http, express is used for CRUD operations on given URLs.
 * Why we use express is because it is faster, secure, simple
 * and easily manageable.
 * Express is a part of npm.
 * Fast, unopinionated, minimalist web framework for node
 */

const express = require('express');
const app = express();
// let's add middleware - cors and body-parser
const cors = require('cors');
const bodyParser = require('body-parser');

//swagger
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use("/api/v1/docs",swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// try commenting out and see difference. It will give you CORS error
app.use(bodyParser.json()).use(cors());

app.get('/', (req,resp) => resp.send('Hello World'));
app.get('/api/v1/doctors',(req,res) => res.json(data.doctors));
app.get('/api/v1/doctor/:id',(req,res) => {
    const id = parseInt(req.params.id);
    console.log('id: ',id);
    if(isNaN(req.params.id))    {
        return res.status(400).json({error: "Invalid Id."});
    }
    const doctor = data.doctors.find((doctor) => doctor.id==id);
    if(!doctor)    {
        return res.status(404).json({error: "Doctor not found."});
    }
    return res.json(doctor);
});

app.post('/api/v1/doctors', (req,res) => {
    if(!req.body.name)  {
        return res.status(400).json({error: 'Doctor needs a new Parameter.'});
    }

    const nextId = data.doctors.length+1;
    const doctor = {id: nextId, name: req.body.name};

    data.doctors.push(doctor);
    res.status(201).json(doctor);   // 201 status code means resource created

});

app.get('/api/v1/patients',(req,res) => res.json(data.patients));
app.get('/api/v1/patient/:id',(req,res) => {
    const id = parseInt(req.params.id);
    if(isNaN(req.params.id))    {
        return res.status(400).json({error: "Invalid Id."});
    }
    const patient = data.patients.find((patient) => patient.id==id);
    if(!patient)    {
        return res.status(404).json({error: "Patient not found."});
    }
    return res.json(patient);
});

app.post('/api/v1/patients', (req,res) => {
    if(!req.body.name)  {
        return res.status(400).json({error: 'Patient needs a new Parameter.'});
    }

    const nextId = data.patients.length+1;
    const patient = {id: nextId, name: req.body.name};

    data.patients.push(patient);
    res.status(201).json(patient);   // 201 status code means resource created

});

// Visits
/*app.get("/api/v1/visits", (req, res) => {
  console.log(req.query);
  return res.json(data.visits);
});*/

app.get("/api/v1/visit/doctor/:doctorId", (req, res) => {
    const doctorId = parseInt(req.params.doctorId,10);
    console.log('doctorId: ',doctorId);
    if(isNaN(req.params.doctorId))    {
        return res.status(400).json({error: "Invalid Id."});
    }
    let visits = data.visits.sort((a,b) => (a.doctorId>b.doctorId)?1:((b.doctorId>a.doctorId)? 1:0))
    .filter((visit) => visit.doctorId === parseInt(doctorId, 10));

    console.log(visits);
    return res.json(visits);
});

app.get("/api/v1/visit/patient/:patientId", (req, res) => {
    const patientId = parseInt(req.params.patientId,10);
    console.log('patientId: ',patientId);
    if(isNaN(req.params.patientId))    {
        return res.status(400).json({error: "Invalid Id."});
    }
    let visits = data.visits.sort((a,b) => (a.patientId>b.patientId)?1:((b.patientId>a.patientId)? 1:0))
    .filter((visit) => visit.patientId === parseInt(patientId, 10));

    console.log(visits);
    return res.json(visits);
});

app.get("/api/v1/visits", (req, res) => {
  const { doctorId, patientId } = req.query;

  //console.log('doctorId: ',doctorId);
  //console.log('patientId: ',patientId);

  const isInvalidId = (id) => {
    if(doctorId != null) {
        if(isNaN(doctorId)) {
            return true;
        }
    }
    if(patientId != null) {
        if(isNaN(patientId)) {
            return true;
        }
    }
    return false;
    //return id!= null && !Number.isNaN(parseInt(id));
  }

  if (isInvalidId(req.params.id)) {
    return res.status(400).json({ error: "Invalid doctor or patient id." });
  }

  let visits = [];
  //res.json(data.visits);

  if (doctorId && patientId) {
    visits = data.visits.filter(
      (visit) =>
        visit.doctorId === parseInt(doctorId, 10) &&
        visit.patientId === parseInt(patientId, 10)
    );
    //console.log('visits: ',visits);
  } else if (doctorId) {
    /*visits = data.visits.filter(
      (visit) => visit.doctorId === parseInt(doctorId, 10)
    );*/
    visits = data.visits.sort((a,b) => (a.doctorId>b.doctorId)?1:((b.doctorId>a.doctorId)? 1:0))
            .filter((visit) => visit.doctorId === parseInt(doctorId, 10));

  } else if (patientId) {
    // the below is not working because the array is not sorted based on patientid
    /*visits = data.visits.filter(
      (visit) => visit.patientId === parseInt(patientId, 10)
    );*/
    visits = data.visits.sort((a,b) => (a.patientId>b.patientId)?1:((b.patientId>a.patientId)? 1:0))
            .filter((visit) => visit.patientId === parseInt(patientId, 10));
  } else {
      //console.log('I am here');
    //visits = data.visits;
    visits = res.json(data.visits);
    return (visits);
  }

  console.log(visits);
  return res.json(visits);
});

app.listen(port, () => {
    console.log(`listening to port ${port}`);
});

//Swagger
const expressSwaggerGenerator = require('express-swagger-generator');
const host = `localhost:${port}`;
console.log('host: ',host);
const basePath = '/'; // The forward slash is important!

// Options for the Swagger generator tool
const options = {
      // The root document object for the API specification
      // More info here: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schema
      swaggerDefinition: {
        info: {
          title: "Health Insurance API",
          description: "This is Web service for patients, doctors and visits.",
          version: "1.0.0",
        },
        host: host,
        basePath: basePath,
        produces: ["application/json"],
        schemes: ["http", "https"],
      },
      basedir: __dirname, // Absolute path to the app
      files: ["./routes/**/*.js"], // Relative path to the API routes folder to find the documentation
    };

    // Initialize express-swagger-generator and inject it into the express app
    expressSwaggerGenerator(app)(options);
