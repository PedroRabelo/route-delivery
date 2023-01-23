import NodeGeocoder = require('node-geocoder');

export async function getLatLongFromAddress(address: string) {
  const geocoder = NodeGeocoder({
    provider: 'openstreetmap',
    httpAdapter: 'https',
  });

  try {
    const response: NodeGeocoder.Entry[] = await geocoder.geocode(address);

    return {
      latitude: response[0]?.latitude,
      longitude: response[0]?.longitude,
    };
  } catch (err) {
    console.log(err);
  }
}

/* const address = orderValidated.endereco
.concat(' ', orderValidated.numero)
.concat(' ', orderValidated.cidade)
.concat(' ', orderValidated.estado);

await getLatLongFromAddress(address).then((res) => {
orderValidated.latitude = res.latitude;
orderValidated.longitude = res.longitude; */
