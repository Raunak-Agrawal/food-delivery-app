import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request.js";
import { verifyToken } from "../middlewares/verify-token.js";
import Restaurant from "../models/restaurant.js";

const router = express.Router();
const limit_ = 5;

router.post(
  "/api/v1/restaurants",
  verifyToken,
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("address").not().isEmpty().withMessage("Address is required"),
    body("starting_price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req, res) => {
    const newRestaurant = new Restaurant({
      name: req.body.name,
      address: req.body.address,
      cuisines: req.body.cuisines,
      feature_image: req.body.feature_image,
      starting_price: req.body.starting_price,
      menu: req.body.menu,
    });
    // save to the db
    newRestaurant
      .save()
      .then((r) => {
        res.status(201).send(r);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  }
);

router.get("/api/v1/restaurants/:id", verifyToken, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ id: req.params.id });
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(400).send(`Unable to process your request - ${err}`);
  }
});

router.get("/api/v1/restaurants", verifyToken, async (req, res) => {
  try {
    let aggregate_options = [];

    //partial text search for name
    let search_by_name = !!req.query.name;

    if (search_by_name) {
      let match_regex_name = { $regex: req.query.name, $options: "i" }; // adding the 'i' flag for the search to be case insensitive
      aggregate_options.push({ $match: { name: match_regex_name } });
    }

    //full text search for place
    let search_by_place = !!req.query.place;

    if (search_by_place) {
      let match_regex_place = { $eq: req.query.place };
      aggregate_options.push({ $match: { address: match_regex_place } });
    }

    // filter by cuisines
    //find in cuisines
    let search_by_cuisines = !!req.query.cuisines;

    if (search_by_cuisines) {
      let match_regex_cuisines = { $in: req.query.cuisines.split(",") };
      aggregate_options.push({ $match: { cuisines: match_regex_cuisines } });
    }

    //pagination
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || limit_,
      customLabels: {
        totalDocs: "totalResults",
        docs: "restaurants",
      },
    };

    // Sort by price
    let sort_order =
      req.query.sort_order && req.query.sort_order === "desc" ? -1 : 1;
    let sort_by = req.query.sort_by || "starting_price";
    aggregate_options.push({
      $sort: {
        [sort_by]: sort_order,
        _id: 1,
      },
    });
    //select fields
    aggregate_options.push({
      $project: {
        _id: 1,
        name: 1,
        address: 1,
        starting_price: 1,
        cuisines: 1,
        feature_image: 1,
        menu: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    });

    // change _id to id
    aggregate_options.push(
      // change the "_id" to "id"
      { $addFields: { id: "$_id" } },
      { $unset: ["_id"] }
    );

    // Set up the aggregation
    const myAggregate = Restaurant.aggregate(aggregate_options);
    const result = await Restaurant.aggregatePaginate(myAggregate, options);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).send(`Unable to process your request - ${err}`);
  }
});

export { router as restaurantRouter };
