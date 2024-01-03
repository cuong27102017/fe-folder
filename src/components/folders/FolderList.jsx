import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  ExpandMore,
  ChevronRight,
  Edit,
} from "@mui/icons-material";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { isEmpty } from "lodash";
import { buildTree, getLatestId } from "../../utils/helpers";
import { Button, Grid, IconButton } from "@mui/material";
import FolderForm from "./FolderForm";
import Modal from "../common/Modal";

const FolderList = () => {
  const folders = useSelector((state) => state.folders);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const folderMetadata = useMemo(() => {
    if (folders.length === 0) {
      return {};
    }
    const folderOptions = folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
    }));

    return {
      folderOptions,
      latestId: getLatestId(folders),
    };
  }, [folders]);

  const handleOpenModal = (e, folder) => {
    e.stopPropagation();
    setSelectedFolder(folder);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const renderTree = (nodes) => {
    if (!isEmpty(nodes)) {
      return Object.entries(nodes).map(([key, value]) => {
        return (
          <TreeItem
            key={key}
            nodeId={key}
            label={
              <Grid
                container
                alignItems="center"
                spacing={1}
                justifyContent="space-between"
              >
                <Grid item xs={8}>
                  {value.name}
                </Grid>
                <Grid
                  item
                  xs={4}
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <IconButton onClick={(e) => handleOpenModal(e, value)}>
                    <Edit />
                  </IconButton>
                </Grid>
              </Grid>
            }
          >
            {renderTree(value.children)}
          </TreeItem>
        );
      });
    }
  };

  return (
    <>
      <Grid container spacing={2} style={{ padding: 10 }}>
        <Grid item xs={8}>
          <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
          >
            {renderTree(buildTree(folders))}
          </TreeView>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => handleOpenModal(e, null)}
          >
            Add Folder
          </Button>
        </Grid>
      </Grid>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={selectedFolder ? "Edit Folder" : "Add Folder"}
      >
        <FolderForm
          folder={selectedFolder}
          folderMetadata={folderMetadata}
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default FolderList;
