const mongoose = require('mongoose');

const WorkingHourSchema = new mongoose.Schema({
  open: { type: String, required: false, default: '' },
  close: { type: String, required: false, default: '' },
  active: { type: Boolean, default: false }
}, { _id: false });
const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
});

const GymSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: Number, required: true },
  image: { type: String },

  workingHours: {
    Monday: { type: WorkingHourSchema, required: true },
    Tuesday: { type: WorkingHourSchema, required: true },
    Wednesday: { type: WorkingHourSchema, required: true },
    Thursday: { type: WorkingHourSchema, required: true },
    Friday: { type: WorkingHourSchema, required: true },
    Saturday: { type: WorkingHourSchema, required: true },
    Sunday: { type: WorkingHourSchema, required: true },
  },

  equipment: { type: [EquipmentSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Gym', GymSchema);
