'use client';
import dynamic from 'next/dynamic';
import { LoaderCircle, ArrowUpIcon } from 'lucide-react';
import { Toaster } from 'sonner';
// import { z } from 'zod';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { PlateEditor } from '@/components/editor/plate-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Page from '@/components/page';
import { Shadertoy } from '@/components/shadertoy';
import { Stager } from '@/components/stager';

const Viewer = dynamic(() => import('@/components/viewer'), { ssr: false });

// import useGemma from "@/hooks/useGemma";

// const systemPrompt = `
//     you are assistance which help to make course content,
//     based on input generate list of chapters with titles and small summary.
//     all colors in hex format.
//     response with json only.
//   `;
// const jsonSchema = ``;

// const initialValue = [
//   {
//     type: 'p',
//     children: [
//       { text: 'Hello! Try out the ' },
//       { text: 'bold', bold: true },
//       { text: ', ' },
//       { text: 'italic', italic: true },
//       { text: ', and ' },
//       { text: 'underline', underline: true },
//       { text: ' formatting.' },
//     ],
//   },
// ];
const GlobalDndContext = (props) => {
  return (
    <DndProvider backend={HTML5Backend} key={1}>
      {props.children}
    </DndProvider>
  );
};

export default function HomePage() {
  // const schema = z.object({
  //   characters: z.array(
  //     z.object({
  //       name: z.string().describe('The name of a character'),
  //       animal: z.string().describe('The type of animal'),
  //       cheese: z
  //         .optional(z.boolean())
  //         .describe(
  //           'Please indicate if the character owns the cheese at the end of the story.',
  //         ),
  //     }),
  //   ),
  // });
  // console.log(z.toJSONSchema(schema));
  // console.log(schema);
  return (
    <>
      <GlobalDndContext>
        <Viewer>
          <Stager>
            <Page header="" footer="">
              <div className="w-full">
                <PlateEditor />
                <Toaster />
              </div>
            </Page>
            <Page header="" footer="">
              <div className="w-full">
                <PlateEditor />
                <Toaster />
              </div>
            </Page>
            <Page header="" footer="">
              <div className="w-full">
                <PlateEditor />
                <Toaster />
              </div>
            </Page>
            <Page header="" footer="">
              <div className="w-full">
                <PlateEditor />
                <Toaster />
              </div>
            </Page>
            <Page header="" footer="">
              <div className="w-full">
                <PlateEditor />
                <Toaster />
              </div>
            </Page>
            <Page header="" footer="">
              <div className="w-full">
                <PlateEditor />
                <Toaster />
              </div>
            </Page>
          </Stager>
        </Viewer>
        <div className="main-input">
          <Card>
            <CardContent>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                }}
                className="relative w-full"
              >
                <Input
                  id="message"
                  placeholder="Type your message..."
                  className="flex-1 pr-10"
                  autoComplete="off"
                  value={'input'}
                  onChange={(event) => {}}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute top-1/2 right-2 size-6 -translate-y-1/2 rounded-full"
                  disabled={false}
                >
                  <LoaderCircle className="size-3.5 animate-spin" />
                  {/* <ArrowUpIcon className="size-3.5" /> */}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Shadertoy />
      </GlobalDndContext>
    </>
  );
}

{
  /* <Button size="sm" disabled>
      <Loader2Icon className="animate-spin" />
      Please wait
    </Button> */
}
