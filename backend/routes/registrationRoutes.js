import express from 'express';
const router = express.Router();
import {
    registerEvent,
    getRegistrations,
    getEventSeatsInfo,
    updateEventSeats
} from '../controllers/registrationController.js';

router.route('/')
    .get(getRegistrations)
    .post(registerEvent);

router.route('/seats')
    .get(getEventSeatsInfo)
    .put(updateEventSeats);



export default router;