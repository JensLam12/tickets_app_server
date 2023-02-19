const lblDesktop = document.querySelector('h1');
const btnAttend = document.querySelector('button');
const lblAttend = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendients = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams( window.location.search);

if(!searchParams.has('escritorio') ) {
    window.location = 'index.html';
    throw new Error("El escritorio es obligatorio");
}

const escritorio = searchParams.get("escritorio");
lblDesktop.innerText = "Escritorio " + escritorio;
divAlert.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAttend.disabled = false;
})

socket.on('disconnect', () => {
    btnAttend.disabled = true;
})

socket.on('pendient-tickets', ( payload ) => {
    if( payload == 0 ) {
        lblPendients.style.display = 'none';
    } else {
        lblPendients.style.display = '';
        lblPendients.innerText = payload;
    }
    
})

btnAttend.addEventListener( 'click', () => {

    socket.emit( 'attend-ticket', {escritorio}, ({ok, ticket, msg} ) => {
      
        if(!ok) {
            lblAttend.innerText = 'Nadie'
            return divAlert.style.display = '';
        } 

        console.log(ticket);
        lblAttend.innerText = "Ticket " + ticket.number;
        
    });

})