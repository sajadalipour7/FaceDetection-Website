const handleProfileGet=(req,res,db)=>{
	const {id}=req.params;
	// let found=false;
	db.select('*').from('users')
	.where(
		//Or we can say:
		//{id:id}
		{id}
	)
	.then(user=>{
		// console.log(user[0]);
		if(user.length){
			res.json(user[0]);
		}else{
			res.status(400).json('Not found');
		}
	})
	.catch(err=>res.status(400).json('error getting user'));

}

module.exports={
    handleProfileGet:handleProfileGet
}