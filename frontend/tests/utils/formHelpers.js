export const fillValidForm = async (user, screen) => {
  await user.type(screen.getByPlaceholderText("Task name"), "Test Task");

  await user.type(screen.getByLabelText("Task Type"), "Bug");

  await user.type(screen.getByLabelText("Task Status"), "To do");

  await user.type(screen.getByLabelText("Due Date"), "2099-06-01T09:00");
};

export const submitForm = async (user, screen) => {
  await user.click(screen.getByRole("button", { name: /submit task/i }));
};

export const submitValidForm = async (user, screen) => {
  await fillValidForm(user, screen);
  await submitForm(user, screen);
};
