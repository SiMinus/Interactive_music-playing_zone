import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom"
import { Grid, Button, ButtonGroup, Typography } from '@mui/material'

import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import Room from "./Room";

function HomePage(){

    const [roomCode, setRoomCode] = useState(null);

    useEffect(() => {
        handleCodeChecking();
        
    }, [])

    const handleCodeChecking = () => {
        fetch("/api/user-in-room")
        .then((response) => response.json())
        .then((data) => {
            setRoomCode(data.code)
            console.log(data.code);
        })
    }
    const clearRoomCode = () => {
        setRoomCode(null);
    }

    const renderHomePage = () => {
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/create" component={Link}>
                            Create a Room
                        </Button>
                        <Button color="secondary" to="/join" component={Link}>
                            Join a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }


    return (

        <Router>
            <Routes>
                <Route path="/" element={roomCode? <Navigate to={`/room/${roomCode}`} /> : renderHomePage()} />
                <Route path="/create" element={<CreateRoomPage/>} />
                <Route path="/join" element={<RoomJoinPage/>} />
                <Route path="/room/:roomCode" element={<Room leaveRoomCallback={clearRoomCode} />} />
            </Routes>
        </Router>

    );
}

export default HomePage;