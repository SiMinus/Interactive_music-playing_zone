import React from "react";
import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import SkipNextIcon from '@mui/icons-material/SkipNext'


function MusicPlayer(props) {

    const { title, artist, image_url, duration, time, is_playing, votes, votes_required} = props.song
    const songProgress = (time / duration) * 100

    const playSong = () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }
        fetch("/spotify/play-song", requestOptions)
    }

    const pauseSong = () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }
        fetch("/spotify/pause-song", requestOptions)
    }

    const skipSong = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }
        fetch("/spotify/skip-song", requestOptions)
    }

    return(
        <Card style={{ paddingTop: '6px', paddingLeft: '6px', marginTop: '16px' }}>
            <Grid container alignItems='center'>
                <Grid item align="center" xs={4}>
                    <img src={image_url} style={{ height: "100%", width: "100%", borderRadius: '8px' }} />
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {artist}
                    </Typography>
                    <div>
                        <IconButton onClick={is_playing ? pauseSong : playSong}>
                            {is_playing ? <PauseIcon/> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton onClick={skipSong}>
                            <SkipNextIcon /> {" " + votes + " / " + votes_required}
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
        </Card>
    )


}

export default MusicPlayer;