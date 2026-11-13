/**
 * Component tests for the /address page (save-the-date mailing address form).
 *
 * Global fetch is stubbed so no real API calls reach the server. Each test
 * controls the mock response to exercise a specific UI state.
 *
 * Labels are queried by their visible text via getByLabelText, which works here
 * because each <label> implicitly wraps its <input> (no htmlFor/id needed).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddressPage from "@/app/address/page";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

function fillForm() {
  fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Jane" } });
  fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
  fireEvent.change(screen.getByLabelText(/address line 1/i), {
    target: { value: "123 Main St" },
  });
  fireEvent.change(screen.getByLabelText(/city/i), { target: { value: "Sacramento" } });
  fireEvent.change(screen.getByLabelText(/state/i), { target: { value: "CA" } });
  fireEvent.change(screen.getByLabelText(/zip/i), { target: { value: "95814" } });
  fireEvent.change(screen.getByLabelText(/country/i), { target: { value: "US" } });
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: /submit address/i }));
}

describe("AddressPage", () => {
  it("renders all required fields", () => {
    render(<AddressPage />);
    expect(screen.getByLabelText(/first name/i)).toBeTruthy();
    expect(screen.getByLabelText(/last name/i)).toBeTruthy();
    expect(screen.getByLabelText(/address line 1/i)).toBeTruthy();
    expect(screen.getByLabelText(/city/i)).toBeTruthy();
    expect(screen.getByLabelText(/state/i)).toBeTruthy();
    expect(screen.getByLabelText(/zip/i)).toBeTruthy();
    expect(screen.getByLabelText(/country/i)).toBeTruthy();
  });

  it("renders address line 2 as optional", () => {
    render(<AddressPage />);
    expect(screen.getByLabelText(/address line 2/i)).toBeTruthy();
    expect(screen.getByText(/optional/i)).toBeTruthy();
  });

  it("shows success state after a successful submission", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    render(<AddressPage />);
    fillForm();
    submit();
    await waitFor(() => {
      expect(screen.getByText(/we have your address/i)).toBeTruthy();
    });
  });

  it("disables the button and shows Saving… while the request is in-flight", async () => {
    mockFetch.mockReturnValueOnce(new Promise(() => {})); // hangs to simulate a slow request
    render(<AddressPage />);
    fillForm();
    submit();
    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
      expect(btn.textContent).toMatch(/saving/i);
    });
  });

  it("shows an error message when the API call fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    render(<AddressPage />);
    fillForm();
    submit();
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeTruthy();
    });
  });

  it("restores the submit button after an error so the guest can retry", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    render(<AddressPage />);
    fillForm();
    submit();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /submit address/i })).toBeTruthy();
    });
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("includes address2 in the request body when provided", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    render(<AddressPage />);
    fillForm();
    fireEvent.change(screen.getByLabelText(/address line 2/i), {
      target: { value: "Apt 4B" },
    });
    submit();
    await waitFor(() => {
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.address2).toBe("Apt 4B");
    });
  });

  it("sends address2 as an empty string when left blank", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    render(<AddressPage />);
    fillForm();
    submit();
    await waitFor(() => {
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.address2).toBe("");
    });
  });
});
