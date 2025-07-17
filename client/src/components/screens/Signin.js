import React,{useState , useContext,useReducer} from "react";
import { Link, useNavigate } from "react-router-dom";
import {UserContext} from "../../App"
import M from "materialize-css"

const Signin = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const[email,setEmail] = React.useState("");
    const[password,setPassword] = React.useState("");
    const PostData = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid email",classes:"#c62828 red darken-3"});
            return;
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error, classes:"#e53935 red darken-1"})
            } else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"signin successfully",classes:"#00e676 green accent-3"})
                navigate('/')
            }
        }).catch(err=>{
                console.log(err);
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
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
               <button className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                onClick={()=>PostData()}
                >
                    SignIn
                </button> 
                <h5>
                    <Link to="/signup">Creat an account</Link>
                </h5>
                
            </div>
        </div>
    )
}

export default Signin;