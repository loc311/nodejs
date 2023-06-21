'use strict'

//để return infordata 
const _ = require('lodash')
const {Types} = require('mongoose')

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

const getInfoData = ({ fildes = [], object = {} }) => {
    return _.pick(object, fildes)
}

//['a','b'] = {a:1,b:1}
const getSelcetData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelcetData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if(obj[k] ==null) {
            delete obj[k]
        }
    })

    return obj
}

const updateNestedObjectParse = object => {
    const final = {};
  
    Object.keys(object || {}).forEach(key => {
      if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
        const response = updateNestedObjectParse(object[key]);
  
        Object.keys(response || {}).forEach(a => {
          final[`${key}.${a}`] = response[a];
        });
      } else {
        final[key] = object[key];
      }
    });
  
    return final;
  }

module.exports = {
    getInfoData,
    getSelcetData,
    unGetSelcetData,
    removeUndefinedObject,
    updateNestedObjectParse,
    convertToObjectIdMongodb
}