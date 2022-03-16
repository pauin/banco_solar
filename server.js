const express = require ('express')
const{ insertar, tablauser, editar, eliminar, transferir, tablatransferencia } = require ('./db.js')

const app = express()
app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.json({todo:'ok'})
})

app.post('/usuario', async(req, res)=>{
    let body=""
    req.on('data', (data) => body+=data)
    req.on('end', async ()=>{
        body = JSON.parse(body)
        await insertar(body.nombre, body.balance)
        res.json({todo:'ok'})
    })
})

app.get('/usuarios', async (req, res)=>{

    const user = await tablauser()
    //console.log(req.query)
    res.json(user)
})

app.put('/usuario', async (req, res)=>{
    let body=""
    req.on('data', (data)=>body +=data)
    req.on('end', async ()=>{
        body =JSON.parse(body)
        await editar(body.id, body.name, body.balance)
        //console.log(body.name)
        res.status(201).json({todo:'ok'})
    })
})

app.delete('/usuario', async (req, res)=>{
    let id = req.query.id
    await eliminar(id)
    res.send({todo:'ok'})
})

app.post('/transferencia', async(req, res)=>{
    let body=""
    req.on('data', (data)=>body+=data)
    req.on('end', async ()=>{
        body =JSON.parse(body)
        await transferir((body.emisor), (body.receptor), (body.monto))
        //console.log(body) /* me trae la transferencia que he realizado body */
        res.json({todo:'ok'})
    })
})

app.get('/transferencias', async (req, res)=>{
    const user = await tablatransferencia()
    res.json(user)
    //console.log(user) /* me trae todas las trasnferencias */
})


app.listen(3000, ()=> console.log ("servidor ejecutando en puerto 3000"))