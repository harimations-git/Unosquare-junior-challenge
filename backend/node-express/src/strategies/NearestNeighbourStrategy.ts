import { RouteStrategy, MatchWithCity, OptimisedRoute, City } from './RouteStrategy';
import { buildRoute } from '../utils/buildRoute';
import { calculateDistance } from '../utils/haversine';

/**
 * NearestNeighbourStrategy — YOUR TASK #3
 *
 * Route optimisation using nearest-neighbour heuristic.
 *
 * ============================================================
 * WHAT YOU NEED TO IMPLEMENT:
 * ============================================================
 *
 * 1. optimise() method - The nearest-neighbour algorithm:
 *    - Sort matches by kickoff date
 *    - Group matches by date
 *    - For each date, pick the match nearest to your current city
 *    - Track your current city as you process each match
 *
 * 2. validateRoute() method - Validation checks:
 *    - Must have at least 5 matches
 *    - Must visit all 3 countries (USA, Mexico, Canada)
 *    - Set feasibility, warnings, and country coverage on the route
 *
 * ============================================================
 * HELPER METHODS PROVIDED (no changes needed):
 * ============================================================
 *
 * - buildRoute(orderedMatches, strategyName) - Builds the route from ordered matches
 * - calculateDistance(lat1, lon1, lat2, lon2) - Calculates distance between coordinates
 *
 * ============================================================
 */
export class NearestNeighbourStrategy implements RouteStrategy {
  private static readonly STRATEGY_NAME = 'nearest-neighbour';
  private static readonly REQUIRED_COUNTRIES = ['USA', 'Mexico', 'Canada'];
  private static readonly MINIMUM_MATCHES = 5;

  // ============================================================
  //  Nearest Neighbour Algorithm
  // ============================================================
  //
  // TODO: Implement the nearest-neighbour selection
  //
  // Steps:
  //   1. Handle empty/null matches - return createEmptyRoute()
  //   2. Sort matches by kickoff date
  //   3. Group matches by date (use match.kickoff.split('T')[0])
  //   4. For each date (in sorted order):
  //      - If only 1 match that day, add it to orderedMatches
  //      - If multiple matches, pick the nearest to currentCity
  //   5. Track currentCity as you process each match
  //   6. Build and validate route using buildRoute() and validateRoute()
  //
  // Hints:
  //   - Use calculateDistance(lat1, lon1, lat2, lon2) for distance
  //   - Group by date: match.kickoff.split('T')[0]
  //   - The first match in chronological order is your starting point
  //
  // ============================================================

  optimise(matches: MatchWithCity[], originCity?: City): OptimisedRoute {


    if (!matches || matches.length === 0) {
      return this.createEmptyRoute();
    }

    const orderedMatches: MatchWithCity[] = []; //matches to keep

    //Sort matches from earliest to latest using a copy of the original matches array
    const sortedMatches = [...matches].sort(
      (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime() //if negative then 'a' is first
    );

    //map to group matches by date
    const matchesByDate = new Map<string, MatchWithCity[]>();

    for (const match of sortedMatches) {

      const date = match.kickoff.split('T')[0];

      if (!matchesByDate.has(date)) {
        matchesByDate.set(date, []);
      }
      //add match to array
      matchesByDate.get(date)!.push(match);
    }

    //if user have a starting city, use it, else fall back to first city match
    let currentCity = originCity ?? sortedMatches[0].city;

    for (const [, dailyMatches] of matchesByDate) {
      let chosenMatch: MatchWithCity;

      if (dailyMatches.length === 1) {
        chosenMatch = dailyMatches[0];
      } else {
        //if there are multiple matches that day, reduce() gets the nearest one
        chosenMatch = dailyMatches.reduce((nearest, match) => {
          //distance to nearest match
          const nearestMatchDistance = calculateDistance(
            currentCity.latitude,
            currentCity.longitude,
            nearest.city.latitude,
            nearest.city.longitude
          );

          //distance to current match
          const currentMatchDistance = calculateDistance(
            currentCity.latitude,
            currentCity.longitude,
            match.city.latitude,
            match.city.longitude

          );

          return currentMatchDistance < nearestMatchDistance ? match : nearest;
        });
      }
      //add chosen match to the final route
      orderedMatches.push(chosenMatch);

      //update current city to be in the chosenMatch's city
      currentCity = chosenMatch.city;
    }

    const route = this.buildRoute(orderedMatches, originCity);
    this.validateRoute(route, orderedMatches);
    return route;
  }

  // ============================================================
  //  Validation — YOUR TASK
  // ============================================================
  //
  // TODO: Implement route validation
  //
  // Check the following constraints:
  //   1. Minimum matches - must have at least MINIMUM_MATCHES (5)
  //   2. Country coverage - must visit all REQUIRED_COUNTRIES (USA, Mexico, Canada)
  //
  // Set on the route:
  //   - route.feasible = true/false
  //   - route.warnings = list of warning messages
  //   - route.countriesVisited = list of countries
  //   - route.missingCountries = list of missing countries
  //
  // ============================================================

  private validateRoute(route: OptimisedRoute, matches: MatchWithCity[]): void {
    const warnings: string[] = [];

    //get all countries from the matches & remove duplicates
    const countriesVisited = [
      ...new Set(matches.map((match) => match.city.country))
    ];

    //check which countries were no visited
    const missingCountries =
      NearestNeighbourStrategy.REQUIRED_COUNTRIES.filter((country) => !countriesVisited.includes(country));

      if(matches.length < NearestNeighbourStrategy.MINIMUM_MATCHES){
        //push warning (matches < min matches)
        warnings.push(
          `Route only includes ${matches.length} matches. At least ${NearestNeighbourStrategy.MINIMUM_MATCHES} are required.`
        )
      }

      if(missingCountries.length > 0){
        //push warning (required countries not visited)
        warnings.push(
          `Route does not visit all required countries. Missing the following: ${missingCountries.join(", ")}.`
        );
      }

      //return true if both rules pass
      route.feasible = matches.length >= NearestNeighbourStrategy.MINIMUM_MATCHES && missingCountries.length === 0;

      route.warnings = warnings;
      route.countriesVisited = countriesVisited;
      route.missingCountries = missingCountries;
  }

  // ============================================================
  //  Helper Methods (provided - no changes needed)
  // ============================================================

  /**
   * Creates an empty route with appropriate warnings.
   */
  private createEmptyRoute(): OptimisedRoute {
    return {
      stops: [],
      totalDistance: 0,
      strategy: NearestNeighbourStrategy.STRATEGY_NAME,
      feasible: false,
      warnings: ['No matches selected', `Must select at least ${NearestNeighbourStrategy.MINIMUM_MATCHES} matches`],
      countriesVisited: [],
      missingCountries: [...NearestNeighbourStrategy.REQUIRED_COUNTRIES],
    };
  }

  /**
   * Builds an optimised route from ordered matches, including origin city distance.
   */
  private buildRoute(orderedMatches: MatchWithCity[], originCity?: City): OptimisedRoute {
    const route = buildRoute(orderedMatches, NearestNeighbourStrategy.STRATEGY_NAME);

    // Add distance from origin city to first match
    if (originCity && route.stops.length > 0) {
      const firstStop = route.stops[0];
      const distanceFromOrigin = calculateDistance(
        originCity.latitude,
        originCity.longitude,
        firstStop.city.latitude,
        firstStop.city.longitude
      );
      firstStop.distanceFromPrevious = distanceFromOrigin;
      route.totalDistance += distanceFromOrigin;
    }

    return route;
  }
}
