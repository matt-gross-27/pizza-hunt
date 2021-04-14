const { Pizza } = require('../models');

const pizzaController = {
  // READ all pizzas
  getAllPizza(req, res) {
    Pizza.find({})
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // READ one pizza
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No pizza found with this id.' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // CREATE pizza
  createPizza({ body }, res) {
    Pizza.create(body)
      .then(data => res.json(data))
      .catch(err => res.status(400).json(err));
  },

  // UPDATE pizza by id
  updatePizza({ params, body }, res) {
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No pizza found with this id.'})
          return;
        }
        res.json(data);
      })
      .catch(err => res.status(400).json(err));
  },

  // DELETE pizza
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No pizza found with this id.'})
          return;
        }
        res.json(data);
      })
      .catch(err => res.status(400).json(err));
  }
};

module.exports = pizzaController;