// import { Dispatch, SetStateAction, useState } from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import Courses from "./Courses";
// At the top of your test file, add the following import:
import { UseMutationResult, UseMutationOptions } from "@tanstack/react-query";

jest.mock("axios");
jest.mock("next-auth/react", () => ({
    signIn: jest.fn(),
}));
jest.mock("@tanstack/react-query");
jest.mock("@/components/editor/VariablesBox");
jest.mock("@/components/Latex");

describe("Login Component", () => {
    beforeEach(() => {
        // Reset the mocked functions before each test.
        jest.clearAllMocks();
    });
    
    it("renders the component", () => {
        render(<Courses />);
    });
});
