//zmienne, stałe

var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku

app.use(express.static('static'))

var path = require("path")

var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));


let users = [
    { id: '1', login: 'AAA', password: 'PASS1', age: '12', uczen: 'on', plec: 'M' },
    { id: '2', login: 'BBB', password: 'PASS2', age: '15', uczen: 'off', plec: 'K' },
    { id: '3', login: 'CCC', password: 'PASS3', age: '11', uczen: 'on', plec: 'K' },
    { id: '4', login: 'DDD', password: 'PASS4', age: '16', uczen: 'off', plec: 'M' },
]

var Loged = false;

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"));
})


app.get("/main", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"))
    console.log(__dirname)
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"))
    console.log(__dirname)
})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"))
    console.log(__dirname)
})

app.get("/admin", function (req, res) {
    if (Loged) {
        res.sendFile(path.join(__dirname + "/static/adminLoged.html"))
    }
    else {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
        console.log(__dirname)
    }

})

app.post("/register", function (req, res) {

    var tenSamNick = false;
    //sprawdzenie czy jest taki sam user
    for (var i = 0; i < users.length; i++) {
        if (users[i].login == req.body.login) {
            var body = "już jest taki user";
            tenSamNick = true;
            res.send(body);
        }
    }



    if (tenSamNick == false) {
        if (req.body.uczen == undefined) {
            req.body.uczen = "off";
        }
        var licznik = users.length + 1;
        req.body.id = licznik.toString();

        console.log(req.body)
        var user = req.body.login;

        res.send("Witaj " + user + " na stronie!");
        users.push(req.body);
    }

})

app.post("/login", function (req, res) {
    console.log(req.body.login);
    console.log(req.body.password);

    var nickLog = req.body.login;
    var passLog = req.body.password;
    var nickGit = false;
    var numerNick;

    //sprawdzenie czy jest taki user
    for (var i = 0; i < users.length; i++) {
        if (users[i].login == nickLog) {
            console.log("istnieje");
            nickGit = true;
            numerNick = i;
        }
    }

    if (nickGit) {
        if (users[numerNick].password == passLog) {
            console.log("zalogowano");
            Loged = true;
            res.redirect("/admin")

        }
        else {
            console.log("złe hasło")
            res.send("złe hasło")
        }
    }
    else {
        console.log("nie ma takiego usera")
        res.send("nia ma takiego usera")
    }
})

app.get("/logout", function (req, res) {

    res.redirect("/main")
    Loged = false;
})

app.get("/show", function (req, res) {
    if (Loged) {
        var string = '<head><link rel="stylesheet" href="css/style.css"><style> *{background-color:black} </style></head>   <body><a href="/sort" class="menuLink">sort</a> <a href="/gender" class="menuLink">gender</a> <a href="/show" class="menuLink">show</a><br><br><br>'

        var table = "<table>"

        for (var i = 0; i < users.length; i++) {
            var checkbox
            if (users[i].uczen == "on") {
                checkbox = '<input type="checkbox" disabled="true" checked>'
            }
            else {
                checkbox = '<input type="checkbox" disabled="true"></input>'
            }

            var th = "<tr><th>id: " + users[i].id + "</th><th>user: " + users[i].login + " - " + users[i].password + "</th><th>uczeń: " + checkbox + "</th><th>wiek: " + users[i].age + "</th><th>płeć: " + users[i].plec + "</th></tr>"
            table = table + th;
        }
        table = table + "</table></body>"
        string = string + table

        res.send(string)
    }
    else {
        res.redirect("/admin")
    }
})

app.get("/gender", function (req, res) {
    if (Loged) {
        var string = '<head><link rel="stylesheet" href="css/style.css"><style> *{background-color:black} </style></head>   <body><a href="/sort" class="menuLink">sort</a> <a href="/gender" class="menuLink">gender</a> <a href="/show" class="menuLink">show</a><br><br><br>'

        var mezczyzni = []
        var kobiety = []

        for (var i = 0; i < users.length; i++) {
            if (users[i].plec == "K") {
                kobiety.push(users[i])
            }
            else {
                mezczyzni.push(users[i])
            }
        }

        var table = "<table>"

        for (var i = 0; i < kobiety.length; i++) {
            var th = "<tr><th class='gender'>id: " + kobiety[i].id + " </th><th class='gender'>płeć: " + kobiety[i].plec + " </th></tr>"
            table = table + th;
        }
        table = table + "</table><br><br><br><table>"

        for (var i = 0; i < mezczyzni.length; i++) {
            var th = "<tr><th class='gender'>id: " + mezczyzni[i].id + " </th><th class='gender'>płeć: " + mezczyzni[i].plec + " </th></tr>"
            table = table + th;
        }
        table = table + "</table></body>"
        string = string + table

        res.send(string)
    }
    else {
        res.redirect("/admin")
    }
})


app.get("/sort", function (req, res) {
    if (Loged) {
        var string2 = '<head><link rel="stylesheet" href="css/style.css"><style> *{background-color:black} </style></head>   <body><a href="/sort" class="menuLink">sort</a> <a href="/gender" class="menuLink">gender</a> <a href="/show" class="menuLink">show</a><br><br><br>'
        var radio = '<form onchange="this.submit()" action="/sort" method="POST"><input type="radio" checked name="sorting" value="ros"><label class="SortingRadio">rosnąco</label><input type="radio" name="sorting" value="mal"><label class="SortingRadio">malejący</label></form>'
        string2 = string2 + radio
        string = ""

        users.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        });
        var table = "<table>"

        for (var i = 0; i < users.length; i++) {


            var th = "<tr><th class='inne'>id: " + users[i].id + "</th><th class='user'>user: " + users[i].login + " - " + users[i].password + "</th><th class='inne'>wiek: " + users[i].age + "</th></tr>"
            table = table + th;
        }
        table = table + "</table></body>"
        string = string + table

        string2 = string2 + string

        res.send(string2)
        table = ""
        string2 = ""

    }
    else {
        res.redirect("/admin")
    }
})
app.post("/sort", function (req, res) {
    var string2 = '<head><link rel="stylesheet" href="css/style.css"><style> *{background-color:black} </style></head>   <body><a href="/sort" class="menuLink">sort</a> <a href="/gender" class="menuLink">gender</a> <a href="/show" class="menuLink">show</a><br><br><br>'
    var radio = '<form onchange="this.submit()" action="/sort" method="POST"><input type="radio" name="sorting" value="ros"><label class="SortingRadio">rosnąco</label><input type="radio" name="sorting" value="mal"><label class="SortingRadio">malejący</label></form>'
    string2 = string2 + radio
    string = ""


    if (req.body.sorting == "ros") {
        users.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        });
        console.log(users)


    }

    if (req.body.sorting == "mal") {
        users.sort(function (a, b) {
            return parseFloat(b.age) - parseFloat(a.age);
        });

        console.log(users)
    }
    var table = "<table id='test'>"

    for (var i = 0; i < users.length; i++) {


        var th = "<tr><th class='inne'>id: " + users[i].id + "</th><th user class='user'>user: " + users[i].login + " - " + users[i].password + "</th><th class='inne'>wiek: " + users[i].age + "</th></tr>"
        table = table + th;
    }
    table = table + "</table></body>"
    string = string + table

    string2 = string2 + string

    res.send(string2)

})



//nasłuch na określonym porcie

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

