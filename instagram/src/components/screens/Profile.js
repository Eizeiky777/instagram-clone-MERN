import React, { useEffect, useState, useContext } from 'react';
import {  Row, Col, Button, Modal } from 'react-materialize';
import { UserContext } from '../../App';
import './Profile.css';

const Profile = () => {
    const [mypics, setMypics] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [show, setShow] = useState(false)

    // data for update
    const [titleupdate, setTitleupdate] = useState('')
    const [bodyupdate, setBodyupdate] = useState('')
    const [postedId, setPostedId] = useState('')
    const [postedIndex, setPostedIndex] = useState('')

    useEffect(() =>{
        fetch('/myposts', {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result => {
            console.log(result)
            setMypics(result.mypost)
        })
    },[])

    const updatePhoto = (image) => {
        // console.log(image)
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
            // setUrl(data.url)
            fetch('/updatepic', {
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            })
            .then(res=>res.json())
            .then(result=>{
                console.log(result)
                localStorage.setItem("user",JSON.stringify({...state, pic:result.pic}))
                dispatch({type:"UPDATEPIC",payload:result})
            })
            .catch(err=>{
                console.log(err)
            })
            
        })
        .catch(err => {
            console.log(err)
            return
        })
    }

    const submitUpdate = () => {
        // console.log(titleupdate, bodyupdate, postedId, postedIndex)
        fetch('/updateposted', {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title:titleupdate,
                detail:bodyupdate,
                postedId:postedId
            })
        })
        .then(res=>res.json())
        .then(result=>{
            
            let newArray = [...mypics]
            newArray[postedIndex] = {...newArray[postedIndex], title:result.title, body: result.body }
            setMypics(newArray)
        })
        .catch(err=>{
            console.log(err)
        })
        
    }

    return(
        <>
            <div style={{maxWidth:"850px",margin:"0px auto"}}>
                <div 
                style={{
                    display: "flex", 
                    justifyContent:"space-around", 
                    margin:"18px 0px",
                    borderBottom:"1px solid grey",
                    padding: 15
                }}>
                    <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
                        <img 
                            style={{width:"160px", height:"160px",borderRadius:"80px"}}
                            src={state ? state.pic : ""}
                            alt="1"
                        />
                        {
                            show ?  
                                <div>
                                    <div className="file-field input-field">
                                        <div className="btn #64b5f6 blue darken-2 white-text">
                                            <span>UPDATE</span>
                                            <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                                        </div>
                                        <div className="file-path-wrapper">
                                            <input className="file-path validate" type="text" placeholder="Update picture profile" />
                                        </div>
                                    </div>
                                </div>
                                :
                                <Button
                                    className="#64b5f6 blue lighten-2 white-text"
                                    flat
                                    node="button"
                                    style={{
                                        marginRight: '5px'
                                    }}
                                    waves="light"
                                    onClick={() => setShow(true)}
                                >
                                    UPDATE
                                </Button>
                            }
                    </div>
                    <div style={{marginLeft: 7}}>
                        <h4>{ state && ( state.name )}</h4>
                        <h5>{ state && state.email}</h5>
                        <div
                            style={{
                                display:"flex",
                                justifyContent:"space-around",
                                width:"100%"
                            }}
                        >   
                            <h6>{mypics.length} post</h6>
                            <h6>&nbsp; &nbsp;{state ? state.followers.length : null} follower</h6>
                            <h6>&nbsp; &nbsp;{state ? state.following.length : null} following</h6>
                        </div>
                    </div>
                </div>

                <div className="gallery">
                    <Row>
                        {
                            mypics.map((item, index) =>{
                                return(
                                    <Col s={4} m={4} key={index} >
                                        <img alt={item.title} src={item.photo} />
                                        <div style={{textAlign:'left'}}>
                                            {
                                                item.likes.includes(state._id) 
                                                    ?
                                                    <i 
                                                    className="material-icons" 
                                                    style={{marginTop: 5}}
                                                    
                                                >
                                                    thumb_down
                                                </i>
                                                    :
                                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                                    <i 
                                                        className="material-icons"
                                                        style={{marginTop: 5}}
                                                        
                                                    >
                                                        thumb_up
                                                    </i>
                                                    <i 
                                                        className="material-icons modal-trigger" 
                                                        href="#modal1"
                                                        node="button"
                                                        style={{marginTop: 5, color:'green'}}
                                                        onClick={() => {
                                                            setPostedId(item._id)
                                                            setPostedIndex(index)
                                                        }}
                                                        
                                                    >
                                                        create
                                                    </i>
                                                </div>
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
                                                            
                                                        >
                                                            close
                                                        </i>
                                                        }
                                                    </div>
                                                    )
                                                })
                                            }
                                        </div>
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
                <div>
                    
                    <Modal
                        actions={[
                        <Button flat modal="close" node="button" waves="green">Close</Button>
                        ]}
                        bottomSheet={false}
                        fixedFooter={false}
                        header="update detail posted picture"
                        id="modal1"
                        open={false}
                        options={{
                            dismissible: true,
                            endingTop: '10%',
                            inDuration: 250,
                            onCloseEnd: null,
                            onCloseStart: null,
                            onOpenEnd: null,
                            onOpenStart: null,
                            opacity: 0.5,
                            outDuration: 250,
                            preventScrolling: true,
                            startingTop: '4%'
                        }}
                    >
                        <h6>Title</h6>
                        <input 
                            type="text"
                            placeholder="title"
                            onChange={(e) => setTitleupdate(e.target.value)}
                        />
                        <h6>Body</h6>
                        <input 
                            type="text"
                            placeholder="body"
                            onChange={(e) => setBodyupdate(e.target.value)}
                        />
                        <Button
                                className="#64b5f6 blue lighten-2 white-text"
                                flat
                                node="button"
                                style={{
                                marginRight: '5px'
                                }}
                                waves="light"
                                onClick={() => submitUpdate()}
                            >
                                UPDATE
                        </Button>
                    </Modal>
                    </div>
            </div>
        </>
    )
}


export default Profile;