import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { ReactNode } from 'react';
import RouteMap from '../src/components/RouteMap';
import { OptimisedRoute } from '../src/types';


// Mock react-leaflet so we test our component, not Leaflet itself
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="title-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
  Polyline: () => <div data-testid="polyline" />,
}))

describe('RouteMap', () => {
  const originCity = {
    id: 'origin-1',
    name: 'London',
    country: 'England',
    latitude: 51.5072,
    longitude: -0.1276,
    stadium: 'N/A',
    accommodationPerNight: 200,
  }

  const toronto = {
    id: 'city-1',
    name: 'Toronto',
    country: 'Canada',
    latitude: 43.6532,
    longitude: -79.3832,
    stadium: 'BMO Field',
    accommodationPerNight: 180,
  };

  const mexicoCity = {
    id: 'city-2',
    name: 'Mexico City',
    country: 'Mexico',
    latitude: 19.4326,
    longitude: -99.1332,
    stadium: 'Estadio Azteca',
    accommodationPerNight: 140,
  };

  const newYork = {
    id: 'city-3',
    name: 'New York',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.006,
    stadium: 'MetLife Stadium',
    accommodationPerNight: 220,
  };

  const mockRoute: OptimisedRoute = {
    totalDistance: 5000,
    feasible: true,
    strategy: 'nearest-neighbour',
    countriesVisited: ['Canada', 'Mexico', 'USA'],
    missingCountries: [],
    warnings: [],
    stops: [
      {
        stopNumber: 1,
        distanceFromPrevious: 0,
        city: toronto,
        match: {
          id: 'match-1',
          homeTeam: { id: 't1', name: 'Brazil', code: 'BRA', group: 'A' },
          awayTeam: { id: 't2', name: 'France', code: 'FRA', group: 'B' },
          city: toronto,
          group: 'Group A',
          matchDay: 1,
          ticketPrice: 120,
          kickoff: '2026-06-11T18:00:00.000Z',
        },
      },
      {
        stopNumber: 2,
        distanceFromPrevious: 1200,
        city: mexicoCity,
        match: {
          id: 'match-2',
          homeTeam: { id: 't3', name: 'Argentina', code: 'ARG', group: 'C' },
          awayTeam: { id: 't4', name: 'Spain', code: 'ESP', group: 'D' },
          city: mexicoCity,
          group: 'Group C',
          matchDay: 2,
          ticketPrice: 140,
          kickoff: '2026-06-15T18:00:00.000Z',
        },
      },
      {
        stopNumber: 3,
        distanceFromPrevious: 1800,
        city: newYork,
        match: {
          id: 'match-3',
          homeTeam: { id: 't5', name: 'Germany', code: 'GER', group: 'E' },
          awayTeam: { id: 't6', name: 'Japan', code: 'JPN', group: 'F' },
          city: newYork,
          group: 'Group E',
          matchDay: 3,
          ticketPrice: 160,
          kickoff: '2026-06-19T18:00:00.000Z',
        },
      },
    ],
  };

  it('should render placeholder message when route is null', () => {
    // TODO: Implement test
    // Arrange: Render RouteMap with route={null}
    // Assert: Verify placeholder message is displayed

    render(<RouteMap route={null} originCity={null} />);

    expect(screen.getByText('Route Map')).toBeInTheDocument();
    expect(
      screen.getByText('Validate a route to see it displayed on the map.')
    ).toBeInTheDocument();
  });

  it('should render a map container when route is provided', () => {
    // TODO: Implement test
    // Arrange: Create a mock route with stops
    // Act: Render RouteMap with the route
    // Assert: Verify MapContainer is rendered

    render(<RouteMap route={mockRoute} originCity={originCity} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('should render a marker for each stop in the route', () => {
    // TODO: Implement test
    // Arrange: Create a mock route with 3 stops
    // Act: Render RouteMap with the route
    // Assert: Verify 3 markers are rendered

    render(<RouteMap route={mockRoute} originCity={null} />); //originCity={null} isolates the stop markers
    expect(screen.getAllByTestId('marker')).toHaveLength(3);
  });

  it('should handle route with empty stops array', () => {
    // TODO: Implement test
    // Arrange: Create a mock route with empty stops array
    // Act: Render RouteMap with the route
    // Assert: Verify component handles edge case gracefully
    const emptyRoute : OptimisedRoute = {
      ...mockRoute,
      stops: [],
      countriesVisited: [],
      missingCountries: [],
      warnings: [],
    }

    render(<RouteMap route={emptyRoute} originCity={originCity} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument(); //verify map still renders
    expect(screen.getAllByTestId('marker')).toHaveLength(1); //verifies exactly 1 marker (originCity) exists
  });
});
