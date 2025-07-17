import React,{useState,useEffect} from "react";
import { Link , useNavigate } from "react-router-dom";
import M from "materialize-css";

const Signup = ()=>{
    const navigate = useNavigate()
    const[name,setName] = React.useState("");
    const[email,setEmail] = React.useState("");
    const[password,setPassword] = React.useState("");
    const[image,setImage] = useState("")
    const[url,setUrl] = useState(null);
    useEffect(()=>{
        if(url){
            uploadFields()
        }
},[url])
    const uploadImage = () =>{
        const data = new FormData();
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","dqp1kdws8")
        fetch("https://api.cloudinary.com/v1_1/dqp1kdws8/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const uploadFields =()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: 'Invalid email',classes:"#c62828 red darken-3"});
            return;
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#e53935 red darken-1"})
            } else{
                M.toast({html:data.message,classes:"#00e676 green accent-3"})
                navigate('/signin')
            }
        }).catch(err=>{
                console.log(err);
        })
    }
    const PostData = ()=>{
        if(image){
            uploadImage()
        } else {
            uploadFields()
        }
        
    }
        
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input 
                type="text"
                placeholder="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
                <input 
                type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                <div className="btn #64b5f6 blue lighten-1">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input class="file-path validate" type="text" />
                </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                onClick={()=>PostData()}
                >
                    SignUp
                </button>
                <h5>
                    <Link to="/signin">Already have an account</Link>
                </h5>
                
            </div>
        </div>
    )
}

export default Signup;