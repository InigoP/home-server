// Shared setup for all Vitest test files.
// RTL does not auto-cleanup in this version of Vitest, so we do it explicitly.

import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

// Register jest-dom matchers (toBeDisabled, toBeInTheDocument, etc.)
expect.extend(matchers);

afterEach(() => {
  cleanup();
});
