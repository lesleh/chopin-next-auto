import fs from "node:fs/promises";
import { JSONPath } from "jsonpath-plus";
import { fetchCookie } from "./fetchCookie.mjs";
import { exists } from "./util.mjs";

export async function createJourney(verticalName) {
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
        verticalName,
      }),
    }
  );

  const json = await response.json();

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

export function getQuestion(name) {
  return function (json) {
    return JSONPath({
      path: `$..questions[?(@.name === '${name}')]`,
      json,
    })[0];
  };
}
