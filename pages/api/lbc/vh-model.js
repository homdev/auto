const mongoose = require('mongoose');

const voitureSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  prix: {
    type: String,
    required: true,
  },
  annee: {
    type: String,
    required: true,
  },
  kilometrage: {
    type: String,
    required: true,
  },
  carburant: {
    type: String,
    required: true,
  },
  boite: {
    type: String,
    required: true,
  },
});

const Voiture = mongoose.model('Voiture', voitureSchema);

module.exports = Voiture;
