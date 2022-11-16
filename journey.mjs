import fs from "node:fs/promises";
import { JSONPath } from "jsonpath-plus";
import { fetchCookie } from "./fetchCookie.mjs";
import { exists } from "./util.mjs";

export async function createJourney() {
  if (
    process.env.CACHE_RESPONSES === "true" &&
    (await exists("journey.json"))
  ) {
    return JSON.parse(await fs.readFile("journey.json"));
  }

  const response = await fetchCookie(
    `${process.env.JOURNEY_API_HOST}/api/v0/journeys`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        verticalName: "business",
      }),
    }
  );

  const text = await response.text();
  await fs.writeFile("journey.html", text);

  const json = JSON.parse(text);

  if (process.env.CACHE_RESPONSES) {
    await fs.writeFile("journey.json", JSON.stringify(json));
  }

  return json;
}

export async function patchJourney(
  journeyId,
  journeyToken,
  authenticityToken,
  answers
) {
  const url = `${process.env.JOURNEY_API_HOST}/api/v0/journeys/${journeyId}`;
  const response = await fetchCookie(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      journeyToken,
      authenticityToken,
      answers,
    }),
  });

  return response.json();
}

export function getRequiredQuestions(json) {
  return JSONPath({
    path: "$..questions[?(@.required)]",
    json,
  });
}