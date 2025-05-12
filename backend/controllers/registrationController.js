import asyncHandler from 'express-async-handler';
import {
    searchRegistrations, registerEventService, getRemainingSeats,
    updateEventSeats as updateEventSeatsService
} from '../services/registrationService.js';
import RegistrationRequestDTO from '../dtos/RegistrationRequestDTO.js';

// @desc    Register for event
// @route   POST /api/registrations
// @access  Public
export const registerEvent = asyncHandler(async (req, res) => {
    const { firstName, lastName, phoneNumber } = req.body;

    // Validate request body
    const registrationDTO = new RegistrationRequestDTO(req.body);
    registrationDTO.validate();

    const registration = await registerEventService({
        firstName,
        lastName,
        phoneNumber,
        res
    });

    res.status(201).json(registration);
});

// @desc    Get all registrations
// @route   GET /api/registrations
// @access  Public
export const getRegistrations = asyncHandler(async (req, res) => {
    const { search, sortBy, order, page = 1, limit = 10 } = req.query;

    try {
        const registrations = await searchRegistrations({ search, sortBy, order, page, limit });
        res.json(registrations);
    } catch (error) {
        res.status(400);
        throw error;
    }
});


// @desc    Get remaining seats
// @route   GET /api/registrations/remaining-seats
// @access  Public
export const getEventSeatsInfo = asyncHandler(async (req, res) => {
    const seatsInfo = await getRemainingSeats(res);
    res.json(seatsInfo);
});

// @desc    Update event seats
// @route   PUT /api/registrations/seats
// @access  Public
export const updateEventSeats = asyncHandler(async (req, res) => {
    const { totalSeats } = req.body;
    const updatedSeats = await updateEventSeatsService(totalSeats);
    res.json(updatedSeats);
});
