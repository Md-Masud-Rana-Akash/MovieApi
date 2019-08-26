const { validateRental, Rental } = require("../models/rental.js");
const { Movie } = require("../models/movie.js");
const { Customer } = require("../models/customer.js");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(404).send("Sorry the customer was not found");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Sorry the movie was not found");

  if (movie.numberInStock === 0)
    return res.status(404).send("movie is not instock");

  // let up = 0;

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: customer._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  // if(rental.up.up != 0){
  //     rental = await rental.save();
  //     up++;
  //     movie.numberInStock-1;
  //     up++;
  // }

  //  if(up==2){
  //      movie.save();
  //  }

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();
    res.send(rental);
  } catch (error) {
    res.status(500).send("Something failed");
  }
});

module.exports = router;
