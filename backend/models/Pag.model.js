import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  category: { type: String, required: true },
});

const Pag = mongoose.model('Pag', pageSchema);

export default Pag;
