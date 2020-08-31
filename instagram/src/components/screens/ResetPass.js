import React, { useState} from 'react';
import {  Row, Col, Card, Button } from 'react-materialize';
import { Link } from 'react-router-dom';

import './ResetPass.css';
const axios = require("axios");

const Reset = () => {
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const PostData = async() => {
        // validate email pattern
        await axios({
            "method":"POST",
            "url":"https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
            "headers":{
                "content-type":"application/json",
                "x-rapidapi-host":"rapidprod-sendgrid-v1.p.rapidapi.com",
                "x-rapidapi-key":"1030f32ad3mshd6595aa1fc97cd5p1f921djsn1fb9290534e7",
                "accept":"application/json",
                "useQueryString":true
            },
            "data":{
                "personalizations":[{
                    "to":[{
                            "email":"projectmern888@gmail.com"
                        }],
                            "subject":"Hello, World!"
                        }],
                "from":{
                    "email":"no-reply@insta.com"
                },
                "content":[{
                    "type":"text/plain",
                    "value":"Hello, World!"
                    }]
                }
            })
            .then((response)=>{
                console.log(response, password,email)
            })
            .catch((error)=>{
                console.log(error.response)
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
                                Reset
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

export default Reset;



