from .models import SpotifyToken
from django.conf import settings

from django.utils import timezone
from datetime import timedelta
from requests import post, put, get

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    print(user_tokens)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None
    

def update_or_create_user_tokens(session_id, access_token, refresh_token, token_type, expires_in):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.save(update_fields=['access_token', 'refresh_token', 
                                   'token_type', 'expires_in'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token,
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()


def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': settings.CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    refresh_token = response.get('refresh_token') or refresh_token
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_tokens(session_id, access_token, refresh_token, token_type, expires_in)

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)

    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
            print('refreshed')
        return True
    
    return False

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):

    tokens = get_user_tokens(session_id)

    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer ' + tokens.access_token}
    
    print(f'Access Token: {tokens.access_token[:10]}')

    if post_:
        response = post(BASE_URL + endpoint, headers=headers)
    elif put_:
        response = put(BASE_URL + endpoint, headers=headers)
    else:
        response = get(BASE_URL + endpoint, {}, headers=headers)

    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}
    

def play_song(session_id):
    return execute_spotify_api_request(session_id, 'player/play', put_=True)

def pause_song(session_id):
    return execute_spotify_api_request(session_id, 'player/pause', put_=True)

def skip_song(session_id):
    return execute_spotify_api_request(session_id, 'player/next', post_=True)

