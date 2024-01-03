const mockFolders = [
  { id: '1', name: "Folder 1", parentId: '' },
  { id: '2', name: "Folder 1.1", parentId: '1' },
  { id: '3', name: "Folder 1.1.1", parentId: '2' },
  { id: '4', name: "Folder 1.1.1.1", parentId: '3' },
  { id: '5', name: "Folder 1.1.1.1.1", parentId: '4' },
  { id: '6', name: "Folder 1.1.1.1.1.1", parentId: '5' },
  { id: '7', name: "Folder 1.1.1.1.1.1.1", parentId: '6' },
  { id: '8', name: "Folder 1.1.1.1.1.1.1.1", parentId: '7' },
  { id: '9', name: "Folder 1.1.1.1.1.1.1.1.1", parentId: '8' },
  { id: '10', name: "Folder 1.2", parentId: '1' },
  { id: '11', name: "Folder 1.3", parentId: '1' },
  { id: '12', name: "Folder 2", parentId: '' },
  { id: '13', name: "Folder 2.1", parentId: '12' },
];

export default mockFolders;
