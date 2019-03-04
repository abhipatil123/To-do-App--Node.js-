var bodyParser = require('body-parser');

var data = [{item: 'Do coding'}, {item: 'Update Resume'}, {item: 'Leetode grinding'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

var monk = require('monk');
var db = monk('localhost:27017/TODO');

module.exports = function(app){
    
    app.get('/todo', function(req, res){
        //Get data from database and pass it to view
        var collection = db.get('todos');
        collection.find({}, function(err, todos){
            if (err) throw err;
            res.render('todo', {todos : todos});
        });
        // res.render('todo', {todos : data});
    });

    app.post('/todo', urlencodedParser, function(req, res){ 
        var collection = db.get('todos');
        collection.insert({
            item: req.body.item,
        }, function(err, item){
            if (err) throw err;
            data.push(item);
            res.json(item);
        });
    });

    app.delete('/todo/:item', function(req, res){
        var collection = db.get('todos');
        collection.remove({ _id: req.params.id }, function(err, todos){
            if (err) throw err;
            data = data.filter(function(todos){
                todos.item.replace(/ /g, '-') !== req.params.item;
            });
            res.json(data);
        });
    });
};