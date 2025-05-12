import Registration from '../models/Registration.js';
import EventConfig from '../models/EventConfig.js';

export const registerEventService = async ({ firstName, lastName, phoneNumber, res }) => {
    // Check if event config exists
    const eventConfig = await EventConfig.findOne();
    if (!eventConfig) {
        eventConfig = await EventConfig.create({ totalSeats: 100 });
    }

    // check if the phone number is already registered
    const existingRegistration = await Registration.findOne({ phoneNumber });
    if (existingRegistration) {
        res.status(400);
        throw new Error('Phone number already registered');
    }

    // Check if seats are available
    const registeredCount = await Registration.countDocuments();
    if (registeredCount >= eventConfig.totalSeats) {
        res.status(400);
        throw new Error('No seats available');
    }

    // Create registration
    const registration = await Registration.create({
        firstName,
        lastName,
        phoneNumber
    });

    return registration;


};
export const searchRegistrations = async ({ search, sortBy, order, page = 1, limit = 10 }) => {
    // Define allowed fields for sorting
    const allowedSortFields = ['firstName', 'lastName', 'registeredAt'];

    // Build query
    let query = {};
    if (search) {
        query = {
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
            ]
        };
    }

    // Build sort options
    let sortOptions = {};
    if (sortBy) {
        // Check if sortBy is in allowed fields
        if (!allowedSortFields.includes(sortBy)) {
            throw new Error(`Invalid sort field. Allowed fields are: ${allowedSortFields.join(', ')}`);
        }
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
        sortOptions = { registeredAt: -1 }; // Default sort by registration date desc
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Registration.countDocuments(query);

    // Get paginated results
    const registrations = await Registration
        .find(query)
        .select('firstName lastName phoneNumber registeredAt')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

    return {
        data: registrations,
        pagination: {
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getRemainingSeats = async (res) => {
    const eventConfig = await EventConfig.findOne();
    if (!eventConfig) {
        res.status(404);
        throw new Error('Event configuration not found');
    }
    const registeredCount = await Registration.countDocuments();
    const remainingSeats = eventConfig.totalSeats - registeredCount;
    return {
        remainingSeats,
        totalSeats: eventConfig.totalSeats
    };
};

export const updateEventSeats = async (totalSeats) => {
    // check if the total seats is greater than 0
    if (totalSeats <= 0) {
        throw new Error('Total seats must be greater than 0');
    }

    // check if the total seats is an integer
    if (!Number.isInteger(totalSeats)) {
        throw new Error('Total seats must be an integer');
    }

    const eventConfig = await EventConfig.findOne();
    if (!eventConfig) {
        throw new Error('Event configuration not found');
    }

    eventConfig.totalSeats = totalSeats;
    await eventConfig.save();
};

