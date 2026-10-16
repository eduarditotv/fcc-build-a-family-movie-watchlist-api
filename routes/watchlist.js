import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import * as db from "../utils/db.js";

const router = express.Router();

router.use(authenticate);

router.get("/:userId", (req, res) => {
  const watchlist = db.getWatchlist(Number(req.params.userId));
  if (watchlist === null) {
    return res.status(404).json({ error: "User not found." });
  }
  return res.status(200).json(watchlist);
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const movie = db.addMovie(Number(req.params.userId), req.body);
  if (!movie) {
    return res.status(404).json({ error: "User not found." });
  }
  return res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const movie = db.updateMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
    req.body,
  );
  if (!movie) {
    return res.status(404).json({ error: "Movie not found." });
  }
  return res.status(200).json(movie);
});

router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const removed = db.deleteMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
  );
  if (!removed) {
    return res.status(404).json({ error: "Movie not found." });
  }
  return res.status(200).json({ message: "Movie removed." });
});

export default router;