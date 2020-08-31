import React, { useContext, useState, useRef, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Navbar, NavItem, Icon, Button } from 'react-materialize';
import { UserContext } from '../App';
import M from 'materialize-css';
import './Navbar.css';

const NavbarC = () => {
    const searchModal = useRef(null)
    const {state, dispatch} = useContext(UserContext)
    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])
    console.log(state)
    const history = useHistory()

    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])

    const renderList = () => {
        if(state){
            return [
                <i data-target="modal1" className="large material-icons modal-trigger" style={{color:'black'}} key={13}>search</i>,
                <Link to="/profile" key={0}>Profile</Link>,
                <Link to="/myfollowingpost" key={1}>My following posts</Link>
                ,
                <NavItem href="/createpost" key={2}>
                    Create
                </NavItem>,
                <Button
                    className="#c62828 red darken-3 white-text"
                    flat
                    node="button"
                    style={{
                    marginRight: '5px'
                    }}
                    waves="light"
                    onClick={() => {
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push('/login')
                    }}
                    key={3}
                    >
                    Logout
                </Button>
            ]
        }else{
            return [
                <Link to="/login" key={4}>
                    Login
                </Link>,
                <Link to="/signup" key={5}>
                    Signup
                </Link>
            ]
        }
    }

    const fetchUsers = (query) =>{
        setSearch(query)
        fetch('/search-users',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            setUserDetails(result)
        })
    }
    
    return (
        <>
            <Navbar
                className="white"
                alignLinks="right"
                brand={<a className="brand-logo black-text" href={state ? '/' : '/login'}>Instagram</a>}
                id="mobile-nav"
                menuIcon={<Icon className="black-text">menu</Icon>}
                options={{
                    draggable: true,
                    edge: 'left',
                    inDuration: 250,
                    onCloseEnd: null,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    outDuration: 200,
                    preventScrolling: true
                }}
            >
                {renderList()}
            </Navbar>
            <div id="modal1" className="modal" ref={searchModal} style={{color:'black'}}>
                <div className="modal-content">
                    <input 
                        type="text"
                        placeholder="Search users"
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {
                            
                                userDetails.map((item,index)=>{
                                    return(
                                        
                                            <Link to={item._id !== state._id ? "/profile/"+item._id : "/profile"} key={index}
                                                onClick={() => {
                                                    M.Modal.getInstance(searchModal.current).close()
                                                    setSearch('')
                                                }}    
                                            >
                                                <li className="collection-item" key={index}>
                                                    {item.email}
                                                </li>
                                            </Link>
                                        
                                    )
                                })
                        }
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Close</button>
                </div>
            </div>
        </>
    );
}

export default NavbarC;
