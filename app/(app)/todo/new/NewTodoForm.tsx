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
import { $CreateTodo, CreateTodo } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { createTodo } from "./actions";

export default function NewTodoForm() {
  const form = useForm<CreateTodo>({
    resolver: zodResolver($CreateTodo),
  });

  const {
    handleSubmit,
    trigger,
    control,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: CreateTodo) {
    try {
      await createTodo(values);
    } catch {
      alert("Something went wrong, lease try again.");
    }
  }

  return (
    <main className="m-auto my-10 max-w-3xl space-y-10 px-3">
      <div className="space-y-6 rounded-lg border p-4">
        <div>
          <h2 className="font-semibold">Create a ToDo</h2>
          <p>Provide the ToDo details</p>
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
