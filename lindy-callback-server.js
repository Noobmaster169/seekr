import express from 'express';

// Replace these with your actual webhook URL and secret
const WEBHOOK_URL = 'https://public.lindy.ai/api/v1/webhooks/lindy/f2232fd4-fb7a-49ca-8f58-410762349fe6';
const WEBHOOK_SECRET = '5d1249ddd4cc9eb3d4420ff133bd9ecd63cf485714a842184452eba116ddf884';

// Store latest results in memory
let latestResults = null;

// Create Express server to receive callbacks
const app = express();
app.use(express.json());

// Enable CORS for extension to fetch results
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.post('/callback', (req, res) => {
    console.log('✅ Received response from Lindy:');
    console.log(JSON.stringify(req.body, null, 2));
    
    // Store the latest results
    latestResults = {
        ...req.body,
        receivedAt: new Date().toISOString()
    };
    
    // Process the results
    if (req.body.products) {
        console.log(`\n📦 Found ${req.body.products.length} products:`);
        req.body.products.forEach(product => {
            console.log(`  - ${product.name}: ${product.price}`);
            console.log(`    Link: ${product.link}`);
        });
    }
    
    // Log summary and notes if present
    if (req.body.summary) {
        console.log(`\n📝 Summary: ${req.body.summary}`);
    }
    if (req.body.notes) {
        console.log(`\n📋 Notes: ${req.body.notes}`);
    }
    
    res.json({ status: 'received' });
});

// Endpoint to get latest results
app.get('/results', (req, res) => {
    if (latestResults) {
        res.json(latestResults);
    } else {
        res.json({ status: 'no_results', message: 'No results received yet' });
    }
});

app.get('/', (req, res) => {
    res.send('Callback server is running. Send POST requests to /callback');
});

// Start callback server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Callback server running on http://localhost:${PORT}`);
    console.log(`📡 Send POST requests to http://localhost:${PORT}/callback`);
    console.log(`\n💡 To expose publicly, run: npx ngrok http ${PORT}`);
});

// Export for use in other files
export { WEBHOOK_URL, WEBHOOK_SECRET };

