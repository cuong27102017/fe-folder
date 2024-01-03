export const buildTree = (data, parentId = '') => {
  const tree = {};
  data.forEach((node) => {
    if (node.parentId === parentId) {
      tree[node.id] = { ...node, children: buildTree(data, node.id) };
    }
  });
  return tree;
};

export const getLatestId = (data) => {
  if (data.length === 0) {
    return 0;
  }

  const ids = data.map((folder) => folder.id);
  return Math.max(...ids);
};

export const getAllDependencies = (obj) => {
  let result = [];

  function traverse(node) {
    for (const childId in node.children) {
      result.push(childId);
      traverse(node.children[childId]);
    }
  }

  traverse(obj);
  return result;
}
