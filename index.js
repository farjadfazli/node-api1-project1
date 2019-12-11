// implement your API here
const express = require('express');
const db = require('./data/db')
const server = express();

server.use(express.json())

server.get('/api/users', async (req, res) => {
    let users = await db.find();
    if (users) {
        res.json(users);
    } else {
        res.status(500).json({errorMessage: 'The users information could not be retrieved'})
    }
})

server.get('/api/users/:id', async (req, res) => {
    let user = await db.findById(req.params.id)
    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({errorMessage: 'The user with the specified ID does not exist'})
    }
})

server.post('/api/users', async (req, res) => {
    if (!req.body.name || !req.body.bio) {
        return res.status(400).json({errorMessage: 'Please provide name and bio for the user'})
    }

    let user = {
        name: req.body.name,
        bio: req.body.bio,
    }

    let newUser = await db.insert(user);

    if (newUser) {
        res.status(201).json(user)
    } else {
        res.status(500).json({errorMessage: 'There was an error while saving the user to the database'})
    }
})

server.delete('/api/users/:id', async (req, res) => {
    let user = await db.findById(req.params.id);
    
    if (user) {
        let deletedUser = await db.remove(req.params.id);
        if (deletedUser) {
            res.status(200).json(deletedUser)
        } else {
            res.status(500).json({errorMessage: 'The user could not be removed'})
        }
    } else {
        res.status(404).json({message: 'The user with the specified ID does not exist'})
    }
})

const port = 8000;
const host = '127.0.0.1';

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`)
})