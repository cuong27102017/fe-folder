import {
  buildTree,
  getAllDependencies,
  getCurrentLevelOfFolder,
  getLatestId,
} from "../../utils/helpers";

describe("testing helpers", () => {
  test("buildTree with empty data", () => {
    const data = [];
    const result = buildTree(data);
    expect(result).toEqual({});
  });

  test("buildTree with result as expectation", () => {
    const data = [
      { id: "1", parentId: "" },
      { id: "2", parentId: "1" },
      { id: "3", parentId: "1" },
      { id: "4", parentId: "2" },
      { id: "5", parentId: "2" },
      { id: "6", parentId: "3" },
      { id: "7", parentId: "" },
    ];

    const expected = {
      1: {
        id: "1",
        parentId: "",
        children: {
          2: {
            id: "2",
            parentId: "1",
            children: {
              4: {
                id: "4",
                parentId: "2",
                children: {},
              },
              5: {
                id: "5",
                parentId: "2",
                children: {},
              },
            },
          },
          3: {
            id: "3",
            parentId: "1",
            children: {
              6: {
                id: "6",
                parentId: "3",
                children: {},
              },
            },
          },
        },
      },
      7: {
        id: "7",
        parentId: "",
        children: {},
      },
    };

    const result = buildTree(data);
    expect(result).toEqual(expected);
  });

  test("getLatestId with empty data", () => {
    const data = [];
    const result = getLatestId(data);
    expect(result).toEqual(0);
  });

  test("getLatestId with result as expectation", () => {
    const data = [
      { id: "5", name: "Folder A", parentId: "" },
      { id: "3", name: "Folder B", parentId: "1" },
      { id: "1", name: "Folder C", parentId: "2" },
      { id: "2", name: "Folder D", parentId: "" },
      { id: "4", name: "Folder E", parentId: "4" },
    ];
    const result = getLatestId(data);
    expect(result).toEqual(5);
  });

  test("getAllDependencies with empty data", () => {
    const data = {};
    const result = getAllDependencies(data);
    expect(result).toEqual([]);
  });

  test("getAllDependencies with result as expectation", () => {
    const data = {
      id: "1",
      parentId: "",
      children: {
        2: {
          id: "2",
          parentId: "1",
          children: {
            4: {
              id: "4",
              parentId: "2",
              children: {},
            },
            5: {
              id: "5",
              parentId: "2",
              children: {},
            },
          },
        },
        3: {
          id: "3",
          parentId: "1",
          children: {
            6: {
              id: "6",
              parentId: "3",
              children: {},
            },
          },
        },
      },
    };

    const result = getAllDependencies(data);
    expect(result).toEqual(["2", "4", "5", "3", "6"]);
  });

  test("getCurrentLevelOfFolder with existing item", () => {
    const data = [
      { id: "1", parentId: "" },
      { id: "2", parentId: "1" },
      { id: "3", parentId: "1" },
      { id: "4", parentId: "2" },
      { id: "5", parentId: "2" },
      { id: "6", parentId: "3" },
      { id: "7", parentId: "" },
    ];
    const targetId = "4";
    const expected = 3;

    const result = getCurrentLevelOfFolder(data, targetId);
    expect(result).toEqual(expected);
  });

  test("getCurrentLevelOfFolder with non-existing item", () => {
    const data = [
      { id: "1", parentId: "" },
      { id: "2", parentId: "1" },
      { id: "3", parentId: "1" },
      { id: "4", parentId: "2" },
      { id: "5", parentId: "2" },
      { id: "6", parentId: "3" },
      { id: "7", parentId: "" },
    ];
    const targetId = "8";

    const result = getCurrentLevelOfFolder(data, targetId);
    expect(result).toBeUndefined();
  });
});
