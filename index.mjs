import dotenv from "dotenv";
dotenv.config();
import { JSONPath } from "jsonpath-plus";
import {
  createJourney,
  patchJourney,
  getRequiredQuestions,
  getQuestion,
} from "./journey.mjs";

const getPrimaryTrade = getQuestion("primary_trade");

const journey = await createJourney();
console.log(getPrimaryTrade(journey));

const response = await patchJourney(
  journey.id,
  journey.journeyToken,
  journey.authenticityToken,
  {
    primary_trade: "Builder",
  }
);

console.log(getPrimaryTrade(response));
