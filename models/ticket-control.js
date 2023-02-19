const path = require('path');
const fs = require('fs');

class Ticket {
    constructor( number, desktop) {
        this.number = number;
        this.desktop = desktop;
    }
}

class TicketControl {

    constructor() {
        console.log("constructor");
        this.last = 0;
        this.currentDay = new Date().getDate();
        this.tickets = [];
        this.lastFourTickets = [];
        this.init();
    }

    init() {
        try {
            const { last, currentDay, tickets, lastFourTickets } = require( '../db/data.json');
        
            if( currentDay == this.currentDay ) {
                this.tickets = tickets;
                this.lastFourTickets = lastFourTickets;
                this.last = last;
            } else {
                this.saveDB();
            }
        }catch(exception) {
            this.saveDB();
        }
        
    }

    get toJSON() {
        return{
            last: this.last,
            currentDay: this.currentDay,
            tickets: this.tickets,
            lastFourTickets: this.lastFourTickets
        }
    }

    saveDB() {
        const dbPath = path.join( __dirname, '../db/data.json');
        fs.writeFileSync( dbPath, JSON.stringify( this.toJSON) );
    }

    next() {
        this.last += 1;
        const ticket = new Ticket( this.last, null );
        this.tickets.push( ticket );

        this.saveDB();
        return 'Ticket ' + this.last;
    }

    attend( desktop ) {
        if( this.tickets.length == 0 ) return null;

        const ticket = this.tickets.shift();  // const ticket = this.tickets[0];
        ticket.desktop = desktop;
        this.lastFourTickets.unshift( ticket );

        if( this.lastFourTickets > 4) this.lastFourTickets.splice(-1, 1);
        this.saveDB();

        return ticket;
    }
}

module.exports = TicketControl;