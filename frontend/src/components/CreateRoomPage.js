import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";

import{
    Button,
    Grid,
    Typography,
    TextField,
    FormControl,
    FormControlLabel,
    FormHelperText,
    RadioGroup,
    Radio,
    Collapse,
    Alert
} from "@mui/material"

function CreateRoomPage(props){

    const {
        votesToSkip = 2,
        guestCanPause = false,
        update = false,
        roomCode = null,
        updateCallback = () => {},
        redirectCallback = () => {}
    } = props
    
    const navigate = useNavigate();
    const [state, setState] = useState({
        guestCanPause: guestCanPause,
        votesToSkip: votesToSkip

    });

    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
     //state management
    const handleVotesChange = (e) => {
        setState((state) => ({
            ...state,
            votesToSkip: e.target.value,
        }))
    }

    const handleGuestCanPauseChange = (e) => {
        setState((state) => ({
            ...state,
            guestCanPause: e.target.value === "true"? true : false,
        }))

    }
    // button management
    const handleCreateButton = () => {
       
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: state.votesToSkip,
                guest_can_pause: state.guestCanPause,
            })
            
        }
        fetch("/api/create-room", requestOptions)
          .then((response) => response.json())
          .then((data) => navigate("/room/" + data.code));
    }

    const handleUpdateButton = async () => {
        const requestOptions = {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip : state.votesToSkip,
                guest_can_pause : state.guestCanPause,
                code : roomCode
            })
        }

        try {
            const response = await fetch("/api/update-room", requestOptions)
            const data = await response.json()
            
            if(response.ok){
                setMessage("Updated Successfully")
                props.updateCallback()
                setTimeout(() => {
                    props.redirectCallback();
                }, 2000)
            } else {
                setError(true)
                setMessage(data.msg)
            }

        }
        catch(error) {
            console.error('Error:', error)
            setError(true);
            setMessage('Unknown Error')
        }

    }

    const title = update ? "Update Room" : "Create a Room"

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={message != ""}>
                    <Alert
                      severity={error ? "error" : "success"}  
                      onClose={() => setMessage("")}
                    >
                        {message}
                    </Alert>
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <FormHelperText>
                        <div aligin='center'>Guest Control of PlayBack State</div>
                    </FormHelperText> 
                    <RadioGroup
                        row
                        defaultValue={state.guestCanPause}
                        onChange={handleGuestCanPauseChange}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom"
                        />

                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <FormHelperText>
                        <div aligin="center">Votes required to skip song</div>
                    </FormHelperText>
                    <TextField 
                        required={true}
                        type="number"
                        defaultValue={state.votesToSkip}
                        inputProps={{
                            min: 1,
                            style: { textAlign: "center" }
                        }}
                        onChange={handleVotesChange}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={update? handleUpdateButton : handleCreateButton}
                >
                    {title}
                </Button>
            
            </Grid>
            {!update ? (
                <Grid item xs={12} align="center">
                    <Button
                        color="secondary"
                        variant="contained"
                        to="/"
                        component={Link}
                    >
                        Back
                    </Button>
                
                </Grid> 
            ) : null}
           
        </Grid>
    );
}

export default CreateRoomPage;