import { CityName } from './city-name.enum.js';
import { City } from './city.type.js';

export const Cities: City[] = [
  {
    'name': CityName.Paris,
    'location': {
      'latitude': 48.85661,
      'longitude': 2.351499,
    }
  },
  {
    'name': CityName.Cologne,
    'location': {
      'latitude': 50.938361,
      'longitude': 6.959974,
    }
  },
  {
    'name': CityName.Brussels,
    'location': {
      'latitude': 50.846557,
      'longitude': 4.351697,
    }
  },
  {
    'name': CityName.Amsterdam,
    'location': {
      'latitude': 52.37454,
      'longitude': 4.897976,
    }
  },
  {
    'name': CityName.Hamburg,
    'location': {
      'latitude': 53.550341,
      'longitude': 10.000654,
    }
  },
  {
    'name': CityName.Dusseldorf,
    'location': {
      'latitude': 51.225402,
      'longitude': 6.776314,
    }
  }
] as const;

export function getCity(cityName: string): City {
  return Cities.find((item) => {
    if (item) {
      return (item.name === cityName);
    }
    return undefined;
  });
}
