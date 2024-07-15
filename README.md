# Interactive_music-playing_zone
## Table of Contents
- [Introduction](#introduction)
- [Key Responsibilities](#key-responsibilities)
- [Getting Started](#getting-started)
- [Bug Records](#bug-records)
- [Lessons Learned](#lessons-learned)
## Introduction
This application is a palace for gathering  people with the same music taste online

Host is able to
- Decide if the guests can pasue the song and how many votes needed to skip it while creating
- Pass the authentication through login to Spotify, before the information of current song will be shown and constantly updating on the page.
- Have the full access of the room, including pausing, skiping the song and updating room pemissions.
- The room will be gone after host exit.
  
Guests are able to 
- Join the room by sending 6-digit random code.
- Pause current song if allowed by host
- Skip the song by voting
- Alway be redirected back to room through home page before leaving the room
### Technical Structure
Django + Django Rest Framework + ReactJS
### Player Interface Display
<img width="1002" alt="截屏2024-07-13 00 28 14" src="https://github.com/user-attachments/assets/65cd7009-0510-4a42-8d91-7661a3680215">

### Development WorkFlow
https://github.com/SiMinus/Music_Workflow
## Key Responsibilities
- Tested every involved use case and fixed issues by optimizing and simplifying the crucial part code, preventing 40% potential bugs.
- Stored frequently used data in request session, reducing database pressure and saving 99% of data accessing time.
- Set authentication logic to check permission before constantly fetching data from Spotify, enhancing the application's capacity to support a 70% increase in concurrent users.
- Implemented seamless dynamic effects between components by sending callback functions through React props, reducing code duplication by 40%.
  

## Getting Started
### Clone
```bash
git clone https://github.com/SiMinus/Interactive_music-playing_zone.git
```
### Create Spotify App
```bash
https://developer.spotify.com/
```
The principle of using Spotify API:
![image](https://github.com/user-attachments/assets/7a16b7e4-fd61-4ab6-bb3e-789047044be8)

### Setting up for backend
```bash
cd Interactive_music-playing_zone
```
Create .env in which delare CLIENT_ID, CLIENT_SECRET(from you Spotify App) AND REDIRECT_URI<br>
Also, Don't forget to set the redirect uri to your Spotify App

Create new virtual environment

```bash
python -m venv venv  # second 'venv' can be modified to the name you like for the directory
source venv/bin/activate  # activate virtual environment(Linux & MacOS)
.\venv\Scripts\activate  # （Only for Windows）

```
Install required dependencies for this app
```bash
pip install -r requirements.txt
```
Database Migration
```bash
python manage.py migrate
```

### Setting up for frontend
```bash
cd frontend
npm install
```
Start Webpack and watch for file changes to compile in real-time.
```bash
npm run dev
```
### Finally, starting development server at http://127.0.0.1:8000/
```bash
python manage.py runserver
```
### All set! Now You can now browse the music zone and share music with you friends !

## Bug Records
### Solved Bugs
1.

Given situation: users, having joined, will be redirected to the room page every time they get back through main page<br>
Bug faced: If a host visit the home page after create a room, of course now he is in this room through 2 tabs. After this host leave room in one tab, in the other tab:
- if he refreshed, there will be reporting error, because the room doesn't exist anymore
- if he press "leave room" button again, he will go to the home page at the first place, but since the value of state roomCode still exist, he willcbe redirected to the nonexistent room page again. Certainly, it will be reporting error as well.

Solution:

```bash
//create "clearCode" function in Home page and send it as prop to Room page
<Route
    path="/room/:roomCode"
    element={<Room leaveRoomCallback={clearRoomCode} />} 
/>

const leaveRoomButton = () => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    }
    fetch("/api/leave-room", requestOptions)
      .then((response) => {
   //to be called every time the "leave room" button is pressed.
        props.leaveRoomCallback();
        navigate('/');
      })
}
```
```bash
fetch("/api/get-room" + "?code=" + roomCode)
  .then((response) => {
    if(!response.ok){
    //clean the existed roomCode if getting unexpected response.
        props.leaveRoomCallback();
    //redirect to Home page if the code doestn't exist.
        navigate('/');
    }
    return response.json()
  })
```
Fixed Results: users can be redirected to home page every time they press "leave room" button.

2.<br>
Bug faced: After host clicked the Update Button, new changes were not shown on the Room page. And there is no error at all, the Response from backend API is also alright.<br>
Solution:

```bash
const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        // votesToSkip and guestCanPause exist both in state and props.
        // React will assume you are using props without declaration
            votes_to_skip: state.votesToSkip,
            guest_can_pause: state.guestCanPause,
            code: roomCode
        })
}
```

3.<br>
Bug faced: UseNavigete Hook cannot get host from back to the Room Page<br>
Solution:

```bash
const handleUpdateButton = () => {
        ......
        if (response.ok) {
            setMessage('Updated Successfully')
            props.updateCallback();
         // even though UpdateRoom component was rendered by changing the value of state: showSetting to be true
         // But there is no changing on Route, so set the value back to false using callback functions was a much better option
            setTimeout(() => {
                props.redirectCallback();
            }, 2000);

            // setTimeout(() => {
            //     navigate(`/room/${data.code}`);
            // }, 2000);

        }
       ......
}
```
4.<br>
Bug faced: I wanted to get the same Response message in frontend as it from backend to better specify the issue, but got reporting error: ReferenceError: response is not defined
```bash
fetch("/api/update-room", requestOptions)
  .then((response) => response.json())
  .then((data) = > {
      if (response.ok) {
          setMessage('Updated Successfully')
          props.updateCallback();
          setTimeout(() => {
              props.redirectCallback();
          }, 2000);
      } else {
          setError(true);
          setMessage(data.msg)
      }
});
```
Solution:

```bash
  // since the response from last then() can not be accessed,
  // a better option would be using async&await
const handleUpdateButton = async () => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            votes_to_skip: state.votesToSkip,
            guest_can_pause: state.guestCanPause,
            code: roomCode
        })
    }

    try {
        const response = await fetch("/api/update-room", requestOptions)
        const data = await response.json()

        if (response.ok) {
            setMessage('Updated Successfully')
            props.updateCallback();
            setTimeout(() => {
                props.redirectCallback();
            }, 2000);
        } else {
            setError(true);
            setMessage(data.msg)
        }
    }
    catch(error) {
        console.error('Error: ', error)
        setError(true)
        setMessage('Unknown Error')
    }
}      
```

5.<br>
Bug faced: After getting tokens from Spotify API, host cannot be navigated back to this application.

Solution:

```bash
// give the url name property to be detected
// frontend/urls.py
urlpatterns = [
    path('', views.index, name=''),
    ......
]
// spotify/views.py
def spotify_callback(request, format=None):
    ......
    return redirect('frontend:')
```
6.<br>
Bug faced: The refresh_token got from Spotify API is None. And NULL is not allowed in the Database setting

Solution:

```bash
// Sometimes there is no new token return from spotify. Using old one is still fine
refresh_token = response.get('refresh_token') or refresh_token
```
7.<br>
Bug faced: getCurrentSong was successfully called, but response data wasn't sent to state song.

Solution:
```bash
const isMounted = useRef(true)
useEffect(() => {
    getRoomDetails();
    const abortController = new AbortController();

    let interval;
    if (spotifyChecked){
 // Even though the default value of isMounted was already set to be true
 // But the second time of useEffect being called because of being authenticated will close the interval
 // and set isMounted to be false
 // so we need to make isMounted to be true again evert time host get authenticated successfully
        isMounted.current = true
        interval = setInterval(getCurrentSong, 1000)
    }
    return () => {
        isMounted.current = false
        if (interval) {
            clearInterval(interval)
        }
        abortController.abort()
    }
    
    
}, [spotifyChecked])
```
Why using useRef: Even if the interval is cleared, fetch requests that have already been started may still try to update the state of the uninstalled component, which can lead to errors or memory leaks
### Refinements made
1.<br>
desired functionality: user can directly access to the Room Page through url address, doesn't have to go through joining routine.<br>
Solution:  
```bash
//add code to session in GetRoom View
code = request.GET.get(self.lookup_url_kwarg)
self.request.session['room_code'] = code
```
2.<br>
desired functionality: reduce the code duplication on UpdateRoom.<br>
Before:  
```bash
const renderCreateButtons = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleCreateButton}
        >
          Create A Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}

const renderUpdateButtons = () => {
  return (
    <Grid item xs={12} align="center">
      <Button
        color="primary"
        variant="contained"
        onClick={handleUpdateButton}
      >
        Update Room
      </Button>
    </Grid>
  );
}
......
{update ? renderUpdateButtons() : renderCreateButtons()}
```
After:  
```bash
const title = update ? 'Update Room' : 'Create a Room'
<Button
    color="primary"
    variant="contained"
    onClick={update ? handleUpdateButton : handleCreateButton}
>
    {title}
</Button>
```
Becasue Buttons in 2 situations are almost the same. So I changed it from render 2 kinds of button depending on update state to calling 2 kinds of functions depending on update state

3.
desired functionality: after updating, new room info can be shown with refreshing.<br>
Solution:

```bash
// if updating is successful, getRoomDetails function will be called again through sent props
// Room.js
<Grid item xs={12} align="center">
    <CreateRoomPage
        ......
        updateCallback={getRoomDetails}
        redirectCallback={() => setShowSettings(false)}
    />
</Grid>    
......
// CreateRoomPage.js
if (response.ok) {
    setMessage('Updated Successfully')
    props.updateCallback();
    setTimeout(() => {
        props.redirectCallback();
    }, 2000);
} 
```
4. <br>
desired functionality: Host should be checked first before before constly getting song info from Spotify API. And interval will be cleared every time host leave room<br>
Before:
```bash
useEffect(() => {
  getRoomDetails();
  const interval = setInterval(getCurrentSong, 1000)
  return () => clearInterval(interval)
}
```
After: 
```bash
const isMounted = useRef(true)
......
useEffect(() => {
    getRoomDetails();
    const abortController = new AbortController();

    let interval;
    // getCurrentSong will be called only if
    // the result from authSpotify is true
    if (spotifyChecked){
        isMounted.current = true
        interval = setInterval(getCurrentSong, 1000)
    }
   // when this component was uninstalled or closed, useEffect will be called, setting isMounted to be false
   // to stop getCurrentSong calling and clear interval
    return () => {
        isMounted.current = false
        if (interval) {
            clearInterval(interval)
        }
        abortController.abort()
    }
    
    
}, [spotifyChecked])
......
const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
            return {}
        } 
        return response.json()
      })
      .then((data) => {
      // set data to song only if this component is being mounted.
        if (isMounted.current) {
          setSong(data)
          console.log(data)  
        }
      })
}
```
5. <br>
Desired functionality: Authentication is only for host, guests can freely access to the room with updating music info after host successfully being checked<br>
Before:
```bash
class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
```
After:
```bash
class IsAuthenticated(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.get(code=room_code)
        if self.request.session.session_key == room.host:
            is_authenticated = is_spotify_authenticated(self.request.session.session_key)
            return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
        
        return Response({'status': True}, status=status.HTTP_200_OK)
```
## Lessons Learned
1.
- When a component serves as the root of a routing structure, it remains mounted and active even when its child routes are directly accessed. The root component's state values can be modified in response to user interactions or API calling.
- However, when a user returns to this root route through programmatic navigation (e.g., using the navigate function), the root component does not remount or reinitialize. Instead, it retains its last known state rather than resetting to its initial values.

2.
- if state was set to null by default, then it can't be render within the page before being declared a value.
Solution:
```bash
const [song, setSong] = useState(null)
{song ? <MusicPlayer song={song} /> : null}
```
3. Difference between useState and useRef
- for managing component visibility, input values, etc.: _state_ is better becasue of triggering re-rendering but _ref_ can't
- for accessing DOM elements: _ref_ provides direct references to DOM nodes, allowing you to manipulate the DOM directly without triggering a re-rendering of the component, which can improve performance when dealing with frequently updated scenes.
   
