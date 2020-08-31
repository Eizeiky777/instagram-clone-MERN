import React, { useEffect, useState, useContext } from 'react';
import {  Row, Col, Button } from 'react-materialize';
import{ useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import './UserProfile.css';

const UserProfile = () => {
    const [userProfile, setProfile] = useState(null)
    const [showfollow, setShowFollow] = useState(true)
    const {state, dispatch } = useContext(UserContext)
    const {userid} = useParams();

    useEffect(() =>{
        fetch(`/user/${userid}`, {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result => {
            console.log(result)
            setProfile(result)
        })  
    },[userid])

    const followUser = () => {
        fetch('/follow', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
                })
            })
            .then(res => res.json())
            .then(data => {
                dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers }})
                localStorage.setItem("user", JSON.stringify(data))
                console.log(data)
                setProfile((prevState) => {
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers, data._id ]
                        }
                    }
                })
                setShowFollow(true)
            })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
                })
            })
            .then(res => res.json())
            .then(data => {
                dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers }})
                localStorage.setItem("user", JSON.stringify(data))
                console.log(data)
                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item=>item !== data._id)
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newFollower
                        }
                    }
                })

                setShowFollow(true)
            })
    }

    return(
        <>
            {
            userProfile ?
            <div style={{maxWidth:"850px",margin:"0px auto"}}>
                <div 
                style={{
                    display: "flex", 
                    justifyContent:"space-around", 
                    margin:"18px 0px",
                    borderBottom:"1px solid grey",
                    padding: 15
                }}>
                    <div>
                        <img 
                            style={{width:"160px", height:"160px",borderRadius:"80px"}}
                            src={userProfile.user.pic}
                            alt="1"
                        />
                    </div>
                    <div style={{marginLeft: 7}}>
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div
                            style={{
                                display:"flex",
                                justifyContent:"space-around",
                                width:"100%"
                            }}
                        >   
                            <h6>{userProfile.posts.length} post</h6>
                            <h6>&nbsp; &nbsp;{userProfile.user.followers.length} follower</h6>
                            <h6>&nbsp; &nbsp;{userProfile.user.following.length} following</h6>
                        </div>
                        {
                            !showfollow || !userProfile.user.followers.includes(state._id)?
                        <Button
                            className="#64b5f6 blue lighten-2 white-text"
                            flat
                            node="button"
                            style={{
                                marginRight: '5px'
                            }}
                            waves="light"
                            onClick={() => followUser()}
                        >
                            Follow
                        </Button>
                        :
                        <Button
                            className="#64b5f6 blue lighten-2 white-text"
                            flat
                            node="button"
                            style={{
                                marginRight: '5px'
                            }}
                            waves="light"
                            onClick={() => unfollowUser()}
                        >
                            Unfollow
                        </Button>
                    }
                    </div>
                </div>

                <div className="gallery">
                    <Row>
                        {
                            userProfile.posts.map((item, index) =>{
                                return(
                                    <Col s={4} m={4} key={index}>
                                        <img alt={item.title} src={item.photo} />
                                    </Col>
                                )
                            })
                        }
                        <Col s={4} m={4} >
                        <img alt="1" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSjxR_T4AuYAxeQ7MKeNlHgp-QsyKsSbfOWLw&usqp=CAU" />
                        </Col>
                        <Col s={4} m={4} >
                        <img alt="1" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSjxR_T4AuYAxeQ7MKeNlHgp-QsyKsSbfOWLw&usqp=CAU" />
                        </Col>
                        <Col s={4} m={4} >
                        <img alt="1" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQsV7k82_R_0FlarBdienRy535ijqc4TW_j7Q&usqp=CAU" />
                        </Col>
                        <Col s={4} m={4} >
                            <img alt="1" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQy2KR2C1w_ngouDJrJB6uxRe1RMbjON17Imw&usqp=CAU" />
                        </Col>
                        <Col s={4} m={4} >
                        <img alt="1" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSGKiqLXbCEaqiugtfOxw9QzvuOOGIpPgegVw&usqp=CAU" />
                        </Col>
                        <Col s={4} m={4} >
                        <img alt="1" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRt4dm1UWqTqFegj8DDeSE5AMeWQDpPDUPJ4Q&usqp=CAU" />
                        </Col>
                    </Row>
                </div>
            </div>

            : 

            <h2>Loading</h2>

            }
        </>
    )
}

export default UserProfile;