const request = require('request')

const forecast = (longitude, latitude, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+longitude+','+latitude+'.json?access_token=pk.eyJ1IjoiZml6enk1OSIsImEiOiJjazloNG13YjYwNTNoM29xbTV4b3ltb3ZzIn0.Yt1RgdqdFQGS-nsGj8aBJQ&limit=1'

    request({ url, json: true }, (error, {body}) =>
    {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.message) {
            callback(console.log(body.message))
        } else {
            callback(undefined, {
                latitude:  body.features[0].center[1],
                longitude: body.features[0].center[0],
                location:  body.features[0].place_name
            })
        }
    })
}

module.exports = forecast