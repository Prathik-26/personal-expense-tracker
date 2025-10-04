const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const auth = require("../middlewares/authMiddleware");

const runValidation = (res, req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  return next();
};

//Create an expense
router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("amount")
      .exists()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount must be a number"),
    body("category")
      .optional()
      .isString()
      .withMessage("Category must be a string"),
    body("date")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Date must be valid"),
    body("notes").optional().isString(),
  ],
  runValidation,
  (req, res) => expenseController.addExpense(req, res)
);

//List expenses
router.get("/", auth, (req, res) => expenseController.getExpenses(req, res));

//Update expense
router.put(
  "/:id",
  auth,
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("amount")
      .optional()
      .isNumeric()
      .withMessage("Amount must be a number"),
    body("category")
      .optional()
      .isString()
      .withMessage("Category must be a string"),
    body("date")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Date must be valid"),
    body("notes").optional().isString(),
  ],
  runValidation,
  (req, res) => expenseController.updateExpense(req, res)
);

//Delete expense
router.delete("/:id", auth, (req, res) =>
  expenseController.deleteExpense(req, res)
);

module.exports = router;
