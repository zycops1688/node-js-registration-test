class RegistrationRequestDTO {
    constructor(data) {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phoneNumber = data.phoneNumber;
    }

    validate() {
        if (!this.firstName || !this.lastName || !this.phoneNumber) {
            throw new Error('Please provide all required fields');
        }

        if (typeof this.firstName !== 'string' || typeof this.lastName !== 'string') {
            throw new Error('First name and last name must be strings');
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(this.phoneNumber)) {
            throw new Error('Phone number must be 10 digits');
        }

        if (this.firstName.length < 2 || this.firstName.length > 50) {
            throw new Error('First name must be between 2 and 50 characters');
        }

        if (this.lastName.length < 2 || this.lastName.length > 50) {
            throw new Error('Last name must be between 2 and 50 characters');
        }

        return this;
    }
}

export default RegistrationRequestDTO;
