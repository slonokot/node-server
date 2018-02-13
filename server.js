const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;
const logfile = '/server.log';
var logInfo = 'INFO';
var logWarn = 'WARNING';

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

//  using midleware
app.use((req, res, next) => {
    res.render('maintenance.hbs', {
        pageTitle: 'Maintenance!',
        maintenanceMessage: 'We are on maintenance, will be back soon!'
    });

});
// If we want put every request to the server to go through to some function and stop there
// We can add midleware function without next(), that will render the response.
// For that reason every other midleware used as the express.static() bellow should
// be put after the custom one.
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(`[${logInfo}]: ${log}`);
    fs.appendFile(logfile, log + '\n', () => {
        if (!logfile) {
            console.log(`[${logWarn}]: Cannot write to ${logfile}.`)
        }
    });
    next();
});
//

app.get('/maintenance.html', (req, res) => {
    res.render('maintenance.hbs', {
        pageTitle: 'Maintenance!',
        maintenanceMessage: 'We are on maintenance, will be back soon!'
    });
});


hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('<h1>Hello World!</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home Page!',
        welcomeMessage: 'Hello there!',
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page!',
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: "Error handling request"
    })
});


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
