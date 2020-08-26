import React,{Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const app=new Clarifai.App({
  apiKey:'b56c9c7b369a43d9a04b395cee551278'
})
const particlesOptions={
  particles: {
    number:{
      value:100,
      density:{
        enable:true,
        value_area:800
      }
    }
  }
}
class App extends Component{
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false,
      user:{
        email:'',
        id:'',
        name:'',
        entries:0,
        joined:''
      }
    }
  }

  loadUser=(data)=>{
    this.setState(
      {
        user:{
          id:data.id,
          name:data.name,
          email:data.email,
          entries:data.entries,
          joined:data.joined
      }
    }
    )
  }

  calculateFaceLocation=(data)=>{
    const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    return {
     leftCol:clarifaiFace.left_col * width,
     topRow:clarifaiFace.top_row * height,
     rightCol:width-(clarifaiFace.right_col*width),
     bottomRow:height-(clarifaiFace.bottom_row*height)
    }
  }

  displayFaceBox=(box)=>{
    this.setState({box:box});
  }
  
  onInputChange=(event)=>{
    this.setState({input:event.target.value});
  }
  
  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response=>this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err=>console.log(err));
  }

  onRouteChange=(route)=>{
    if(route==='signout'){
      this.setState({isSignedIn:false});
    }else if(route==='home'){
      this.setState({isSignedIn:true});
    }
    this.setState({route:route});
  }
  
  render(){
    const {isSignedIn,imageUrl,route,box}=this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route==='home'
        ? <div> 
            <Logo />
            <Rank />
            <ImageLinkForm onButtonSubmit={this.onButtonSubmit} onInputChange={this.onInputChange}/>
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
        : (
          route==='signin'
          ? <Signin onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
        )
        
      }
      </div>
    );
  }
}

export default App;
