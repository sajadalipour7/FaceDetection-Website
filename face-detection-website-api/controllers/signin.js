const handleSignin=(req,res,db,bcrypt)=>{
	const {email,password}=req.body;
	if(!email || !password){
		return res.status(400).json('incorrect form submission');
	}
	/**
	 * This way is synchrounos
	 */
	db.select('email','hash').from('login')
	.where('email','=',req.body.email)
	.then(data=>{
		// console.log(data);
		const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
		if(isValid){
			return db.select('*').from('users')
			.where('email','=',req.body.email)
			.then(user=>{
				res.json(user[0])
			})
			.catch(err=>res.status(400).json("unable to get user"));
		}else{
			res.status(400).json("wrong credentials!");
		}
		
	})
	.catch(err=>res.status(400).json('wrong credentials!'));
	/**
	 * This way is asynchronos
	 */
	// // Load hash from your password DB.
	// const hsh="$2a$10$hWawU9Iu1pbW4GHBCX8uaeSFtzPNDJx4YP8b/fwdNQ.7se/gVopIK";
	// bcrypt.compare("apples", hsh, function(err, res) {
	// 	// res == true
	// 	console.log('first guess',res);
	// });
	// bcrypt.compare("veggies", hsh, function(err, res) {
	// 	console.log('first guess',res);
	// });
	// if(req.body.email===database.users[0].email &&
	// 	req.body.password===database.users[0].password){
	// 		// res.json('Success');
	// 		res.json(database.users[0]);
	// 	}else{
	// 		res.status(400).json('Error logging in!');
	// 	}
}

module.exports={
    handleSignin:handleSignin
}