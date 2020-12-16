
const JournalService = {

    //check use of .and here
    getPost(db,user,date){
        return('db')
            .select('*')
            .from('user_posts')
            .where({user, date})
           
    },
    createPost(db,newPost){
        return('db')
            .insert( newPost )
            .into ('user_posts')
            .returning('*')
            .then( result => {
                return result[0]
            })
    },
    deletePost(db, id){
        return('db')
            .where({id})
            .delete()
    },
    updatePost(db,id, fieldsToUpdate){
        return('db')
            .where({id})
            .update(fieldsToUpdate)


    }





}