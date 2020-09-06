const data = require('../data');
const port = process.env.PORT  || 4002;

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
app.get('/api/v1/doctors/:id',(req,res) => {
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

app.post('/api/v1/get', (req,res) => {
    if(!req.body.name)  {
        return res.status(400).json({error: 'Doctor needs a new Parameter.'});
    }

    const nextId = data.doctors.length+1;
    const doctor = {id: nextId, name: req.body.name};

    data.doctors.push(doctor);
    res.status(201).json(doctor);   // 201 status code means resource created

});


app.listen(port, () => {
    console.log(`listening to port ${port}`);
});
