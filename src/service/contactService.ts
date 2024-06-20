import { Op } from 'sequelize';
import Contact from '../models/contacts';

export const identifyContact = async (email?: string, phoneNumber?: string) => {
    const contacts = await Contact.findAll({
        where: {
            [Op.or]: [
                { email },
                { phoneNumber }
            ]
        }
    });

    if (contacts.length === 0) {
        const newContact = await Contact.create({
            email,
            phoneNumber,
            linkPrecedence: 'primary'
        });
        return constructResponse(newContact, []);
    }

    let primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary');
    const secondaryContacts = contacts.filter(contact => contact.linkPrecedence === 'secondary');

    const emails = new Set(contacts.map(contact => contact.email).filter(e => e));
    const phoneNumbers = new Set(contacts.map(contact => contact.phoneNumber).filter(p => p));

    if (!primaryContact) {
        primaryContact = contacts[0];
        primaryContact.linkPrecedence = 'primary';
        await primaryContact.save();

        for (let i = 1; i < contacts.length; i++) {
            contacts[i].linkPrecedence = 'secondary';
            contacts[i].linkedId = primaryContact.id;
            await contacts[i].save();
            secondaryContacts.push(contacts[i]);
        }
    }

    if (email && !emails.has(email)) {
        const newSecondary = await Contact.create({
            email,
            phoneNumber: primaryContact.phoneNumber,
            linkedId: primaryContact.id,
            linkPrecedence: 'secondary'
        });
        secondaryContacts.push(newSecondary);
        emails.add(email);
    }

    if (phoneNumber && !phoneNumbers.has(phoneNumber)) {
        const newSecondary = await Contact.create({
            email: primaryContact.email,
            phoneNumber,
            linkedId: primaryContact.id,
            linkPrecedence: 'secondary'
        });
        secondaryContacts.push(newSecondary);
        phoneNumbers.add(phoneNumber);
    }

    return constructResponse(primaryContact, secondaryContacts);
};

function constructResponse(primaryContact: Contact, secondaryContacts: Contact[]) {
    return {
        contact: {
            primaryContatctId: primaryContact.id,
            emails: [primaryContact.email, ...secondaryContacts.map(contact => contact.email).filter(e => e)],
            phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber).filter(p => p)],
            secondaryContactIds: secondaryContacts.map(contact => contact.id)
        }
    };
}
