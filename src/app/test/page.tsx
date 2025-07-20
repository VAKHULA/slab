'use client';
import { useState } from 'react';
import toJsonSchema from 'to-json-schema';
import { LoaderCircle, ArrowUpIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const initialValues = {
  systemPrompt: `
    you are assistance which help to make course content,
    based on input generate list of chapters with titles and small summary.
    all colors in hex format.
    response with json only.
  `,
  jsonObject: `{
  "title": "",
  "description": "",
  "items": [
    {
      "title": "",
      "description": ""
    }
],
  "theme": {
    "custom-nav-hover": "",
    "custom-nav-text": "",
    "custom-bg": "",
    "custom-bg-secondary": "",
    "custom-text": "",
    "custom-button": "",
    "custom-button-hover": "",
    "custom-button-text": "",
    "custom-footer": "",
    "header-font": "",
    "body-font": "",
    "border-radius": 0
  }
}`,
  jsonSchema: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Generated schema for Root",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          }
        },
        "required": [
          "title",
          "description"
        ]
      }
    },
    "theme": {
      "type": "object",
      "properties": {
        "custom-nav-hover": {
          "type": "string"
        },
        "custom-nav-text": {
          "type": "string"
        },
        "custom-bg": {
          "type": "string"
        },
        "custom-bg-secondary": {
          "type": "string"
        },
        "custom-text": {
          "type": "string"
        },
        "custom-button": {
          "type": "string"
        },
        "custom-button-hover": {
          "type": "string"
        },
        "custom-button-text": {
          "type": "string"
        },
        "custom-footer": {
          "type": "string"
        },
        "header-font": {
          "type": "string"
        },
        "body-font": {
          "type": "string"
        },
        "border-radius": {
          "type": "number"
        }
      },
      "required": [
        "custom-nav-hover",
        "custom-nav-text",
        "custom-bg",
        "custom-bg-secondary",
        "custom-text",
        "custom-button",
        "custom-button-hover",
        "custom-button-text",
        "custom-footer",
        "header-font",
        "body-font",
        "border-radius"
      ]
    }
  },
  "required": [
    "title",
    "description",
    "items",
    "theme"
  ]
}`,
  inputText: `growing bonsai course in a green theme`,
};

export default function TestPage() {
  const [url, seturl] = useState('http://localhost:11434/api/generate');
  const [model, setModel] = useState('gemma3:12b');
  const [systemPrompt, setSystemPrompt] = useState(initialValues.systemPrompt);
  const [jsonObject, setJsonObject] = useState(initialValues.jsonObject);
  const [JSONSchema, setJSONSchema] = useState(initialValues.jsonSchema);
  const [inputText, setInputText] = useState(initialValues.inputText);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Card
        className="w-[800px] mx-auto my-10"
        style={{ maxHeight: '100vh', overflowY: 'auto' }}
      >
        <CardContent>
          <Label className="text-sm">url</Label>
          <Textarea
            className="mb-5"
            value={url}
            onChange={(e) => {
              seturl(e.target.value);
            }}
          />
          <Label className="text-sm">model</Label>
          <Textarea
            className="mb-5"
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
            }}
          />
          <Label className="text-sm">system prompt</Label>
          <Textarea
            className="mb-5"
            value={systemPrompt}
            onChange={(e) => {
              setSystemPrompt(e.target.value);
            }}
          />
          <Label className="text-sm">input object</Label>
          <Textarea
            className="mb-5"
            value={jsonObject}
            onChange={(e) => {
              setJsonObject(e.target.value);
              setJSONSchema(
                JSON.stringify(toJsonSchema(JSON.parse(e.target.value)), null, '  '),
              );
            }}
          />
          <Label className="text-sm">JSON schema</Label>
          <Textarea
            className="mb-5"
            value={JSONSchema}
            onChange={(e) => {
              setJSONSchema(e.target.value);
            }}
          />
          <Label className="text-sm">input text</Label>
          <Textarea
            className="mb-5"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <Button
            onClick={async () => {
              try {
                setIsLoading(true);
                setOutput('');

                const response = await fetch(url, {
                  method: 'POST',
                  mode: 'no-cors',
                  body: JSON.stringify({
                    model: model,
                    format: 'json',
                    stream: false,
                    prompt: `system prompt: ${systemPrompt}. json schema: ${JSONSchema.replaceAll('\"', '"')}. user input: ${inputText}`,
                  }),
                });

                const json = await response.json();
                const data = JSON.parse(json?.response);
                setOutput(JSON.stringify(data, null, '  '));
                setIsLoading(false);
              } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
              }
            }}
          >
            send{' '}
            {isLoading ? <LoaderCircle className="animate-spin" /> : <ArrowUpIcon />}{' '}
          </Button>
          <Label className="text-sm mt-5">output</Label>
          <Textarea
            className="mb-5"
            value={output}
            onChange={(e) => {
              setOutput(e.target.value);
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
