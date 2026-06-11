import { fireEvent } from "@testing-library/react";

export const fillValidForm = async (user, screen) => {
  await user.type(screen.getByLabelText("Task name"), "Test Task");

  await user.type(screen.getByLabelText("Type"), "Bug");

  await user.type(screen.getByLabelText("Status"), "To do");

  const dueDateInput = screen.getByLabelText("Due Date");
  fireEvent.change(dueDateInput, {
    target: { value: new Date("2099-06-01T09:00") },
  });
};

export const submitForm = async (user, screen) => {
  await user.click(screen.getByRole("button", { name: /Submit task/i }));
};

export const submitValidForm = async (user, screen) => {
  await fillValidForm(user, screen);
  await submitForm(user, screen);
};
