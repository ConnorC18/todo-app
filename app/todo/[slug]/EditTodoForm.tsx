"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { $EditTodo, EditTodo } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { Todo, TodoStatus } from "@prisma/client";
import Select from "@/components/ui/select";
import { deleteTodo, editTodo } from "./actions";
import { useState } from "react";

export default function EditTodoForm({ id, text, firstName, lastName, status }: Todo) {
  const form = useForm<EditTodo>({
    resolver: zodResolver($EditTodo),
    defaultValues: { text, firstName: firstName || "", lastName: lastName || "", status },
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: EditTodo) {
    try {
      await editTodo({ id, ...values } as Todo); // Make better
    } catch {
      alert("Something went wrong, lease try again.");
    }
  }

  return (
    <main className="m-auto my-10 max-w-3xl space-y-10 px-3">
      <div className="space-y-6 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Edit the ToDo</h2>
            <p>Provide the ToDo details</p>
          </div>
          <LoadingButton
            className=""
            variant="destructive"
            loading={isDeleting}
            onClick={async () => {
              setIsDeleting(true); // Make better
              await deleteTodo(id);
              setIsDeleting(false);
            }}
          >
            Delete
          </LoadingButton>
        </div>
        <Form {...form}>
          <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      {Object.values(TodoStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-6">
              <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Optional"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          trigger("firstName");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <LoadingButton className="w-full" type="submit" loading={isSubmitting}>
              Done
            </LoadingButton>
          </form>
        </Form>
      </div>
    </main>
  );
}
