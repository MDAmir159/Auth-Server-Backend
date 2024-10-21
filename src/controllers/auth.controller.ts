import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import User from '../models/user.model';
import { HTTPStatus } from '../helper/HttpStatus';
import config from '../config';

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, firstName, lastName, mobileNumber, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const activationToken = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '1d' });

        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        const newUser = new User({
            email,
            firstName,
            lastName,
            mobileNumber,
            password: hashedPassword,
            activationToken,
        });

        await newUser.save();
        const activationLink = `http://localhost:${config}/api/activate/${activationToken}`;
        const msg = {
            to: email,
            from: 'islamamirul497@gmail.com',
            subject: 'Account Activation',
            html: `<h3>Click the link below to activate your account:</h3><a href="${activationLink}">Activate Account</a>`,
        };
        await sgMail.send(msg);

        res.status(HTTPStatus.OK).send('Signup successful! Check your email to activate your account.');

    } catch (error) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

export const logIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !user.isActivated) {
            res.status(HTTPStatus.BAD_REQUEST).send('User not found or account not activated');
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(HTTPStatus.BAD_REQUEST).send('Invalid credentials');
            return;
        }

        res.status(HTTPStatus.OK).send('Login successful! Random text: Welcome to your dashboard.');
    } catch (error) {
        console.error(error);
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Error during login');
    }
};