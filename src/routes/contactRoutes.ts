import { Router, Request, Response } from 'express';
import * as contactService from '../service/contactService';

const router = Router();

router.post('/identify', async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: "Either email or phoneNumber must be provided" });
    }

    try {
        const response = await contactService.identifyContact(email, phoneNumber);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
