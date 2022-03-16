//const { ClientRequest } = require('http');
const {Pool} = require ('pg')

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "bancosolar",
    password: "1234",
    port: "5432",
    max: 20,
    min:2,
    idleTimeoutSeMillis: 5000,
    connectiontIMEOURTmillis: 2000
});

async function insertar(nombre, balance){
    const client = await pool.connect()
    try{
        if(balance==null){
            console.log("ingrese datos numericos")
            return
        }
        const {rows} = await client.query({
            text:`insert into usuarios(nombre, balance) values ($1, $2)`,
            values:[nombre, balance]
        })
        return rows[0]
    }catch(error){ 
        console.log(error)
    }  
    client.release()
}

async function tablauser(){
    const client= await pool.connect()
    const {rows} = await client.query(`select * from usuarios`)
    client.release()
    return rows
}

async function editar(id, nombre, balance){
    const client = await pool.connect()
    try{
        if(nombre==""){
            console.log("ingrese nombre usuario")
            return
        }
        const {rows} = await client.query({
            text:`update usuarios set nombre =$2, balance=$3 where id=$1`,
            values: [id, nombre, balance]
        })
        return rows[0]
    }catch(error){
        if(error.code == '22P02'){
            console.log("no puede dejar campos vacios")
        }else{
            console.log(error)
        }
    }
    client.release()
}

async function eliminar(id){
    const client = await pool.connect()
    try{
        await client.query({
            text:`delete from usuarios where id=$1 returning*`,
            values:[id]
        })
    }catch(error){
        if( error.code == '23503'){
            console.log("no puede eliminar a un cliente que ha hecho transferencias")
        }else{
        console.log(error)}
    }
    client.release()
}
//----------------------------------------------------------transferencia---------------------------
async function transferir(nombre_emisor, nombre_receptor, monto){
    const client= await pool.connect()
    try{
        //emisor
        const {rows}= await client.query({
            text:'select * from usuarios where nombre = $1',
            values:[nombre_emisor]
        })
        let emisor= rows[0]
        const id_emisor = rows[0].id
        const menos= rows[0].balance
        const saldo_emisor = parseInt(menos) - monto
        
        if(monto<rows[0].balance){
            await client.query({
                text:'update usuarios set balance=$2 where id=$1',
                values:[id_emisor, saldo_emisor]
            });
            //receptor
            const resp = await client.query({
                text:'select * from usuarios where nombre = $1',
                values: [nombre_receptor]
            })
            const receptor=resp.rows[0]
            const id_receptor= resp.rows[0].id
            const mas= resp.rows[0].balance
            const saldo_receptor= parseInt(mas) + parseInt(monto)
                await client.query({
                    text:'update usuarios set balance=$2 where id=$1',
                    values:[id_receptor, saldo_receptor]
                })
                await client.query({
                    text: `insert into transferencias (emisor, receptor, monto) values ($1, $2, $3)`,
                    values:[emisor.id, receptor.id, monto]
                })
        }else{
            console.log("ingrese datos validos")
        }
    }catch(error){
        console.log(error)
    }
    client.release()
}


async function tablatransferencia(){
    const client = await pool.connect()
    const {rows} = await client.query({
        text: `select fecha, (select nombre from usuarios WHERE id = emisor) AS emisor, (SELECT nombre FROM usuarios WHERE id = receptor) AS receptor, monto FROM transferencias`,
        rowMode: 'array'
    })
    client.release()
    return rows
}

module.exports={insertar, tablauser, editar, eliminar, transferir, tablatransferencia}