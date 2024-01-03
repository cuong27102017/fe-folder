import {
  Alert,
  Button,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import "../../styles/components/folderForm.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addFolder,
  deleteFolder,
  editFolder,
} from "../../store/slices/folderSlice";
import { MAX_FOLDER_DEPTH } from "../../constants/FOLDER";
import { getAllDependencies, getCurrentLevelOfFolder } from "../../utils/helpers";

const FolderForm = ({ folder, folderMetadata, onClose }) => {
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folders);
  const [error, setError] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [name, setName] = useState(folder ? folder.name : "");
  const [parentId, setParentId] = useState(folder ? folder.parentId : "");

  const handleSubmit = () => {
    if (name === "") {
      setError(true);
      return;
    }
    if (!folder) {
      if (parentId !== "" && !validateDepthLevelOfParent(parentId)) {
        setSnackbarMsg("The maximum folder depth level is 10.");
        return;
      }
      dispatch(
        addFolder({
          id: (folderMetadata.latestId + 1).toString(),
          name,
          parentId,
        })
      );
    } else {
      if (parentId !== "") {
        if (!validateParentFolder(folder, parentId)) {
          setSnackbarMsg("Cannot set parent folder to a child folder.");
          return;
        }
        const depthLevel = getFolderDepthLevel(folder);
        if (!validateDepthLevelOfParent(parentId, depthLevel)) {
          setSnackbarMsg("The maximum folder depth level is 10.");
          return;
        }
      }

      dispatch(
        editFolder({
          id: folder.id,
          name,
          parentId,
        })
      );
    }
    onClose();
  };

  const getFolderDepthLevel = (obj, currentDepth = 1) => {
    let maxChildDepth = 0;
    for (const childKey in obj.children) {
      const child = obj.children[childKey];
      const childDepth = getFolderDepthLevel(child, currentDepth + 1);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    }
    return Math.max(currentDepth, maxChildDepth);
  };

  const validateDepthLevelOfParent = useCallback(
    (parentId, depthLevelAdded = 1) => {
      const depthLevel = getCurrentLevelOfFolder(folders, parentId);
      if (depthLevel + depthLevelAdded > MAX_FOLDER_DEPTH) {
        return false;
      }
      return true;
    },
    [folders]
  );

  const validateParentFolder = (folder, parentId) => {
    if (folder?.children) {
      const allDependencies = getAllDependencies(folder);
      if (allDependencies.includes(parentId)) {
        return false;
      }
    }
    return true;
  };

  const handleDelete = () => {
    if (folder) {
      dispatch(deleteFolder(folder));
    }
    onClose();
  };

  return (
    <div className="folder-form-container">
      <CardContent>
        <Grid item container spacing={2} justify="center">
          <Grid item xs={12}>
            <TextField
              label="Folder Name*"
              name="folderName"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error}
              helperText={error ? "Folder Name is required." : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="select-parent">
                Parent Folder (optional)
              </InputLabel>
              <Select
                labelId="select-parent"
                id="single-select-parent"
                data-testid="single-select-parent"
                value={parentId}
                label="Parent Folder (optional)"
                onChange={(e) => setParentId(e.target.value)}
              >
                <MenuItem value={""}>Clear</MenuItem>
                {folderMetadata?.folderOptions?.length > 0 &&
                  folderMetadata?.folderOptions
                    ?.filter((option) => option.id !== folder?.id)
                    ?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            container
            alignItems="center"
            justifyContent="space-between"
          >
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {folder ? "Edit Folder" : "Add Folder"}
            </Button>
            {folder && (
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete Folder
              </Button>
            )}
          </Grid>
        </Grid>
      </CardContent>
      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg("")}
      >
        <Alert
          onClose={() => setSnackbarMsg("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FolderForm;
