const express=require('express');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt-nodejs');
const cors=require('cors');
const knex=require('knex');
const db=knex({
	client:'pg',
	connection:{
		host:'127.0.0.1',
		user:'postgres',
		password:'123456',
		database:'smart_brain'
	}
})

// db.select('*').from('users')
// .then(data=>{
// 	console.log (data);
// })
const app=express();

app.use(bodyParser.json());
app.use(cors());

const database={
	users:[
		{
			id:'123',
			name:'John',
			email:'john@gmail.com',
			password:'cookies',
			entries:0,
			joined:new Date()
		},
		{
			id:'124',
			name:'Sally',
			email:'sally@gmail.com',
			password:'bananas',
			entries:0,
			joined:new Date()
		}
	],
	// login:[
	// 	{
	// 		id:'987',
	// 		hash:'',
	// 		email:'john@gmail.com'
	// 	}
	// ]
}
app.get('/',(req,res)=>{
	res.send(database.users);
})

app.post('/signin',(req,res)=>{
	// // Load hash from your password DB.
	// const hsh="$2a$10$hWawU9Iu1pbW4GHBCX8uaeSFtzPNDJx4YP8b/fwdNQ.7se/gVopIK";
	// bcrypt.compare("apples", hsh, function(err, res) {
	// 	// res == true
	// 	console.log('first guess',res);
	// });
	// bcrypt.compare("veggies", hsh, function(err, res) {
	// 	console.log('first guess',res);
	// });
	if(req.body.email===database.users[0].email &&
		req.body.password===database.users[0].password){
			// res.json('Success');
			res.json(database.users[0]);
		}else{
			res.status(400).json('Error logging in!');
		}
})

app.post('/register',(req,res)=>{
	const {email,name,password}=req.body;
	bcrypt.hash(password, null, null, function(err, hash) {
		console.log(hash);
	});
	// database.users.push({
	// 	id:'125',
	// 	name:name,
	// 	email:email,
	// 	entries:0,
	// 	joined:new Date()
	// })
	db('users')
		.returning('*')
		.insert({
		email:email,
		name:name,
		joined:new Date()
	}).then(user=>{
		res.json(user[0]);
	})
	.catch(err=>res.status(400).json('unable to register'));
});

app.get('/profile/:id',(req,res)=>{
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

})
app.put('/image',(req,res)=>{
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
})





app.listen(3000,()=>{
	console.log('app is running on port 3000');
})


/*
/ --> res=this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/