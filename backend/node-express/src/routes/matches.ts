import { Router } from 'express';
import * as MatchModel from '../models/Match';

const router = Router();

/**
 * Match Routes — YOUR TASK #2
 *
 * Implement the REST endpoints for matches.
 */

// ============================================================
//  GET /api/matches — Return matches with optional filters
// ============================================================
//
// TODO: Implement this endpoint
//
// Query parameters (both optional):
//   ?city=city-atlanta    → filter by city ID
//   ?date=2026-06-14      → filter by date (YYYY-MM-DD)
//
// Hint: MatchModel.getAll() accepts an optional filters object:
//   MatchModel.getAll({ city: 'city-atlanta', date: '2026-06-14' })
//
// The model already handles the filtering — you just need to
// extract the query params and pass them through.
//
// Expected response: [{ id, homeTeam, awayTeam, city, kickoff, group, matchDay }, ...]
//   where homeTeam, awayTeam, and city are full objects (not just IDs)
//
// ============================================================

router.get('/', (_req, res) => {

  const filters : {city?: string; date? :string } = {};

  //Filter the params
  if (_req.query.city) filters.city = String(_req.query.city);
  if (_req.query.date) filters.date = String(_req.query.date);

  const matches = MatchModel.getAll(filters);
  
  res.status(200).json(matches);
});

// ============================================================
//  GET /api/matches/:id — Return a single match by ID
// ============================================================
//
// TODO: Implement this endpoint
//
// Hint: MatchModel.getById(id) returns a match or undefined.
// Return 404 if the match is not found.
//
// ============================================================

router.get('/:id', (_req, res) => {
  
  const {id} = _req.params;
  const match = MatchModel.getById(id);

  if(!match){
    return res.status(404).json({ error: "Match not found"})
  }
  
  res.status(200).json(match);
});

export default router;
