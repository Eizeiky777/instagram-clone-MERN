import React, { useState, useEffect, useContext } from 'react';
import {  Row, Col, Card, CardTitle } from 'react-materialize';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';
import './Home.css'

const Home = () => {
    const [data, setData] = useState([])
    const {state} = useContext(UserContext)

    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            setData(result.posts)
        })
    },[])

    const likePost = (id) => {
        
        fetch('/like', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                    postId:id
                })
            })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                const presentStateHome = data.map(item => {
                    if(item._id === result._id){
                        return result
                    }else{
                        return item
                    }
                })
                setData(presentStateHome)
            })
            .catch(err =>{
                console.log(err)
            })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                    postId:id
                })
            })
            .then(res => res.json())
            .then(result => {
                //console.log(result)
                const presentStateHome = data.map(item => {
                    if(item._id === result._id){
                        return result
                    }else{
                        return item
                    }
                })
                setData(presentStateHome)
            })
            .catch(err =>{
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        })
        .then(res=>res.json())
        .then(result => {
            console.log(result)
            const presentStateHome = data.map(item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(presentStateHome)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const removeComment = (idComment, postId) => {
        fetch('/removecomment', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                idComment
            })
        })
        .then(res=>res.json())
        .then(result => {
            console.log(result)
            const presentStateHome = data.map(item => {
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(presentStateHome)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result.result)
            const newData = data.filter(item=>{
                return item._id !== result.result._id
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return(
        <>
            <div className="home">
                <div className="home-card">
                    <Row>
                        {
                            data.map((item, index) => {
                                return(
                                    <Col
                                        m={3}
                                        s={12}
                                        key={index}
                                    >
                                        <Card
                                        >
                                            <div style={{display:"flex", justifyContent:"space-between", alignItems:'center'}}>
                                                <h5>
                                                    <Link to={
                                                        item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"} 
                                                    >
                                                        {item.postedBy.name}
                                                    </Link>
                                                </h5>
                                                {
                                                    item.postedBy._id === state._id && 
                                                    <i 
                                                    className="material-icons"
                                                    onClick={() => deletePost(item._id)}
                                                    >
                                                        delete
                                                    </i>
                                                }
                                            </div>
                                            <CardTitle 
                                            image={item.photo}>
                                                {item.title}
                                            </CardTitle>
                                            {
                                                item.likes.includes(state._id) 
                                                    ?
                                                    <i 
                                                    className="material-icons" 
                                                    style={{marginTop: 5}}
                                                    onClick={() => unlikePost(item._id)}
                                                >
                                                    thumb_down
                                                </i>
                                                    :
                                                    <i 
                                                    className="material-icons" 
                                                    style={{marginTop: 5}}
                                                    onClick={() => likePost(item._id)}
                                                >
                                                    thumb_up
                                                </i>
                                            }
                                            <h6>{item.likes.length} likes</h6>
                                            <h6>{item.title}</h6>
                                            <p>{item.body}</p>
                                            {
                                                item.comments.map((record, index)=>{
                                                    return (
                                                    <div key={index}  style={{display:'flex', justifyContent:"space-between", alignItems:'center'}}>
                                                        <h6 >
                                                            <span style={{fontWeight:500}}>{record.postedBy.name} </span>
                                                            {record.text}
                                                        </h6>
                                                        {
                                                            record.postedBy._id === state._id && 
                                                            <i 
                                                            className="material-icons"
                                                            onClick={() => removeComment(record._id, item._id)}
                                                        >
                                                            close
                                                        </i>
                                                        }
                                                    </div>
                                                    )
                                                })
                                            }
                                            <form onSubmit={(e) => {
                                                e.preventDefault()
                                                makeComment(e.target[0].value, item._id)
                                            }}>
                                                <input type="text" placeholder="add a comment" />
                                            </form>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                        <Col
                            m={3}
                            s={12}
                        >
                            <Card
                            >
                                <h5>Assassins Creed</h5>
                                <CardTitle 
                                image="https://materializecss.com/images/sample-1.jpg">
                                    Card Title
                                </CardTitle>
                                <i className="material-icons" style={{color: 'red', marginTop: 5}}>
                                    favorite
                                </i>
                                <h6>title</h6>
                                <p>this is amazing post</p>
                                <input type="text" placeholder="add a comment" />
                            </Card>
                        </Col>
                        <Col
                            m={3}
                            s={12}
                        >
                            <Card
                            >
                                <h5>Assassins Creed</h5>
                                <CardTitle 
                                image="https://materializecss.com/images/sample-1.jpg">
                                    Card Title
                                </CardTitle>
                                <i className="material-icons" style={{color: 'red', marginTop: 5}}>
                                    favorite
                                </i>
                                <h6>title</h6>
                                <p>this is amazing post</p>
                                    <input type="text" placeholder="add a comment" />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default Home;