const client = require('../config/connection');
let objectId = require('mongodb').ObjectId;
const config = require('../config/config');
const collections = require("../config/collections");
const { response } = require('express');



module.exports = {
    doPost: (postData) => {
        return new Promise(async (resolve, reject) => {
            const postObject = JSON.parse(postData.userData);
            const postDetais = {
                postOwnerId: postObject._id,
                postOwnerName: postObject.username,
                time: postData.formattedDate,
                currentLocation: postData.currentLocation,
                videoData: postData.videoData.assets[0],
                permission: false
            }
            await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).insertOne(postDetais).then((response) => {
                if (response) {
                    resolve({ status: "success", id: `${response.insertedId}` });
                }
            }).catch((error) => {
                console.log(error)
                resolve({ status: "fail", message: "Something went wrong , Try again later" })
            })
        })
    },

    getPosts: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).aggregate([
                    { $match: { permission: true } },
                    { $project: { id: { $toString: "$_id" } } }
                ]).toArray()
                const ids = result.map(doc => doc.id);
                resolve(ids)
            } catch (error) {
                console.log(error)
                resolve({ status: "fail", message: "Something went wrong, Please try ahain later" })
            }

        })
    },

    getProfilePosts: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                    const posts = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).aggregate([
                { $match: { postOwnerId: userId } },
                { $project: { id: { $toString: "$_id" } } }
            ]).toArray()
            const ids = posts.map(doc => doc.id);
            console.log(ids)
            if(ids){
                resolve(ids)
            }
            } catch (error) {
                resolve({status:'fail' , message:"Something went wrong"})
            }
        })
    }
}