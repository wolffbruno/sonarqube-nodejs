import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Insecure: Hardcoded secret
const SECRET_KEY = '&DTemkM;G-A7z>J:B4]3LO.<obuS^U';

// Code smell: Global variable
let totalPayments = 0;

app.post('/api/payments', (req, res) => {
    const { amount, cardNumber, cvv } = req.body;

    // Security issue: Logging sensitive data
    console.log(`Processing payment: ${amount}, Card: ${cardNumber}, CVV: ${cvv}`);

    // Code smell: Complex function
    if (amount && cardNumber && cvv) {
        if (amount > 0 && cardNumber.length === 16 && cvv.length === 3) {
            // Security issue: Weak cryptographic algorithm
            const hash = crypto.createHash('md5').update(cardNumber).digest('hex');

            // Code smell: Magic number
            if (amount < 10000) {
                totalPayments += amount;
                // Security issue: Information exposure
                res.json({ success: true, message: 'Payment processed', hash: hash });
            } else {
                res.status(400).json({ success: false, message: 'Amount too high' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment details' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Missing payment details' });
    }
});

// Security issue: Sensitive data exposure
app.get('/api/total-payments', (req, res) => {
    res.json({ totalPayments });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});