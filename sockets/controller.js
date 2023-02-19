const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {

    socket.emit( 'last-ticket', ticketControl.last );
    socket.emit( 'current-state', ticketControl.lastFourTickets );
    socket.emit( 'pendient-tickets', ticketControl.tickets.length );

    socket.on('next-ticket', ( payload, callback ) => {
        const next = ticketControl.next();
        callback(next);

        socket.broadcast.emit( 'pendient-tickets', ticketControl.tickets.length );
    })

    socket.on('attend-ticket', ( {escritorio }, callback ) => {

        if(!escritorio) {
            return callback({
                ok: false,
                msg: 'The desktop is required'
            });
        }

        const ticket = ticketControl.attend(escritorio);
        socket.broadcast.emit( 'current-state', ticketControl.lastFourTickets );
        socket.broadcast.emit( 'pendient-tickets', ticketControl.tickets.length );
        socket.emit( 'pendient-tickets', ticketControl.tickets.length );

        if( !ticket ) {
            callback({
                ok: false,
                msg: 'There are no pendients tickets'
            });
        } else {
            callback({
                ok: true,
                ticket: ticket
            });
        }
    })

}

module.exports = {
    socketController
}

