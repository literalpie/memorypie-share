import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "#src/components/ui/card";
import { Button } from "#src/components/ui/button";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="p-8 ">
      <Card>
        <CardHeader>
          <CardTitle>MemoryPie Share</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This site can be used to create shared folders of memorization items for MemoryPie,
            which can be accessed by anyone with the public link.
          </p>
          <p>
            See{" "}
            <Button variant="link" asChild>
              <Link to="https://memorypie.app">MemoryPie.app</Link>
            </Button>{" "}
            for the main Memorypie App where you can create private memorization items and do the
            actual memorization.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
