
const config = require("./config.js");
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function uploadAllFiles(){
    const files = fs.readdirSync(config.downloadDir);
    for (const file of files) {
        if (file.endsWith('.xlsx')) {
            await uploadFile(path.join(config.downloadDir, file));
        }
    }
}

async function uploadFile(filePath) {
    const url = new URL(`${config.infoSite.uploadUrl}`);        
    const service_name = filePath.includes('sc.xlsx') ? 'agn' : 'agnos';
    const fileName = path.basename(filePath);
    console.log(`Starting upload file: ${fileName}`);
    const form = new FormData();
    form.append('service_name', service_name);
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

module.exports = { uploadFile, uploadAllFiles };