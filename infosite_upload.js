
const config = require("./config.js");
const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const fs = require('fs');
const FormData = require('form-data');
    
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function login() {
    const url = new URL(`${config.infoSite.url}/info_backend/login/proc`);
    const username = config.infoSite.username;
    const password = config.infoSite.password;
    const payload = `username=${username}&password=${password}`;
    
    const response = await client.post (url.toString(), payload, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const cookies = await jar.getCookies(url.toString());
    console.log("Cookies after login:", cookies);
}

async function uploadFile(filePath) {
    const url = new URL(`${config.infoSite.url}/info_backend/upload/proc`);        
    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    
    try {
        const response = await client.post(url.toString(), form, {
            headers: {
                ...form.getHeaders(),
            },
        });
        
        console.log(`Successfully uploaded file: ${filePath}`);
        return {
            success: true,
            statusCode: response.status,
            data: response.data
        };
    } catch (error) {
        console.error(`Failed to upload file ${filePath}:`, error.message);
        throw error;
    }
}

if (require.main === module) {
    login()
        .then((result) => { console.log("Login Result:", result); })
        .catch((error) => { console.error("Login Error:", error); });
}

module.exports = { login, uploadFile };