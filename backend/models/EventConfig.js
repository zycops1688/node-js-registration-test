import mongoose from 'mongoose';

const EventConfigSchema = new mongoose.Schema({
    totalSeats: {
        type: Number,
        required: true,
        default: 100
    }
});

const EventConfig = mongoose.model('EventConfig', EventConfigSchema);
export default EventConfig;
