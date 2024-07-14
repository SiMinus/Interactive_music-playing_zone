from django.shortcuts import render, redirect
from django.conf import settings
from api.models import Room
from .models import Vote
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from requests import Request, post
from .util import *

class AuthURL(APIView):

    def get(self, request, format=None):
        force_auth = request.GET.get('force_auth', 'false').lower() == 'true'
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': settings.REDIRECT_URI,
            'client_id': settings.CLIENT_ID
        }).prepare().url

        if force_auth:
            url += "&show_dialog=true"

        return Response({'url': url}, status=status.HTTP_200_OK)
    
def spotify_callback(request, format=None):
    code = request.GET.get('code')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': settings.REDIRECT_URI,
        'client_id': settings.CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    refresh_token = response.get('refresh_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(request.session.session_key, access_token, refresh_token, token_type, expires_in)

    return redirect('frontend:')
    

class isAuthenticated(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.get(code=room_code)
        if self.request.session.session_key == room.host:
            is_authenticated = is_spotify_authenticated(self.request.session.session_key)
            return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
        
        return Response({'status': True}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        
        host = room.host
        endpoint = 'player/currently-playing'
        response = execute_spotify_api_request(host, endpoint)

        if 'error' in response or 'item' not in response:
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        
        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }
        self.update_room_song(room, song_id)
        return Response(song, status=status.HTTP_200_OK)
    
    def update_room_song(self, room, song_id):
        current_song = room.current_song

        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()
    
class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.get(code=room_code)
        if self.request.session.session_key == room.host or room.guest_can_pause:
            response = play_song(room.host)
            return Response(response, status=status.HTTP_200_OK)
        
        return Response({'msg': 'No Access Right'}, status=status.HTTP_403_FORBIDDEN)
    
class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.get(code=room_code)
        if self.request.session.session_key == room.host or room.guest_can_pause:
            response = pause_song(room.host)
            return Response(response, status=status.HTTP_200_OK)
        
        return Response({'msg': 'No Access Right'}, status=status.HTTP_403_FORBIDDEN)
    
class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.get(code=room_code)
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            votes.delete()
            response = skip_song(room.host)
            return Response(response, status=status.HTTP_200_OK)
        else: 
            vote = Vote(user=self.request.session.session_key,
                        room=room, song_id=room.current_song)
            vote.save()

        return Response({'msg': "No permission or no enough votes"}, status=status.HTTP_403_FORBIDDEN)