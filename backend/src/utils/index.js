'use strict'

//để return infordata 
const _ = require('lodash')

const getInfoData = ({ fildes = [], object = {} }) => {
    return _.pick(object, fildes)
}

module.exports = {
    getInfoData
}