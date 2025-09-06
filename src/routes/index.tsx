import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export const Route = createFileRoute("/")({
  component: RouteComponent,
});


function RouteComponent() {
  return (
    <main className="p-8 ">
        <Card>
          <CardHeader>
            <CardTitle>Shared Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Shared folders allow you to create a set of Memorization Items that can be accessed by anyone with the public link.</p>
            <p>See <Button variant='link' asChild>
              <Link to="https://memorypie.app">
              MemoryPie.app
              </Link>
              </Button> for the main Memorypie App</p>
          </CardContent>
        </Card>
    </main>
  );
}
