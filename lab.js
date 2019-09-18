let mongoose = require ('mongoose');
let express = require ('express');
let app = express();
let bodyParser = require('body-parser');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

let viewsPath = __dirname + "/views/";

app.use(express.static('css'));
app.use(express.static('images'))

let Developers = require('./models/developers');
let Tasks = require('./models/tasks');

let url = "mongodb://localhost:27017/tasksdb";

mongoose.connect(url, function(err){
    if (err) { 
        throw err;
    }
    console.log('Successfully connected');
});

app.use(bodyParser.urlencoded({extended:false}));

// app.get('/adddeveloper/:firstName/:lastName/:level/:state/:suburb/:street/:unit', function(req,res){
//     let D = new Developers ({
//         _id: new mongoose.Types.ObjectId,
//         name: {
//             firstName: req.params.firstName,
//             lastName: req.params.lastName   
//         },
//         level: req.params.level,
//         address: {
//             state: req.params.state,
//             suburb: req.params.suburb,
//             street: req.params.street,
//             unit: req.params.unit
//         }
//     })

//     D.save(function(err){
//         if (err) {
//             console.log(err);
//         }
//     })
// });

app.post('/newdeveloper', function(req,res){
    let D = new Developers ({
        _id: new mongoose.Types.ObjectId,
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName   
        },
        level: req.body.level,
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: parseInt(req.body.unit)
        }
    })

    D.save(function(err){
        if (err) {
            console.log(err);
            res.send('there is an error');
        }

    res.redirect('/listdevelopers');
    });
});

app.get('/newdeveloper', function(req,res){
    res.sendFile(viewsPath + "newdeveloper.html");
});

app.get('/listdevelopers', function(req,res){
    Developers.find({}).exec(function (err, data) {
        res.render('listdevelopers', { developers: data });
    // Developers.find().exec(function(err,data){
    //     res.send(data);
    });
});

// app.get('/newtasks/:taskName/:assignTo/:dueDate/:taskStatus/:taskDescription', function(req,res){
//     let id = getnewRandomId();
//     let T = new Tasks  ({
//         taskId: id,
//         taskName: req.params.taskName,
//         assignTo: mongoose.Types.ObjectId(req.params.assignTo),
//         dueDate: req.params.dueDate,
//         taskStatus: req.params.taskStatus,
//         taskDescription: req.params.taskDescription
//     })

//     T.save(function(err){
//         if (err) {
//             console.log(err);
//         }
//     });

// });

app.post('/newtask', function(req,res){
        let id = getnewRandomId();
    let T = new Tasks  ({
        taskId: id,
        taskName: req.body.taskName,
        assignTo: mongoose.Types.ObjectId(req.body.assignTo),
        dueDate: new Date(req.body.dueDate),
        taskStatus: req.body.taskStatus,
        taskDescription: req.body.taskDescription
    })

    T.save(function(err){
        if (err) {
            console.log(err);
            res.send('there is an error');
        }

    res.redirect('/listtasks');
    });

});

app.get('/newtask', function(req,res){
    res.sendFile(viewsPath+"newtask.html");
});

app.get('/fourtasks', function(req,res){
    // let id = getnewRandomId();
    let taskone = {taskId: getnewRandomId(), taskName: 'taskone', assignTo: '5d783dedf26a203b841f1994', dueDate: '11-09-2019', taskStatus: 'complete', taskDescription: 'testing'};
    let tasktwo = {taskId: getnewRandomId(), taskName: 'tasktwo', assignTo: '5d783dedf26a203b841f1994', dueDate: '11-09-2019', taskStatus: 'complete', taskDescription: 'testing'};
    let taskthree = {taskId: getnewRandomId(), taskName: 'taskthree', assignTo: '5d783dedf26a203b841f1994', dueDate: '11-09-2019', taskStatus: 'complete', taskDescription: 'testing'};
    let taskfour = {taskId: getnewRandomId(), taskName: 'taskfour', assignTo: '5d783dedf26a203b841f1994', dueDate: '11-09-2019', taskStatus: 'complete', taskDescription: 'testing'};

    Tasks.insertMany([taskone, tasktwo, taskthree, taskfour], function(err, doc){
        console.log(doc);
        res.redirect('/listtasks');
    });
});

app.get('/test', function(req,res){
    Developers.findOne({level: 'BEGINNER'}, 'id', function(err,developers){
    console.log(developers);
    });
});

app.get('/listtasks', function(req,res){
    Tasks.find({}).exec(function (err, data) {
    res.render('listtasks', { tasks: data });
    // Tasks.find().exec(function(err,data){
    // res.send(data);
    });
});

function getnewRandomId(){
    let id;
    id = Math.round(Math.random()*1000);
    //we need a random ID from 1 - 1000 not 1 - 10 
    return id;
};

app.post('/deletetasks', function (req,res){
    // let del = {taskid:{taskid:req.body.taskid}};
    // req.body return the req params as string instead of int, we have to parse it through int
    let del = {taskId: parseInt(req.body.taskId)};
    Tasks.deleteOne(del, function(err, doc){
        console.log(doc);
        //check if the return object obj contains the number of deleted documents. 
        res.redirect('/listtasks');
    });
});

app.get('/deletetasks', function(req,res){
    res.sendFile(viewsPath+"deletetasks.html");
});

// app.get('/deletecomplete', function(req,res){
//     Tasks.deleteMany({taskStatus: 'complete'}, function(err, doc){
//         console.log(doc);
//         res.redirect('/listtasks');
//     });
// });

app.get('/deletecomplete', function(req,res){
    Tasks.deleteMany({taskStatus: 'complete'}).exec();
        res.redirect('/listtasks');
    });



app.post('/updatetasks', function(req,res){
    let upd = {taskId:parseInt(req.body.taskId)};
    let upd1 = {$set: {taskStatus:req.body.taskStatus}}; 
    Tasks.updateOne(upd, upd1, function(err,doc){
    console.log(doc);
    res.redirect('/listtasks');
    });
});

app.get('/updatetasks', function(req,res){
    res.sendFile(viewsPath+"updatetasks.html");
})

app.get('/', function(req,res){
    res.sendFile(viewsPath+"index.html");
});

app.get('/deletedevelopers', function(req,res){
    Developers.deleteMany({}, function (err, doc) {
        console.log(doc);
        res.redirect('/listdevelopers');
    })
});

app.listen(8080);

//git clone <enter respotitory> 
//http://35.201.29.153:8080/ 

