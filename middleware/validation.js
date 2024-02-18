const dataMethods = ["body", "headers", "params", "query"];

export const validation = (schema) => {
  return (req, res, next) => {
    const validationArr = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult?.error?.details) {
          validationArr.push(validationResult.error.details);
        }
      }
    });
    if (validationArr.length) {
      res.json({ message: "validation error", err: validationArr });
    } else {
      next();
    }
  };
};
