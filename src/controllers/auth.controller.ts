import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { HTTPStatus } from '../helper/HttpStatus';
import config from '../config';

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, firstName, lastName, mobileNumber, password } = req.body;

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            res.status(HTTPStatus.BAD_REQUEST).json({ message: 'Email already exists' });
            return;
        }

        const existingUserByMobile = await User.findOne({ mobileNumber });
        if (existingUserByMobile) {
            res.status(HTTPStatus.BAD_REQUEST).json({ message: 'Mobile number already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const activationToken = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '1d' });

        const newUser = new User({
            email,
            firstName,
            lastName,
            mobileNumber,
            password: hashedPassword,
            activationToken,
        });

        await newUser.save();
        const activationLink = `http://localhost:${config.PORT}/auth/activate/${activationToken}`;
        res.status(HTTPStatus.OK).json({
            message: 'Signup successful! Copy the link below to activate your account:',
            activationLink: activationLink,
        });

    } catch (error) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

export const activateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const decodedToken: any = jwt.verify(token, config.JWT_SECRET);

        // Find user by email
        const user = await User.findOne({ email: decodedToken.email });

        if (!user) {
            res.status(HTTPStatus.NOT_FOUND).json({ 
                message: 'User not found'
            });
            return;
        }

        if (user.isActivated) {
            res.status(HTTPStatus.BAD_REQUEST).json({ 
                message: 'Account already activated'
            });
            return;
        }

        user.isActivated = true;
        await user.save();

        res.status(HTTPStatus.OK).json({ 
            message: 'Account activated successfully! You can now log in.'
        });
    } catch (error) {
        console.error(error);
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ 
            message: 'Invalid or expired activation link'
        });
    }
}

export const logIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(HTTPStatus.NOT_FOUND).json({
                message: "User not found"
            });
            return;
        }

        if (!user.isActivated) {
            res.status(HTTPStatus.BAD_REQUEST).json({
                message: "User account not activated"
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(HTTPStatus.BAD_REQUEST).json({
                message: "Invalid credentials"
            });
            return;
        }

        res.status(HTTPStatus.OK).json({
            message: "Login successful!"
        });
    } catch (error) {
        console.error(error);
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
            message: "Error during login"
        });
    }
};