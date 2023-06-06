const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  owner: String,
  title: String,
  wilaya: String,
  comun: String,
  street: String,
  photos: [String],
  description: String,
  perks: [String],
  apartementType: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
  price: Number,
 
  reservedDates: [{
    type: Date,
    default: []
  }],
  reserver: {type: Boolean, default: false}
});

placeSchema.path('reservedDates').set((dates)=>{
  if(Array.isArray(dates) && dates.length===0){
    dates.push(new Date('1111-05-08'))
  }
  return dates;
})

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;