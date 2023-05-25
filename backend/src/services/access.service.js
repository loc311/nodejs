'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils/index")
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static handleRefreshTokenV2 = async ({ user, keyStore, refreshToken }) => {
        //handleRefreshToken để bảo mật tránh việc bị lấy 1 refreshToken ra sử dụng nhiều lần
        const { userId, email } = user;
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Login again, tokens been deleted')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not register')
        //check userid
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not register')

        //create 1 cặp mới
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
        //update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user,
            tokens
        }

    }


    static handleRefreshToken = async (refreshToken) => {
        //handleRefreshToken để bảo mật tránh việc bị lấy 1 refreshToken ra sử dụng nhiều lần
        //check token đã được sử dụng chưa và lôi nó ra
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({ userId, email })
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Login again, tokens been deleted')
        }

        //nếu không->tìm refreshToken
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop not register')
        //verify token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]--', { userId, email })
        //check userid
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not register')

        //create 1 cặp mới
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)
        //update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user: { userId, email },
            tokens
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey })
        return delKey
    }

    //-check email/match password 
    //- create accessToken and refreshToken
    //- generate tokens
    //- get data return  login
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop out found')

        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication error')

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })
        return {
            metadata: {
                shop: getInfoData({ fildes: ['_id', 'name', 'email'], object: foundShop }),
                tokens
            }
        }
    }

    static signUp = async ({ name, email, password }) => {

        //check if email exists?
        const holderlShop = await shopModel.findOne({ email }).lean()
        if (holderlShop) {
            throw new BadRequestError('Error: Shop already register')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            //created privateKey ->user(sign token), 
            //publicKey->system(verify token)
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     },
            // })
            //public key cryptoGraphy Standards - pkcs1

            //cách đơn giản hơn publickey vs privatekey
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            console.log({ privateKey, publicKey }) //save collection KeyStore

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                return {
                    code: 'xxx',
                    message: 'keyStore error'
                }
            }

            //created token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log(`Created Token Success: `, tokens)

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fildes: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService