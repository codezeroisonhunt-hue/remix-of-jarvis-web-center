import spotipy
from spotipy.oauth2 import SpotifyOAuth

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id='c1c4a43a1f0943c99f5dac81f2cf4b52',
    client_secret='f44eab48459f4058ab37d0db213ce93a',
    redirect_uri='https://corejarvis.netlify.app/callback/',
    scope='user-read-playback-state,user-modify-playback-state'
))

def play_song(song_name):
    results = sp.search(q=song_name, type='track', limit=1)
    tracks = results.get('tracks', {}).get('items', [])
    if tracks:
        track_uri = tracks[0]['uri']
        sp.start_playback(uris=[track_uri])
        print(f"Now playing: {tracks[0]['name']} by {tracks[0]['artists'][0]['name']}")
    else:
        print("Song not found.")
