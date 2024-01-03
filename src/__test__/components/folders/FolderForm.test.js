import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import FolderForm from "../../../components/folders/FolderForm";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"), // use the actual module for everything else
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

let folder;
let folderMetadata;
let onClose;
let mockDispatch;
let mockState;

beforeEach(() => {
  folder = {
    id: "2",
    name: "Folder B",
    parentId: "1",
  };
  folderMetadata = {
    latestId: 3,
    folderOptions: [
      { id: "1", name: "Folder A" },
      { id: "2", name: "Folder B" },
      { id: "3", name: "Folder C" },
    ],
  };
  onClose = jest.fn();
  mockDispatch = jest.fn();
  mockState = {
    folders: [
      { id: "1", name: "Folder A", parentId: "" },
      { id: "2", name: "Folder B", parentId: "1" },
      { id: "3", name: "Folder C", parentId: "2" },
    ],
  };
});

describe("FolderForm", () => {
  test("renders folder form with Create case", () => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) => selectorFn(mockState));
    render(<FolderForm folderMetadata={folderMetadata} onClose={onClose} />);

    expect(screen.getByText("Add Folder")).toBeInTheDocument();
  });

  test("renders folder form with Edit case", () => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) => selectorFn(mockState));
    render(
      <FolderForm
        folder={folder}
        folderMetadata={folderMetadata}
        onClose={onClose}
      />
    );

    expect(screen.getByText("Edit Folder")).toBeInTheDocument();
  });

  test("show error when create / update with folder name is empty", () => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) => selectorFn(mockState));
    render(
      <FolderForm
        folder={null}
        folderMetadata={folderMetadata}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Add Folder"));

    expect(screen.getByText("Folder Name is required.")).toBeInTheDocument();
  });

  test("dispatches addFolder action when adding a new folder", () => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) => selectorFn(mockState));
    render(
      <FolderForm
        folder={null}
        folderMetadata={folderMetadata}
        onClose={onClose}
      />
    );

    fireEvent.change(screen.getByLabelText("Folder Name*"), {
      target: { value: "New Folder" },
    });
    fireEvent.click(screen.getByText("Add Folder"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "folders/addFolder",
      payload: {
        id: "4",
        name: "New Folder",
        parentId: "",
      },
    });
    expect(onClose).toHaveBeenCalled();
  });

  test("adding a new folder to parent with max_depth", async () => {
    useDispatch.mockReturnValue(mockDispatch);
    const mockFoders = {
      folders: [
        { id: "1", name: "Folder 1", parentId: "" },
        { id: "2", name: "Folder 2", parentId: "1" },
        { id: "3", name: "Folder 3", parentId: "2" },
        { id: "4", name: "Folder 4", parentId: "" },
        { id: "5", name: "Folder 5", parentId: "4" },
        { id: "6", name: "Folder 6", parentId: "1" },
        { id: "7", name: "Folder 7", parentId: "1" },
        { id: "8", name: "Folder 8", parentId: "1" },
        { id: "9", name: "Folder 9", parentId: "1" },
        { id: "10", name: "Folder 10", parentId: "1" },
        { id: "11", name: "Folder 11", parentId: "1" },
        { id: "12", name: "Folder 12", parentId: "1" },
        { id: "13", name: "Folder 13", parentId: "1" },
      ],
    };
    useSelector.mockImplementation((selectorFn) => selectorFn(mockFoders));
    const mockFolderMetadata = {
      latestId: 13,
      folderOptions: mockFoders.folders.map((folder) => ({
        id: folder.id,
        name: folder.name,
      })),
    };
    render(
      <FolderForm
        folder={null}
        folderMetadata={mockFolderMetadata}
        onClose={onClose}
      />
    );

    fireEvent.change(screen.getByLabelText("Folder Name*"), {
      target: { value: "New Folder" },
    });
    const selectElement = screen.getByRole("combobox", {
      name: "Parent Folder (optional)",
    });
    fireEvent.mouseDown(selectElement);
    const selectedOption = screen.getByText("Folder 1");
    fireEvent.click(selectedOption);
    fireEvent.click(screen.getByText("Add Folder"));

    expect(
      screen.getByText("The maximum folder depth level is 10.")
    ).toBeInTheDocument();
  });

  test("dispatches editFolder action when editing a folder", () => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) => selectorFn(mockState));
    render(
      <FolderForm
        folder={folder}
        folderMetadata={folderMetadata}
        onClose={onClose}
      />
    );

    fireEvent.change(screen.getByLabelText("Folder Name*"), {
      target: { value: "Updated Folder" },
    });
    fireEvent.click(screen.getByText("Edit Folder"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "folders/editFolder",
      payload: {
        id: "2",
        name: "Updated Folder",
        parentId: "1",
      },
    });
    expect(onClose).toHaveBeenCalled();
  });

  test("editing a folder to parent with max_depth", async () => {
    useDispatch.mockReturnValue(mockDispatch);
    const mockFoders = {
      folders: [
        { id: "1", name: "Folder 1", parentId: "" },
        { id: "2", name: "Folder 2", parentId: "1" },
        { id: "3", name: "Folder 3", parentId: "2" },
        { id: "4", name: "Folder 4", parentId: "" },
        { id: "5", name: "Folder 5", parentId: "4" },
        { id: "6", name: "Folder 6", parentId: "1" },
        { id: "7", name: "Folder 7", parentId: "1" },
        { id: "8", name: "Folder 8", parentId: "1" },
        { id: "9", name: "Folder 9", parentId: "1" },
        { id: "10", name: "Folder 10", parentId: "1" },
        { id: "11", name: "Folder 11", parentId: "1" },
        { id: "12", name: "Folder 12", parentId: "1" },
        { id: "13", name: "Folder 13", parentId: "1" },
      ],
    };
    useSelector.mockImplementation((selectorFn) => selectorFn(mockFoders));
    const mockFolderMetadata = {
      latestId: 13,
      folderOptions: mockFoders.folders.map((folder) => ({
        id: folder.id,
        name: folder.name,
      })),
    };
    const mockFolder = { id: "3", name: "Folder 3", parentId: "2" };
    render(
      <FolderForm
        folder={mockFolder}
        folderMetadata={mockFolderMetadata}
        onClose={onClose}
      />
    );
    const selectElement = screen.getByRole("combobox", {
      name: "Parent Folder (optional)",
    });
    fireEvent.mouseDown(selectElement);
    const selectedOption = screen.getByText("Folder 1");
    fireEvent.click(selectedOption);
    fireEvent.click(screen.getByText("Edit Folder"));

    expect(
      screen.getByText("The maximum folder depth level is 10.")
    ).toBeInTheDocument();
  });

  test("editing a folder to parent with set parent to child folder", async () => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) => selectorFn(mockState));
    const mockFolder = {
      id: "1",
      name: "Folder A",
      parentId: "",
      children: {
        2: {
          id: "2",
          name: "Folder B",
          parentId: "1",
        }
      }
    }
    render(
      <FolderForm
        folder={mockFolder}
        folderMetadata={folderMetadata}
        onClose={onClose}
      />
    );
    const selectElement = screen.getByRole("combobox", {
      name: "Parent Folder (optional)",
    });
    fireEvent.mouseDown(selectElement);
    const selectedOption = screen.getByText("Folder B");
    fireEvent.click(selectedOption);
    fireEvent.click(screen.getByText("Edit Folder"));

    expect(
      screen.getByText("Cannot set parent folder to a child folder.")
    ).toBeInTheDocument();
  });

  test("dispatches deleteFolder action when deleting a folder", () => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selectorFn) => selectorFn(mockState));
    render(
      <FolderForm
        folder={folder}
        folderMetadata={folderMetadata}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Delete Folder"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "folders/deleteFolder",
      payload: {
        id: "2",
        name: "Folder B",
        parentId: "1",
      },
    });
    expect(onClose).toHaveBeenCalled();
  });
});
