const express = require ('express')
const{ insertar, tablauser, editar, eliminar, transferir, tablatransferencia} = require ('./db.js')
const app = express()
app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.status(201).json({todo:'ok'})
})

app.post('/usuario', async(req, res)=>{
    let body=""
    req.on('data', (data) => body+=data)
    req.on('end', async ()=>{
        body = JSON.parse(body)
        await insertar(body.nombre, body.balance)
        res.status(201).json({todo:'ok'})
    })
})

app.get('/usuarios', async (req, res)=>{
    const user = await tablauser()
    res.status(201).json(user)
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
    console.log("eliminado")
    res.send({todo:'ok'})
})

app.post('/transferencia', async(req, res)=>{
    let body=""
    req.on('data', (data)=>body+=data)
    req.on('end', async ()=>{
        body =JSON.parse(body)
        await transferir((body.emisor), (body.receptor), (body.monto))
        res.status(201).json({todo:'ok'})
    })
})

app.get('/transferencias', async (req, res)=>{
    const user = await tablatransferencia()
    res.status(201).json(user)
})

app.listen(3000, ()=> console.log ("servidor ejecutando en puerto 3000"))