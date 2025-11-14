const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const sportsConfig = require('./sports-config.js');
const config = require('./config.js');
const cron = require('node-cron');
const e = require('express');
const app = express();
const PORT = process.env.PORT || config.port;

// Middleware
app.use(cors());
app.use(express.json());

// Job tracking
let runningJob = {};
let successfulJob = {};
let failedJob = {};
let jobIdCounter = 1;

/**
 * Execute Playwright test
 * @param {string} testFile - The test file to execute
 * @param {string} jobType - Type of job (soccer, all-sports, specific sport)
 * @returns {Object} Job information
 */
function executeTest(testFile, jobType, sportName = null) {

    // Check if a job is already running
    if (runningJob.status === 'running') {
        return {
            jobId: runningJob.jobId,
            status: 'busy',
            message: 'Server is busy, there is a job already running',
            runningJob: {
                id: runningJob.jobId,
                type: runningJob.type,
                sport: runningJob.sport,
                startTime: runningJob.startTime
            }
        };
    }

    console.log(`\n🚀 Starting job: ${jobType} ${sportName} at ${new Date()}`);
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
    
    runningJob = job;
    
    const playwrightProcess = spawn('npx', ['playwright', 'test', testFile, '--max-failures=1'], {
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
        if (code !== 0 || job.output.some(line => line.toLowerCase().includes('failed'))) {
            job.status = 'failed';
            failedJob = job;
            successfulJob = {};
            console.log(`[${jobId}] Job failed.`);
        }
        else {
            job.status = 'completed';
            successfulJob = job;
            failedJob = {};
            console.log(`[${jobId}] Job completed successfully.`);
        }
        runningJob = {};
    });
    
    // Handle errors
    playwrightProcess.on('error', (error) => {
        job.status = 'failed';
        job.error = error.message;
        job.endTime = new Date().toISOString();
        console.error(`[${jobId}] Error:`, error);
        
        runningJob = {};
        successfulJob = {};
        failedJob = job;     
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


app.get('/api/run/all', (req, res) => {
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

app.get('/stop', (req, res) => {
    try {
        runningJob = {};
        successfulJob = {};
        failedJob = {};
        const jobs = {
            running: runningJob,
            successful: successfulJob,
            failed: failedJob
        };

        res.json(jobs);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to start all sports automation',
            details: error.message
        });
    }
});


/**
 * Get / - Return the information of the last job
 */
app.get('/', (req, res) => {
    try {        
        const jobs = {
            running: runningJob,
            successful: successfulJob,
            failed: failedJob
        };

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to retrieve last job information', 
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


// Set timezone for job to Asia/Ho_Chi_Minh (GMT+7)
cron.schedule('0 5 * * *', () => {
    console.log('Run job daily at 5:00 AM GMT+7');
    const testFile = 'tests/betgenius_all_sports.spec.js';
    const result = executeTest(testFile, 'all-sports', 'All Sports');  
}, {
  scheduled: true,
  timezone: "Asia/Ho_Chi_Minh" 
});

// schedule a cron job every minute for retry purpose
cron.schedule('* * * * *', () => {
    if(failedJob.status === 'failed') {
        runningJob = {};
        successfulJob = {};
        console.log('Rerun failed job:', failedJob.id);
        const testFile = 'tests/betgenius_all_sports.spec.js';
        executeTest(testFile, 'all-sports', 'All Sports');  
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 BetGenius Automation API Server`);

    console.log(`\nAvailable endpoints:`);
    console.log(`  POST   /api/run/all    - Run all sports automation`);
    console.log(`  GET    /health         - Health check`);
    console.log(`  GET    /               - Get last job information`);
    console.log(`\n✅ Ready to accept requests!\n`);
});

module.exports = app;
