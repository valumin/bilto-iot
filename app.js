var fs = require('fs');
var bodyPaser = require('body-parser');
var express = require('express');
var app = express();

const api_key = "xityw2crte";

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        } catch(err) {
            return cb && cb(err)
        }
    })
}

app.get('/:api_key/get/:field', (req, res) => {
    var key = req.params.api_key;
    var field = req.params.field;
    if(key != api_key){
        res.send('Error: API key is not valid');
        return;
    }
    jsonReader('data.json', (err, data) => {
        if (err) {
            console.log('Error reading file:',err);
            res.send('An error occured, please contact your system administrator.');
            return
        } else {
            data.get_count ++;
            fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
                if (err){
                    console.log('Error writing file:', err);
                    res.send('0');
                    return;
                } 
                res.send(data[field]);
            })
        }
        
    })
})

app.get('/:api_key/set/:field=:value', (req, res) => {
    var key = req.params.api_key;
    var field = req.params.field;
    var value = req.params.value;
    if(key != api_key){
        res.send('Error: API key is not valid');
        return;
    }
    jsonReader('data.json', (err, data) => {
        if (err) {
            console.log('Error reading file:',err);
            res.send('An error occured, please contact your system administrator.');
            return
        }
        data.set_count ++;
        data[field] = value;
        fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
            if (err){
                console.log('Error writing file:', err);
                res.send('0');
                return;
            } 
            res.send('1');
        })
        
    })
})

app.get('/', (req, res)=> {
    
    res.send('Incremented by one..');
})


app.listen(80, ()=>{
    console.log("Server is running..");
})