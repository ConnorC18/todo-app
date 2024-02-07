import { TodoStatus } from "@prisma/client";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";
import FormSubmitButton from "./FormSubmitButton";
import { $FilterSchema, FilterSchema } from "@/lib/validation";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

async function filterTodos(formData: FormData) {
  "use server";

  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // console.log(formData.get("q") as string);

  const values = Object.fromEntries(formData.entries());
  const { q, status, hasName } = $FilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(status && { status }),
    ...(hasName && { hasName: "true" }),
  });

  redirect(`/?${searchParams.toString()}`);
}

export default async function FilterSidebar({ q, status, hasName }: FilterSchema) {
  const userRole = (await auth())?.user?.role;

  return (
    <aside className="top-0 h-fit rounded-lg border bg-background p-4 md:sticky md:w-[260px]">
      <form action={filterTodos} className="space-y-4" key={JSON.stringify({ q, status, hasName })}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="q">Search</Label>
          <Input id="q" name="q" placeholder="..." defaultValue={q} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={status}>
            <option value="">All</option>
            {Object.values(TodoStatus).map((status) => {
              if (userRole != "ADMIN" && status == "InReview") return;

              return (
                <option key={status} value={status}>
                  {status}
                </option>
              );
            })}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="hasName"
            name="hasName"
            type="checkbox"
            className="scale-125 accent-black"
            defaultChecked={hasName}
          />
          <Label htmlFor="hasName">Has Name</Label>
        </div>
        <FormSubmitButton className="w-full">Submit</FormSubmitButton>
      </form>
    </aside>
  );
}
