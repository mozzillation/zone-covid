import { FeatureCollection } from 'geojson'
import { getRegionsGeoJson, getCurrentRegion } from './'

async function getLocation(regionsObject: FeatureCollection, stateSetter, router, options?) {

  let detectedRegion

  const locationFromSession = window.sessionStorage.getItem('detected_region')

  if (locationFromSession && options?.force !== true) {
    // If there's already location data in storage,
    // we use that data...
    detectedRegion = JSON.parse(locationFromSession)

    stateSetter(prev => ({
      ...prev,
      appState: {
        ...prev.appState,
        loading: false
      },
      detectedRegion,
      selectedRegion: detectedRegion
    }))
    // if everything went well, we redirect user to proper region page
    router.push('/[id]', `/${detectedRegion.name}`, {
      shallow: true
    })

    // ...otherwise we query location data
  } else {

    // if device supports geolocation
    if ('geolocation' in navigator) {
      stateSetter(prev => ({
        ...prev,
        appState: {
          ...prev.appState,
          loading: true
        }
      }))
      // get position
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {

        if (!regionsObject) {
          regionsObject = await getRegionsGeoJson()
        }

        const point = [coords.longitude, coords.latitude]
        const { features } = regionsObject
        const detectedRegionList = await getCurrentRegion({ point, features })
        // get the first detected region
        detectedRegion = detectedRegionList[0]
        // save detected region in storage
        window.sessionStorage.setItem('detected_region', JSON.stringify(detectedRegion))

        stateSetter(prev => ({
          ...prev,
          detectedRegion,
          selectedRegion: detectedRegion
        }))
        // if everything went well, we redirect user to proper region page
        router.push('/[id]', `/${detectedRegion.name}`, {
          shallow: true
        })

      }, err => onError(err, stateSetter, router))
      // if device DOES NOT support geolocation...
    } else {
      // ...we should redirect to region selection!
      onError({ code: 0, message: 'not authorized' }, stateSetter, router)
    }
  }

}

const onError = (error: { code: number, message: string }, stateSetterFn: (args) => void, router) => {

  stateSetterFn(prev => ({
    ...prev,
    appState: {
      ...prev.appState,
      error: true,
      loading: false
    },
    error,
    detectedRegion: undefined,
    selectedRegion: undefined
  }))

  router.push('/italia.js', '/italia', {
    shallow: true
  })

}

export default getLocation