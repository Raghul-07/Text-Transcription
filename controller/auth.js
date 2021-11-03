const user = require('../model/user.model');

exports.users = async (mailId) => {
    await user.find({mailId}).then( async (result)=>{
        if(result.length===0){
            console.log('new user found')
            await user.create({mailId})
            .then(result => {
                console.log(result)
            })
            .catch(error => {console.log(error)})
        }
        else{
            console.log('user found')
        }
    })
}