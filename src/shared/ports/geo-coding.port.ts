export interface GeoCoordinates {
  lat: number;
  lng: number;
}
export interface RouteResult {
  distanceMeters: number;
  durationSeconds: number;
}
export interface GeoCodingPort {
    geocodeAddress(address: string): Promise<GeoCoordinates | null>;
    calculateRoute(origin: GeoCoordinates, destination: GeoCoordinates): Promise<RouteResult | null>;
}
export const GEO_CODING_PORT = 'GEO_CODING_PORT';
