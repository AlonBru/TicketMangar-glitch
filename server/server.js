// DD NOT convert to relative paths, glitch doesn't seem to like it very much
const express = require('express');
const fs = require('fs').promises;

const app = express();
const path = 'server/data.json';
function checkHttps(request, response, next) {
    // Check the protocol — if http, redirect to https.
    if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
      return next();
    } else {
      response.redirect("https://" + request.hostname + request.url);
    }
  }
  
  app.all("*", checkHttps)
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get('/ping',(req,res) => {
    res.send('pong')
})
app.get('/api/tickets', async (req, res)=> {
    const tickets = JSON.parse(await fs.readFile("server/data.json",'utf-8'));
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
    const tickets = JSON.parse(await fs.readFile("server/data.json",'utf-8'));
    const changedArray= tickets.map(ticket => {
        if(ticket.id===req.params.ticketId){
            ticket.done=true;        }
        return ticket;
    })
    const json= JSON.stringify(changedArray,null,2)
    await fs.writeFile('server/data.json',json)
    res.send({updated:true})
})
app.post('/api/tickets/:ticketId/undone', async (req, res)=> {
    const tickets = JSON.parse(await fs.readFile("server/data.json",'utf-8'));
    const changedArray= tickets.map(ticket => {
        if(ticket.id===req.params.ticketId){
            ticket.done=false; 
        }
        return ticket;
    })
    const json= JSON.stringify(changedArray,null,2)
    await fs.writeFile('server/data.json',json)
    res.send({updated:true})
})
app.post('/api/tickets/:ticketId/undone', async (req, res)=> {
    const tickets = JSON.parse(await fs.readFile("server/data.json",'utf-8'));
    tickets[req.params.id].done=false;
    let json= JSON.stringify(tickets,null,2);
    await fs.writeFile('server/data.json',json)
    res.send(`tickets[req.params.id].done`)
})
module.exports = app;

let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});