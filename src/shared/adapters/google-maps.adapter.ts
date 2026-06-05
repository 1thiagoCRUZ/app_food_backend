import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GeocodeResponse, Language } from '@googlemaps/google-maps-services-js';
import type { GeoCodingPort, GeoCoordinates, RouteResult } from '../ports/geo-coding.port';
@Injectable()
export class GoogleMapsAdapter implements GeoCodingPort {
  private readonly logger = new Logger(GoogleMapsAdapter.name);
  private readonly client: Client;
  private readonly apiKey: string | null;
  private readonly isSimulated: boolean;
  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    if (!key || key.includes('sua_chave') || key.includes('XXXXX')) {
      this.logger.warn(
        'GOOGLE_MAPS_API_KEY não configurada. Geocoding rodará em MODO SIMULADO (coordenadas fictícias).',
      );
      this.apiKey = null;
      this.isSimulated = true;
    } else {
      this.apiKey = key;
      this.isSimulated = false;
      this.client = new Client({});
      this.logger.log('Google Maps SDK inicializado com SUCESSO!');
    }
  }
  async geocodeAddress(address: string): Promise<GeoCoordinates | null> {
    if (this.isSimulated || !this.apiKey) {
      this.logger.log(`[Simulado] Geocodificando endereço: "${address}"`);
      return {
        lat: -23.5505 + (Math.random() - 0.5) * 0.1,
        lng: -46.6333 + (Math.random() - 0.5) * 0.1,
      };
    }
    try {
      const response: GeocodeResponse = await this.client.geocode({
        params: {
          address,
          key: this.apiKey,
          language: 'pt-BR',
          region: 'br',
        },
      });
      if (response.data.results.length === 0) {
        this.logger.warn(`Nenhum resultado de geocoding para: "${address}"`);
        return null;
      }
      const { lat, lng } = response.data.results[0].geometry.location;
      this.logger.log(`Geocoding OK: "${address}" → lat:${lat}, lng:${lng}`);
      return { lat, lng };
    } catch (error: any) {
      this.logger.error(`Erro ao geocodificar "${address}": ${error.message}`);
      return null;
    }
  }
  async calculateRoute(origin: GeoCoordinates, destination: GeoCoordinates): Promise<RouteResult | null> {
    if (this.isSimulated || !this.apiKey) {
      const deltaLat = Math.abs(destination.lat - origin.lat);
      const deltaLng = Math.abs(destination.lng - origin.lng);
      const distanceKm = Math.sqrt(deltaLat ** 2 + deltaLng ** 2) * 111;
      const distanceMeters = Math.round(distanceKm * 1000);
      const durationSeconds = Math.round(distanceMeters / 8); 
      this.logger.log(`[Simulado] Rota calculada: ~${distanceKm.toFixed(1)}km, ~${Math.round(durationSeconds / 60)}min`);
      return { distanceMeters, durationSeconds };
    }
    try {
      const response = await this.client.directions({
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          key: this.apiKey,
          language: Language.pt_BR,
          region: 'br',
        },
      });
      const route = response.data.routes?.[0]?.legs?.[0];
      if (!route) {
        this.logger.warn('Nenhuma rota encontrada pelo Google Maps.');
        return null;
      }
      const distanceMeters = route.distance?.value ?? 0;
      const durationSeconds = route.duration?.value ?? 0;
      this.logger.log(`Rota calculada: ${route.distance?.text}, ${route.duration?.text}`);
      return { distanceMeters, durationSeconds };
    } catch (error: any) {
      this.logger.error(`Erro ao calcular rota: ${error.message}`);
      return null;
    }
  }
}
