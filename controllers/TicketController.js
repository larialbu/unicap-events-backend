const knex = require('../database/knex');
  
  module.exports = {
  
    getAllTickets: (req, res) => {
      knex('tickets')
        .select('*')
        .then(tickets => {
          res.status(200).json(tickets);  
        })
        .catch(err => {
          res.status(400).send(err);
        });
    },
  
    createTicket: (req, res) => {
      const newTicket = req.body;
      knex('tickets')
        .insert(newTicket)
        .then(() => {
          res.status(201).send();
        })
        .catch(err => {
          res.status(400).send(err);  
        });
    },
  
    getTicket: (req, res) => {
      knex('tickets')
        .where({id: req.params.id})  
        .first()
        .then(ticket => {
          if(!ticket) {
            return res.status(404).send();
          }
          res.status(200).json(ticket);
        })
        .catch(err => {
          res.status(400).send(err);
        });
    },
  
    updateTicket: (req, res) => {
      knex('tickets')
        .where({id: req.params.id})
        .update(req.body)
        .then(() => {
          res.status(200).send();
        })
        .catch(err => {
          res.status(400).send(err);  
        });
    },
  
    deleteTicket: (req, res) => {
      knex('tickets')
        .where({id: req.params.id})
        .del()
        .then(ticket => {
          if(!ticket) {
            return res.status(404).send();
          }
          res.status(200).send();
        })
        .catch(err => {
          res.status(400).send(err);
        });
    }
  
  }
  