export const errorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.error(err);
  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
