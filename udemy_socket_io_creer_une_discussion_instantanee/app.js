// Modules
const express  = require('express');
const http     = require('http');
const socketio = require('socket.io');
const morgan   = require('morgan');
const config   = require('./config');

// Variables globales
const app    = express();
const server = http.Server(app);
const io     = socketio(server);
const port     = config.express.port;
const options = {
    root: __dirname + '/views'
}
let usernames = [];

// Middlewares
app.use(morgan('dev'));
app.use(express.static(options.root))

// Routes
app.get('/', (req, res) => {
    res.redirect('/home');
})

app.get('/home', (req, res) => {
    res.sendFile('index.html', options )
})

app.get('/params/:name', (req, res) => {
    res.send(req.params.name)
})

io.on('connection', function (socket) {

    console.log('a user connected : ' + socket.id);

    // Traitement pour l'assignation d'un username
    socket.on('setUsername', (usernameWanted) => {

        // Traitement de la chaine de caractères
        usernameWanted = usernameWanted.trim()

        // Vérification de l'unicité de l'username
        let usernameTaken = false
        for (let socketid in usernames) {
            if (usernames[socketid] == usernameWanted)
                usernameTaken = true
        }

        let timeFakeLoading = 1000
        setTimeout(() => {

            // Traitement final
            if (usernameTaken) {
                socket.emit('rejectUsername', usernameWanted)
            } else {
                socket.join('users', () => {
                    usernames[socket.id] = usernameWanted
                    socket.emit('acceptUsername', usernameWanted)
                })
            }

        }, timeFakeLoading);

    })

    // Déconnexion de l'utilisateur
    socket.on('disconnect', () => {
        console.log('disconnected' + socket.id)
        if (usernames[socket.id]) {
            delete usernames[socket.id]
            console.log('username deleted')
        }
    })

});

// Lancement de l'application
server.listen(port, () => console.log('Server started on port ' + port))