import React, { useState, useEffect } from 'react';
import {  Row, Col, Card, Button } from 'react-materialize';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

import './CreatePost.css';

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [photo, setPhoto] = useState("")

    // url from CDN cloud image storage
    const [url, setUrl] = useState("")

    // componentdidmount/unmount
    useEffect(() => {
        if(url){
            //console.log('ok')
            //fetch into database mongoDB
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    url
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                }else{
                    M.toast({html: "Successfully added new post",classes:"#43a047 green darken-1"})
                    history.push('/')
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [url,body,title, history])

    const postDetail = () => {
        const data = new FormData()
        data.append("file", photo)
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
                            <input 
                                type="text"
                                placeholder="name"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea 
                                type="text"
                                placeholder="body"
                                value={body}
                                style={{border: "1px solid #00000050", height: 100}}
                                onChange={(e) => setBody(e.target.value)}
                            />
                            <div className="file-field input-field">
                                <div className="btn #64b5f6 blue darken-2 white-text">
                                    <span>Upload Image</span>
                                    <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" placeholder="Upload file" />
                                </div>
                            </div>
                            <Button
                                className="#64b5f6 blue darken-2 white-text"
                                flat
                                node="button"
                                style={{
                                marginRight: '5px'
                                }}
                                waves="light"
                                onClick={() => postDetail()}
                            >
                                SUBMIT POST
                            </Button>
                        </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default CreatePost;