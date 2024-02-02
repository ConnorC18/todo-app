import { relativeDate } from "@/lib/utils";
import { Todo } from "@prisma/client";
import Badge from "./Badge";

export default function TodoItem({
  id,
  text,
  firstName,
  lastName,
  status,
  createdAt,
  updatedAt,
}: Todo) {
  let createBy = null;
  if (firstName && lastName) createBy = `${firstName} ${lastName}`;

  return (
    <div className="flex rounded-lg border p-5 hover:bg-muted">
      <div className="flex flex-grow flex-col gap-2">
        <h2 className="text-xl">{text}</h2>
        <div className="flex gap-2">
          {createBy && <p className="text-sm">{createBy}</p>}
          <p className="my-auto text-end align-bottom text-xs text-muted-foreground">
            {relativeDate(createdAt)}
          </p>
        </div>
      </div>

      <Badge>{status}</Badge>
    </div>
  );
}
