import dotenv from "dotenv";
dotenv.config();
import { createJourney, patchJourney, getQuestion } from "./journey.mjs";

const getPrimaryTrade = getQuestion("primary_trade");

const journey = await createJourney("business");
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
