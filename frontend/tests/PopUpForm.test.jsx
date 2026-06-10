import { render, screen } from "@testing-library/react";
import userTask from "@testing-library/user-event";
import PopUpForm from "../../src/components/PopUpForm";
import CreateTaskForm from "../../src/components/Form";
import { fillValidForm, submitForm } from "./utils/formHelpers";
import { vi } from "vitest";

let user;

beforeEach(() => {
  user = userTask.setup();
});

const clickTrigger = async (name) => {
  await user.click(screen.getByRole("button", { name }));
};

const renderPopup = (
  formContent = () => <div data-testid="form-content">Form Content</div>,
) => {
  render(<PopUpForm formName="Test Form" formContent={formContent} />);
};

const renderPopupWithMock = (mockSubmit) => {
  render(
    <PopUpForm
      formName="Test Form"
      formContent={() => (
        <form
          id="create-task-form"
          onSubmit={(e) => {
            e.preventDefault();
            mockSubmit();
          }}
        >
          <input aria-label="dummy input" />
          <button type="submit">Submit Task</button>
        </form>
      )}
    />,
  );
};

describe("PopUpForm", () => {
  it("renders trigger button", () => {
    renderPopup();

    expect(
      screen.getByRole("button", { name: "Test Form" }),
    ).toBeInTheDocument();
  });

  it("does not show content before opening", () => {
    renderPopup();

    expect(screen.queryByTestId("form-content")).not.toBeInTheDocument();
  });

  it("opens and closes popup", async () => {
    renderPopup();

    await clickTrigger("Test Form");
    expect(screen.getByTestId("form-content")).toBeInTheDocument();

    await clickTrigger("Close Form");
    expect(screen.queryByTestId("form-content")).not.toBeInTheDocument();
  });

  it("calls submit handler when submit clicked", async () => {
    const mockSubmit = vi.fn();

    renderPopupWithMock(mockSubmit);

    await clickTrigger("Test Form");
    await clickTrigger("Submit Task");

    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});

describe("PopUpForm + CreateTaskForm integration", () => {
  it("opens popup and shows create task form", async () => {
    render(
      <PopUpForm
        formName="Create Task"
        formContent={(onSuccess) => <CreateTaskForm onSuccess={onSuccess} />}
      />,
    );

    expect(screen.queryByPlaceholderText(/Task Name/i)).not.toBeInTheDocument();

    await clickTrigger("Create Task");

    expect(screen.getByPlaceholderText(/Task Name/i)).toBeVisible();
    expect(screen.getByLabelText(/Task Type/i)).toBeVisible();
    expect(screen.getByLabelText(/Task Status/i)).toBeVisible();
    expect(screen.getByLabelText(/Due Date/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /Submit Task/i })).toBeVisible();
  });

  it("submits form successfully and closes popup", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(
      <PopUpForm
        formName="Create Task"
        formContent={(onSuccess) => <CreateTaskForm onSuccess={onSuccess} />}
      />,
    );

    await clickTrigger("Create Task");

    await fillValidForm(user, screen);
    await submitForm(user, screen);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/events",
      expect.objectContaining({
        method: "POST",
      }),
    );

    expect(screen.queryByPlaceholderText(/Task name/i)).not.toBeInTheDocument();
  });

  it("shows validation errors and does NOT submit", async () => {
    render(
      <PopUpForm
        formName="Create Task"
        formContent={(onSuccess) => <CreateTaskForm onSuccess={onSuccess} />}
      />,
    );

    await clickTrigger("Create Task");

    await submitForm(user, screen);

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
