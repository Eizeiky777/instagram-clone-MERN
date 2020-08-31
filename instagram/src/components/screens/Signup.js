import React, { useState, useEffect } from 'react';
import {  Row, Col, Card, Button } from 'react-materialize';
import M from 'materialize-css';
import { Link, useHistory } from 'react-router-dom';

import './Signup.css';

const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    const uploadPic = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta_mern")
        data.append("cloud_name", "dqiespxo9")
        fetch("https://api.cloudinary.com/v1_1/dqiespxo9/image/upload", {
            method:"post",
            body:data
        })
        .then(res => res.json())
        .then(data => {
            setUrl(data.url)
            
        })
        .catch(err => {
            console.log(err)
            return
        })

    }

    const uploadFields = () => {
        // validate email pattern
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }else{
                M.toast({html: data.message,classes:"#43a047 green darken-1"})
                history.push('/login')
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    const PostData = () => {
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
    }

    return(
        <>
            <div>
                <Row>
                    <Col
                        m={12}
                        s={12}
                    >
                        <div className="myCard">
                        <Card className="auth-card">
                            <h2>Instagram</h2>
                            <input 
                                type="text"
                                placeholder="name"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input 
                                type="text"
                                placeholder="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input 
                                type="password"
                                placeholder="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="file-field input-field">
                                <div className="btn #64b5f6 blue darken-2 white-text">
                                    <span>Upload</span>
                                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" placeholder="Upload picture profile" />
                                </div>
                            </div>
                            <Button
                                className="#64b5f6 blue lighten-2 white-text"
                                flat
                                node="button"
                                style={{
                                marginRight: '5px'
                                }}
                                waves="light"
                                onClick={() => PostData()}
                            >
                                SIGNUP
                            </Button>
                            <h6>
                                <Link to='/login'  className="black-text" >Already have an account ?</Link>
                            </h6>
                        </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Signup;