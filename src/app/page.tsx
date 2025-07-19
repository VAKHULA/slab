"use client"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
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
  );
}
