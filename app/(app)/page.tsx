import TodoItem from "@/components/TodoItem";
import FilterSidebar from "@/components/FilterSidebar";
import H1 from "@/components/ui/h1";
import TodoList from "@/components/TodoList";
import { FilterSchema } from "@/lib/validation";
import { TodoStatus } from "@prisma/client";

type PageProps = {
  searchParams: {
    q?: string;
    status?: string;
    hasName?: string;
  };
};

export default async function Home({ searchParams: { q, status, hasName } }: PageProps) {
  const filterValues: FilterSchema = {
    q,
    status:
      status && Object.values(TodoStatus).includes(status as TodoStatus)
        ? (status as TodoStatus)
        : "",
    hasName: hasName === "true",
  };

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <H1>ToDo&apos;s</H1>
        <p className="text-muted-foreground">See easily what you have to do.</p>
      </div>

      <section className="flex flex-col gap-4 md:flex-row">
        <FilterSidebar {...filterValues} />
        <TodoList {...filterValues} />
      </section>
    </main>
  );
}
