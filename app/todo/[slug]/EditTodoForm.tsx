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
import { useFormState } from "react-dom";
import FormSubmitButton from "@/components/FormSubmitButton";

export default function EditTodoForm({ id, text, firstName, lastName, status }: Todo) {
  const form = useForm<EditTodo>({
    resolver: zodResolver($EditTodo),
    defaultValues: { id, text, firstName: firstName || "", lastName: lastName || "", status },
  });

  const [delFormState, delFormAction] = useFormState(deleteTodo, undefined);

  const {
    handleSubmit,
    trigger,
    control,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  async function onSubmit(values: EditTodo) {
    const result = await editTodo(values);
    setError("root", { type: "custom", message: result?.error });
  }

  return (
    <main className="m-auto my-10 max-w-3xl space-y-10 px-3">
      <div className="space-y-6 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Edit the ToDo</h2>
            <p>Provide the ToDo details</p>
          </div>
          <form action={delFormAction}>
            <input readOnly type="hidden" name="id" value={id} />
            <FormSubmitButton className="" variant="destructive">
              Delete
            </FormSubmitButton>
            {delFormState?.error && <p className="text-sm text-red-500">{delFormState.error}</p>}
          </form>
        </div>
        <Form {...form}>
          <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
            {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
            <FormField
              control={control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input readOnly type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
