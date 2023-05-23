'use strict'
const mongoose = require('mongoose')
const os = require('os')
const _SECONDS = 50000 //50s
const process = require('process')

//count connect
const countConnect = () =>{
    const numConnection = mongoose.connections.length
    console.log(`Number of connections:${numConnection}`)
}

//check over load
const checkOverload = () =>{
    setInterval ( () => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        //Example maxinum number of connections based on number osf cores
        const maxConnectons = numCores * 5;

        console.log(`Active Connection: ${numConnection}`)
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)
        if(numConnection > maxConnectons) {
            console.log(`Connection overload detected!`)
        }

    }, _SECONDS) //Monitor every 5s
}

module.exports ={
    countConnect,
    checkOverload
}