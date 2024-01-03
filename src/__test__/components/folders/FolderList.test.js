import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import FolderList from "../../../components/folders/FolderList";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"), // use the actual module for everything else
  useSelector: jest.fn(),
}));

const mockState = {
  folders: [
    { id: "1", name: "Folder A", parentId: "" },
    { id: "2", name: "Folder B", parentId: "1" },
    { id: "3", name: "Folder C", parentId: "2" },
    { id: "4", name: "Folder D", parentId: "" },
    { id: "5", name: "Folder E", parentId: "4" },
  ],
};

describe("FolderList", () => {
  test("renders the root folder correctly", () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockState));

    render(<FolderList />);

    expect(screen.getByText("Folder A")).toBeInTheDocument();
    expect(screen.getByText("Folder D")).toBeInTheDocument();
  });

  test("renders the children folders correctly", () => {
    useSelector.mockImplementation((selectorFn) => selectorFn(mockState));

    render(<FolderList />);

    const folderA = screen.getByText("Folder A");
    expect(folderA).toBeInTheDocument();

    expect(screen.queryByText("Folder B")).toBeNull();
    // Folder B only show when open folder A
    fireEvent.click(folderA);
    const folderB = screen.getByText("Folder B");
    expect(folderB).toBeInTheDocument();

    expect(screen.queryByText("Folder C")).toBeNull();
    // Folder C only show when open folder B
    fireEvent.click(folderB);
    expect(screen.getByText("Folder C")).toBeInTheDocument();
  });
});
