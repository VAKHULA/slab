"use client"
import dynamic from 'next/dynamic'
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
const Viewer = dynamic(() => import("@/components/viewer"), { ssr: false });

export default function Home() {
  return (
    <>
      <Viewer>
        fff
      </Viewer>
      <div className='main-input'>
        <Card>
          <CardContent>
            <Textarea rows={1} />
          </CardContent>
          <CardFooter>
            <p>
              <Button variant="outline">Button</Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
