'use strict'

const { filter, update } = require("lodash")
const keytokenModel = require("../models/keytoken.model")
const { Types } = require('mongoose')
class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // //cach 1
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey :null

            //cach 2
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = { upsert: true, new: true }
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne(id)
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean()
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({ user: userId })
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken })
    }
}

module.exports = KeyTokenService