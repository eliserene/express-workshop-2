var express = require("express");
var fs = require("fs");
var formidable = require("express-formidable");

var app = express();

app.use(express.static("public"));
app.use(formidable());

app.post('/create-post', function(request, response) {
    var now = Date.now();
    
    var newPost = {
        timestamp: now,
        content: request.fields.blogpost,
        mood: request.fields.mood
    }
    
    fs.readFile(__dirname+'/data/posts.json', function(error, data) {
        if(error) {
            console.log('Error reading posts.json: ' + error);
            response.status(500);
            response.send(error);
        } else {
            var posts = JSON.parse(data);
            posts.blogposts.push(newPost);
            var updatedData = JSON.stringify(posts);
            
            fs.writeFile(__dirname + '/data/posts.json', updatedData, function(error) {
                if(error) {
                    console.log('Error reading posts.json: ' + error);
                    response.status(500);
                    response.send(error);
                } else {
                    response.send(newPost);
                }
            });        
        }
    });
    
});

app.get('/get-posts', function(request, response) {
    fs.readFile(__dirname+'/data/posts.json', function(error, data) {
        if(error) {
            console.log('Error reading posts.json: ' + error);
            response.status(500);
            response.send(error);
        } else {
            response.send(data.toString());
        }
    });
});

app.delete('/delete-post/:timestamp', function(request, response) {
    var ts = request.params.timestamp;
    
    fs.readFile(__dirname+'/data/posts.json', function(error, data) {
        if(error) {
            console.log('Error reading posts.json: ' + error);
            response.status(500);
            response.send(error);
        } else {
            var posts = JSON.parse(data);
            
            posts.blogposts = posts.blogposts.filter(function(p) {
                return p.timestamp != ts;
            });
            
            var updatedData = JSON.stringify(posts);
            
            fs.writeFile(__dirname + '/data/posts.json', updatedData, function(error) {
                if(error) {
                    console.log('Error reading posts.json: ' + error);
                    response.status(500);
                    response.send({ "success": false });
                } else {
                    response.send({ "success": true });
                }
            });
        }
    });
});

app.listen(8080, function() {
    console.log('The server has started and is listening on port 8080');
});