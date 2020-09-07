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
// let's add mniddleware - cors and body-parser
const cors = require('cors');
const bodyParser = require('body-parser');

// try commenting out and see differene
app.use(bodyParser.json()).use(cors());

app.get('/', (req,resp) => resp.send('Hello World'));
app.get('/api/v1/doctors',(req,res) => res.json(data.doctors));
app.get('/api/v1/doctor/:id',(req,res) => {
    const id = parseInt(req.params.id);
    if(isNaN(req.params.id))    {
        return res.status(400).json({error: "Invalid Id."});
    }
    const doctor = data.doctors.find((doctor) => doctor.id==id);
    if(!doctor)    {
        return res.status(404).json({error: "Doctor not found."});
    }
    return res.json(doctor);
});

app.post('/api/v1/doctor', (req,res) => {
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

app.post('/api/v1/patient', (req,res) => {
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

app.get("/api/v1/visits", (req, res) => {
  const { doctorId, patientId } = req.query;

  //console.log('doctorId: ',doctorId);
  //console.log('patientId: ',patientId);

  /*const isInvalidId = (id) => {
    return Number.isNaN(parseInt(doctorId)) || Number.isNaN(parseInt(patientId));
  }

  if (isInvalidId(req.params.id)) {
    return res.status(400).json({ error: "Invalid doctor or patient id." });
  }*/

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
    visits = data.visits.filter(
      (visit) => visit.doctorId === parseInt(doctorId, 10)
    );
  } else if (patientId) {
    visits = data.visits.filter(
      (visit) => visit.patientId === parseInt(patientId, 10)
    );
  } else {
      console.log('I am here');
    //visits = data.visits;
    visits = res.json(data.visits);
    return (res.json(data.visits));
  }

  console.log(visits);
  return res.json(visits);
  /*console.log(visits.filter(
    (visit) =>
      visit.doctorId === parseInt(doctorId, 10) &&
      visit.patientId === parseInt(patientId, 10)
  ));
  return res.json(visits.filter(
    (visit) =>
      visit.doctorId === parseInt(doctorId, 10) &&
      visit.patientId === parseInt(patientId, 10)
  ));*/
});

app.listen(port, () => {
    console.log(`listening to port ${port}`);
});
