const { exec } = require('child_process');
const{ v4:uuid}=require('uuid');
const fs=require('fs');
const path=require('path');

const dirCodes=path.join(__dirname,"codes");

if(!fs.existsSync(dirCodes))
{
    fs.mkdirSync(dirCodes,{recursive:true});
}

const generatefile=async(format,content)=>
{
    const jobid=uuid();
    const filename=jobid+"."+format; //create a file with the id as name in markdown format
    const filepath = path.join(dirCodes,filename);
    await fs.writeFileSync(filepath, content);
    return filepath;
};

const executeCppBinary = (filepath, callback) => {
    // Compile the C++ code using g++
    exec(`g++ ${filepath} -o ${filepath}.exe`, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            callback(error, null);
            return;
        }
        if (stderr) {
            console.error(stderr);
            callback(stderr, null);
            return;
        }
        // If compilation is successful, execute the generated executable file
        exec(`${filepath}.exe`, (error, stdout, stderr) => {
            if (error) {
                console.error(error);
                callback(error, null);
                return;
            }
            if (stderr) {
                console.error(stderr);
                callback(stderr, null);
                return;
            }
            console.log(stdout); // Log the output to the console
            callback(null, stdout);
        });
    });
};

module.exports=
{
    generatefile,
    executeCppBinary,
};