const express = require('express');
const fs = require('fs').promises;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get('/ping',(req,res) => {
    res.send('pong')
})
app.get('/api/tickets', async (req, res)=> {
    const tickets = JSON.parse(await fs.readFile("./data.json",'utf-8'));
    if(req.query.searchText){
        const query= req.query.searchText
        
        const queryRegex = new RegExp(query, 'i'); 
        let results= tickets.filter(ticket =>queryRegex.test(ticket.title))
        
        res.send(results)
    }else{
        res.send(tickets)
    }
})

app.post('/api/tickets/:ticketId/done', async (req, res)=> {
    const tickets = JSON.parse(await fs.readFile("./data.json",'utf-8'));
    const changedArray= tickets.map(ticket => {
        if(ticket.id===req.params.ticketId){
            ticket.done=true;        }
        return ticket;
    })
    const json= JSON.stringify(changedArray,null,2)
    await fs.writeFile('./data.json',json)
    res.send({updated:true})
})
app.post('/api/tickets/:ticketId/undone', async (req, res)=> {
    const tickets = JSON.parse(await fs.readFile("./data.json",'utf-8'));
    const changedArray= tickets.map(ticket => {
        if(ticket.id===req.params.ticketId){
            ticket.done=false; 
        }
        return ticket;
    })
    const json= JSON.stringify(changedArray,null,2)
    await fs.writeFile('./data.json',json)
    res.send({updated:true})
})
app.post('/api/tickets/:ticketId/undone', async (req, res)=> {
    const tickets = JSON.parse(await fs.readFile("./data.json",'utf-8'));
    tickets[req.params.id].done=false;
    let json= JSON.stringify(tickets,null,2);
    await fs.writeFile('./data.json',json)
    res.send(`tickets[req.params.id].done`)
})
module.exports = app;
