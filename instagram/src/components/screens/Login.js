import React, { useState, useContext } from 'react';
import {  Row, Col, Card, Button } from 'react-materialize';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css';

import './Login.css';

const Login = () => {
    const {dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const PostData = () => {
        // validate email pattern
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }else{
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                M.toast({html: "signed successfully",classes:"#43a047 green darken-1"})
                history.push('/')
            }   
        })
        .catch(err => {
            console.log(err)
        })
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
                                placeholder="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input 
                                type="password"
                                placeholder="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
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
                                LOGIN
                            </Button>
                            <h6>
                                <Link to='/signup'  className="black-text" >Don't have an account ?</Link>
                            </h6>
                        </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Login;