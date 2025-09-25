// src/lib/kaggle.ts
export async function searchKaggleDatasets(query: string) {
  const username = process.env.KAGGLE_USERNAME;
  const key = process.env.KAGGLE_KEY;

  if (!username || !key) {
    throw new Error("Kaggle API credentials missing");
  }

  const auth = Buffer.from(`${username}:${key}`).toString("base64");

  const response = await fetch(
    `https://www.kaggle.com/api/v1/datasets/list?search=${query}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Kaggle API error: ${response.status}`);
  }

  return response.json();
}
