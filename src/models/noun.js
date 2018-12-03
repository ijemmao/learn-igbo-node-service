import mongoose, { Schema } from 'mongoose';

const NounSchema = new Schema({
  english: { type: String, required: true },
  igbo: { type: String, required: true },
});

const Noun = mongoose.model('Noun', NounSchema);

export default Noun;