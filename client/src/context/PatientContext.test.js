import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PatientProvider, usePatient } from "./PatientContext";

describe("PatientContext", () => {
  it("provides the correct context values", () => {
    const TestComponent = () => {
      const { selectedPatient, setSelectedPatient } = usePatient();

      return (
        <div>
          <p data-testid="selected-patient">
            {selectedPatient ? selectedPatient.name : "No patient selected"}
          </p>
          <button
            data-testid="set-patient-button"
            onClick={() => setSelectedPatient({ name: "John Doe", id: 1 })}
          >
            Set Patient
          </button>
        </div>
      );
    };

    render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    expect(screen.getByTestId("selected-patient")).toHaveTextContent(
      "No patient selected"
    );

    fireEvent.click(screen.getByTestId("set-patient-button"));

    expect(screen.getByTestId("selected-patient")).toHaveTextContent(
      "John Doe"
    );
  });

  it("throws an error when usePatient is used outside of a PatientProvider", () => {
    const TestComponent = () => {
      usePatient(); // This should throw
      return null;
    };

    // Temporarily suppress the error output
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => render(<TestComponent />)).toThrow(
      "usePatient must be used within a PatientProvider"
    );

    // Restore the console.error
    console.error = originalError;
  });
});
