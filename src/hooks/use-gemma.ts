import * as React from 'react';

const url = 'http://localhost:11434/api/generate';

type Params = { systemPrompt: string; jsonSchema: string; userInput: string };

export function useGemma(params: Params) {
  const [data, setData] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const fetcher = async ({ systemPrompt, jsonSchema, userInput }: Params) => {
    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          model: 'gemma3:12b',
          format: 'json',
          stream: false,
          prompt: `system prompt: ${systemPrompt}. json schema: ${jsonSchema}. user input: ${userInput}`,
        }),
      });

      if (!response.ok) {
        setError(String(response.status));
      }

      const json = await response.json();
      const data = JSON.parse(json?.response);
      setData(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetcher(params);
  }, [params]);

  return { data, error, isLoading };
}
