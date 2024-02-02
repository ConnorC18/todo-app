import { Metadata } from "next";
import NewTodoForm from "./NewTodoForm";

export const metadata: Metadata = {
  title: "Make a new ToDo",
};

export default function Page() {
  return <NewTodoForm />;
}
