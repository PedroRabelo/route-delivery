export function convertLatLongFloat(coord: number) {
  const length = coord.toString().length;
  const position = coord.toString().substring(0, 3);
  const decimal = coord.toString().substring(3, length);

  return Number(position.concat('.').concat(decimal));
}
