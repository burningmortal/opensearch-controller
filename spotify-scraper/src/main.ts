const main = async () => {
  const url = `https://api.spotify.com/v1/playlists/0THu9AUxyZHki6O4c8zo0B`
  const res = await fetch(url,{'headers': {Authorization: `Bearer ${process.env.SPOTIFY_API_KEY || ''}`}})
  const json = await res.json()
  const playlist = {
    url: json.external_urls.spotify,
    image: json.images[0].url,
    name: json.name,
    owner: {
      name: json.owner.display_name
    },
    tracks: json.tracks.items.map((track: any) => {
      return {
        addedAt: track.added_at,
        duration: track.track.duration_ms,
        id: track.track.id,
        name: track.track.name,
        album: {
          name: track.track.album.name,
          releaseDate: track.track.album.release_date,
          artwork: track.track.album.images[0].url
        },
        artists: track.track.artists.map((artist: any) => {
          return {
            name: artist.name
          }
        }),
        popularity: track.track.popularity
      }
    })
  }

  console.log(JSON.stringify(playlist, undefined, 2))
}

main()