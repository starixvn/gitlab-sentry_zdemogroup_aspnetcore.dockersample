const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const { exec } = require('child_process'); // Import exec
const path = require('path');
const fs = require('fs');
const sportsConfig = require('./sports-config.js');
const config = require('./config.js');

const app = express();
const PORT = process.env.PORT || config.port;

// Middleware
app.use(cors());
app.use(express.json());

// Job tracking
const jobs = new Map();
let jobIdCounter = 1;

/**
 * Execute Playwright test
 * @param {string} testFile - The test file to execute
 * @param {string} jobType - Type of job (soccer, all-sports, specific sport)
 * @returns {Object} Job information
 */
function executeTest(testFile, jobType, sportName = null) {
    const jobId = `job-${jobIdCounter++}`;
    const timestamp = new Date().toISOString();
    
    const job = {
        id: jobId,
        type: jobType,
        sport: sportName,
        status: 'running',
        startTime: timestamp,
        output: [],
        error: null
    };
    
    jobs.set(jobId, job);
    
    const playwrightProcess = spawn('npx', ['playwright', 'test', testFile], {
        cwd: __dirname,
        shell: true,
        env: { ...process.env }
    });
    
    // Capture stdout
    playwrightProcess.stdout.on('data', (data) => {
        const output = data.toString();
        job.output.push(output);
        console.log(`[${jobId}] ${output}`);
    });
    
    // Capture stderr
    playwrightProcess.stderr.on('data', (data) => {
        const output = data.toString();
        job.output.push(output);
        console.error(`[${jobId}] ${output}`);
    });
    
    // Handle process completion
    playwrightProcess.on('close', (code) => {
        job.status = code === 0 ? 'completed' : 'failed';
        job.endTime = new Date().toISOString();
        job.exitCode = code;
        
        // Check for downloaded files
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const dateStr = `${day}-${month}-${year}`;
        
        const bgDir = config.downloadDir;
        if (fs.existsSync(bgDir)) {
            const files = fs.readdirSync(bgDir);
            const todayFiles = files.filter(f => f.includes(dateStr));
            job.downloadedFiles = todayFiles;
        }
        
        console.log(`[${jobId}] Process exited with code ${code}`);
    });
    
    // Handle errors
    playwrightProcess.on('error', (error) => {
        job.status = 'failed';
        job.error = error.message;
        job.endTime = new Date().toISOString();
        console.error(`[${jobId}] Error:`, error);
    });
    
    return {
        jobId,
        status: 'started',
        message: `Job ${jobId} started for ${jobType}`,
        startTime: timestamp
    };
}

// Routes

/**
 * GET /api/health - Health check
 */
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'BetGenius Automation API is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * POST /api/run/soccer - Run soccer automation
 */
app.get('/api/run/soccer', (req, res) => {    
    const testFile = 'tests/betgenius_all_sports.spec.js';        
    const command = `npx playwright test ${testFile}`;
    
    res.status(200).json({
        message: `Start to run test in ${testFile}. The process is running in the background...`,
        command: command
    });

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${command}`);
            console.error(`Error code: ${error.code}`);
            console.error(`Stderr: ${stderr}`);
            return;
        }

        console.log(`Command ${command} is executed.`);
        console.log('--- stdout ---');
        console.log(stdout);
        
        if (stderr) {
            console.warn('--- stderr (Warning/Error Log) ---');
            console.warn(stderr);
        }

    });
});

/**
 * POST /api/run/all-sports - Run all sports automation
 */
app.get('/api/run/other-sports', (req, res) => {
    try {
        const testFile = 'tests/betgenius_all_sports.spec.js';
        const result = executeTest(testFile, 'all-sports', 'All Sports');
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to start all sports automation', 
            details: error.message 
        });
    }
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error', 
        details: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        path: req.path
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 BetGenius Automation API Server`);

    console.log(`\nAvailable endpoints:`);
    console.log(`  POST   /api/run/soccer        - Run soccer automation`);
    console.log(`  POST   /api/run/all-sports    - Run all sports automation`);
    console.log(`  GET    /health            - Health check`);
    console.log(`\n✅ Ready to accept requests!\n`);
});

module.exports = app;
