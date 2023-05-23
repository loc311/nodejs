'use strict'

const mongoose = require('mongoose')


// const { db: {host, name, port}} = require('../configs/conf.mongodb')

// const connectString = `mongodb://${host}:${port}/${name}`;

const connectString ="mongodb://127.0.0.1/shopDEV"

const { countConnect }= require ('../helpers/check.connect')

console.log(`connectStringMongo: `,connectString)
class Database {

  constructor() {
    this.connect()
  }

  //connect
  connect(type = 'mongodb') {

    if(1 ===1 ) {
      mongoose.set('debug', true)
      mongoose.set('debug',{color : true})
    }

    mongoose.connect(connectString,{
      maxPoolSize:50 //để giới hạn user vào connect
    }).then( () =>{
      console.log(`Connected Mongodb`, countConnect())
    })
    .catch(err => console.log(`Error Connect!`, countConnect()))
  }

  static getInstance() {
    if(!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb