const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands =  new Bands();
bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del silencio'));
bands.addBand(new Band('Metallica'));

console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('mensaje', payload);
        io.emit('mensaje', {admin: 'Nuevo Mensaje 1'});
    });

    client.on('vote-band', (payload) => {
        console.log(payload);
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        console.log(payload);
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        console.log(payload);
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    // client.on('emitir-mensaje', (payload) => {
    //     console.log(payload);
    //     //io.emit('nuevo-mensaje',payload);// Emite a todos
    //     client.broadcast.emit('nuevo-mensaje',payload);// Emite a todos menos al que lo emitió
    // });
}); 