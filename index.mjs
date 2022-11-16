import dotenv from "dotenv";
dotenv.config();
import {
  createJourney,
  patchJourney,
  getRequiredQuestions,
} from "./journey.mjs";

const journey = await createJourney();
console.log(getRequiredQuestions(journey));

const response = await patchJourney(
  journey.id,
  journey.journeyToken,
  journey.authenticityToken,
  {
    primary_trade: "Builder",
  }
);

console.log(getRequiredQuestions(journey));
