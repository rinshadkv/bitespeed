"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const sequelize_1 = require("sequelize");
const contacts_1 = __importDefault(require("./models/contacts"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.post('/identify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) {
        return res.status(400).json({ error: "Either email or phoneNumber must be provided" });
    }
    try {
        const contacts = yield contacts_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { email },
                    { phoneNumber }
                ]
            }
        });
        if (contacts.length === 0) {
            const newContact = yield contacts_1.default.create({
                email,
                phoneNumber,
                linkPrecedence: 'primary'
            });
            return res.json(constructResponse(newContact, []));
        }
        let primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary');
        const secondaryContacts = contacts.filter(contact => contact.linkPrecedence === 'secondary');
        const emails = new Set(contacts.map(contact => contact.email).filter(e => e));
        const phoneNumbers = new Set(contacts.map(contact => contact.phoneNumber).filter(p => p));
        if (!primaryContact) {
            primaryContact = contacts[0];
            primaryContact.linkPrecedence = 'primary';
            yield primaryContact.save();
            for (let i = 1; i < contacts.length; i++) {
                contacts[i].linkPrecedence = 'secondary';
                contacts[i].linkedId = primaryContact.id;
                yield contacts[i].save();
                secondaryContacts.push(contacts[i]);
            }
        }
        if (email && !emails.has(email)) {
            const newSecondary = yield contacts_1.default.create({
                email,
                phoneNumber: primaryContact.phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: 'secondary'
            });
            secondaryContacts.push(newSecondary);
            emails.add(email);
        }
        if (phoneNumber && !phoneNumbers.has(phoneNumber)) {
            const newSecondary = yield contacts_1.default.create({
                email: primaryContact.email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: 'secondary'
            });
            secondaryContacts.push(newSecondary);
            phoneNumbers.add(phoneNumber);
        }
        res.json(constructResponse(primaryContact, secondaryContacts));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
function constructResponse(primaryContact, secondaryContacts) {
    return {
        contact: {
            primaryContatctId: primaryContact.id,
            emails: [primaryContact.email, ...secondaryContacts.map(contact => contact.email).filter(e => e)],
            phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber).filter(p => p)],
            secondaryContactIds: secondaryContacts.map(contact => contact.id)
        }
    };
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
