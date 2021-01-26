
const JournalService = {

    //check use of .and here
    getPost(db,user_name){
        return db
            .select('*')
            .from('user_posts')
            .where({user_name})
           
    },
    getPostById(db,id){
        return db
            .select('*')
            .from('user_posts')
            .where({id})
    },
    createPost(db,newPost){
        return db
            .insert( newPost )
            .into ('user_posts')
            .returning('*')
            .then( result => {
                return result[0]
            })
    },
    deletePost(db,id){
        return db
            .select('*')
            .from('user_posts')
            .where({id})
            .delete()
    },
    updatePost(db,id, fieldsToUpdate){
        return db
            .select('*')
            .from('user_posts')
            .where({id})
            .update(fieldsToUpdate)


    }





}

module.exports = { JournalService }