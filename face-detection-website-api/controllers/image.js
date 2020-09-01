const handleImage=(req,res,db)=>{
	const {id}=req.body;
	db('users').where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries=>{
		res.json(entries[0]);
	})
	.catch(err=>{
		res.status(400).json("unable to get entries");
	});
	// let found=false;
	// database.users.forEach(user=>{
	// 	if(user.id===id){
	// 		found=true;
	// 		user.entries++;
	// 		return res.json(user.entries);
	// 	}
	// })
	// if(!found){
	// 	res.status(400).json('not found');
	// }
}

module.exports={
    handleImage:handleImage
}