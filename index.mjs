import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();
import {
  getRequiredUnfilledQuestions,
  createJourney,
  patchJourney,
} from "./journey.mjs";
import answerJson from "./answer_sets/business.json" assert { type: "json" };

console.log("Creating journey...");
let response = await createJourney("business");
let authenticityToken = response.authenticityToken;
const savedResponses = [];

for (const answers of answerJson.answerSet) {
  console.log("Patching journey...");
  response = await patchJourney(
    response.id,
    response.journeyToken,
    authenticityToken,
    answers
  );
  savedResponses.push(response);

  authenticityToken = response.authenticityToken;
}

fs.writeFile("responses.json", JSON.stringify(savedResponses, null, 2));
