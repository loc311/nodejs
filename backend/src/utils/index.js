'use strict'

//để return infordata 
const _ = require('lodash')

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
module.exports = {
    getInfoData,
    getSelcetData,
    unGetSelcetData
}