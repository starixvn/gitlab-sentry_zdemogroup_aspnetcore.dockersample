
const config = require("./config.js");
const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
    
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function uploadFile(filePath) {
    const url = new URL(`${config.infoSite.uploadUrl}`);        
    
    const fileName = path.basename(filePath);
    console.log(`Starting upload file: ${fileName}`);
    const form = new FormData();
    form.append('service_name', 'agn');
    form.append('is_upload_excel', 'true');
    form.append('file', fs.createReadStream(filePath), {
        filename: fileName, // Name of the file being sent (important)
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Giả định là file Excel (.xlsx)
    });
    try {
        // 5. Setup request header
        const response = await axios.post(url, form, {
            headers: {                
                ...form.getHeaders(),                                 
                'Cookie': 'InfoSite_UserId=699; InfoSite_UserName=Nexcel1',
            },            
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`Progress of uploading file: ${percentCompleted}%`);
            }
        });

        console.log(`\nUpload successful! Status: ${response.status}`);
        return response.data;

    } catch (error) {
        console.error('Error during upload:', error.message);
        // Print detailed error response from server (if any)
        if (error.response) {
            console.error('Status Code:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
        throw error;
    }
}

if (require.main === module) {
    uploadFile("C:/BG/BG-01-06-2026sc.xlsx")
        .then((result) => { console.log("Upload Result:", result); })
        .catch((error) => { console.error("Upload Error:", error); });
}

module.exports = { login, uploadFile };