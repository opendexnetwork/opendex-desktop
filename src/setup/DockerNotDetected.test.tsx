import { render } from "@testing-library/react";
import React from "react";
import App from "../App";

test("renders 'Waiting for OpenDEX Docker' text when promise is pending", () => {
  (window as any).electron = {
    send: () => {},
    receive: () => {},
    platform: () => "linux",
  };
  const { getByText } = render(<App />);
  const headerTextElement = getByText(/Waiting for OpenDEX Docker/i);
  expect(headerTextElement).toBeInTheDocument();
});
