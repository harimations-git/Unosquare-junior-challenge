import { NearestNeighbourStrategy } from '../src/strategies/NearestNeighbourStrategy';
import { MatchWithCity } from '../src/strategies/RouteStrategy';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

/**
 * NearestNeighbourStrategyTest — YOUR TASK #4
 *
 * ============================================================
 * WHAT YOU NEED TO IMPLEMENT:
 * ============================================================
 *
 * Write unit tests for the NearestNeighbourStrategy.
 * Each test has a TODO comment explaining what to test.
 *
 */

describe('NearestNeighbourStrategy', () => {
  let strategy: NearestNeighbourStrategy;

  beforeEach(() => {
    strategy = new NearestNeighbourStrategy();
  });

  const toronto = {
    id: 'city-1',
    name: 'Toronto',
    country: 'Canada',
    latitude: 43.6532,
    longitude: -79.3832,
    stadium: 'BMO Field',
    accommodation_per_night: 180,
  };

  const mexicoCity = {
    id: 'city-2',
    name: 'Mexico City',
    country: 'Mexico',
    latitude: 19.4326,
    longitude: -99.1332,
    stadium: 'Estadio Azteca',
    accommodation_per_night: 140,
  };

  const newYork = {
    id: 'city-3',
    name: 'New York',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.006,
    stadium: 'MetLife Stadium',
    accommodation_per_night: 220,
  };

  const brazil = { id: 't1', name: 'Brazil', code: 'BRA', group: 'A' };
  const france = { id: 't2', name: 'France', code: 'FRA', group: 'A' };
  const argentina = { id: 't3', name: 'Argentina', code: 'ARG', group: 'B' };
  const spain = { id: 't4', name: 'Spain', code: 'ESP', group: 'B' };
  const germany = { id: 't5', name: 'Germany', code: 'GER', group: 'C' };
  const japan = { id: 't6', name: 'Japan', code: 'JPN', group: 'C' };

  const multipleMatches: MatchWithCity[] = [
    {
      id: 'match-1',
      homeTeam: brazil,
      awayTeam: france,
      city: toronto,
      group: 'Group A',
      matchDay: 1,
      ticketPrice: 120,
      kickoff: '2026-06-11T18:00:00.000Z',
    },
    {
      id: 'match-2',
      homeTeam: argentina,
      awayTeam: spain,
      city: mexicoCity,
      group: 'Group B',
      matchDay: 2,
      ticketPrice: 140,
      kickoff: '2026-06-15T18:00:00.000Z',
    },
    {
      id: 'match-3',
      homeTeam: germany,
      awayTeam: japan,
      city: newYork,
      group: 'Group C',
      matchDay: 3,
      ticketPrice: 160,
      kickoff: '2026-06-19T18:00:00.000Z',
    },
  ];


  it('should return a valid route for multiple matches (happy path)', () => {
    // TODO: Implement test
    // Arrange: Create an array of matches across different cities and dates
    // Act: Call strategy.optimise(matches)
    // Assert: Verify the result has stops, totalDistance > 0, and strategy = 'nearest-neighbour'
    const result = strategy.optimise(multipleMatches);

    expect(result.stops.length).toBe(3);
    expect(result.totalDistance).toBeGreaterThan(0);
    expect(result.strategy).toBe('nearest-neighbour');
  });

  it('should return an empty route for empty matches', () => {
    // TODO: Implement test
    // Arrange: Create an empty array of matches
    // Act: Call strategy.optimise([])
    // Assert: Verify the result has empty stops and totalDistance = 0
    const result = strategy.optimise([]);
    
    expect(result.stops).toEqual([]);
    expect(result.totalDistance).toBe(0);
  });

  it('should return zero distance for a single match', () => {
    // TODO: Implement test
    // Arrange: Create an array with a single match
    // Act: Call strategy.optimise(matches)
    // Assert: Verify totalDistance = 0 and stops.length = 1
    const result = strategy.optimise([multipleMatches[0]]); //pass in one match

    expect(result.totalDistance).toBe(0);
    expect(result.stops.length).toBe(1);   
  });
});
