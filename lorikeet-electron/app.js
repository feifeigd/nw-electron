'use strict';

const async = require('async');
const fs = require('fs');
const osenv = require('osenv');
const path = require('path');

function getUserHomeFolder(){
    return osenv.home();
}

function getFilesInFolder(folderPath, cb){
    fs.readdir(folderPath, cb);
}

function inspectAndDescibeFile(filePath, cb){
    let result = {
        file: path.basename(filePath),
        path: filePath, 
        type: ''
    };
    fs.stat(filePath, (err, stat)=>{
        if(err)cb(err);
        else{
            if(stat.isFile())result.type = 'file';
            if(stat.isDirectory())result.type = 'directory';
            cb(err, result);
        }
    });
}

function inspectAndDescribeFiles(folderPath, files, cb){
    async.map(files, (file, asyncCb)=>{
        let resolvedFilePath = path.resolve(folderPath, file);
        inspectAndDescibeFile(resolvedFilePath, asyncCb);
    }, cb);
}

function displayFiles(err, files){
    if(err)
        return alert('Sorry, we could not display your files.');
    files.forEach((file)=>{
        console.log(file);
    });
}

function main(){
    const folderPath = getUserHomeFolder();
    getFilesInFolder(folderPath, (err, files) =>{
        if(err)
            return alert('Sorry, we could not load your home folder');
        inspectAndDescribeFiles(folderPath, files, displayFiles);
        /*files.forEach((file)=>{
            console.log(`${folderPath}/${file}`);
        });*/
    });
}

main();