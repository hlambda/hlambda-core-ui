import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

import useFetch from 'use-http';
import { toast } from 'react-toastify';

import _ from 'lodash';

export default function FileSystemNavigator({
  valuesParrent,
  setValuesParrent,
}) {
  const { get, post, response, loading, error } = useFetch();

  // const [selectedFilePath, setSelectedFilePath] = React.useState('');

  const [values, setValues] = React.useState({
    root: {
      name: 'root',
      path: '.',
      files: [
        {
          name: 'metadata',
          type: 'directory',
          files: [
            {
              name: 'apps',
              type: 'directory',
              files: [
                {
                  name: 'wut',
                  type: 'directory',
                  files: [],
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const handleSelect = async (event, nodeIds) => {
    console.log('selected:', nodeIds);
    console.log(event);

    const results = await post('/console/api/v1/read-dir', {
      path: nodeIds,
    });
    if (response.ok) {
      // toast.success('yeey');
      const splitPaths = nodeIds.split('/');
      const newDirStructure = {
        ...values,
      };

      let firstPath = 'root.files';
      for (let i = 1; i < splitPaths.length; i++) {
        const files = _.get(values, firstPath);
        const index = _.findIndex(files, function (o) {
          return o.name == splitPaths[i];
        });
        firstPath = firstPath + `[${index}].files`;
        console.log(firstPath);
      }

      console.log(firstPath);

      _.set(
        newDirStructure,
        firstPath,
        results.map((item) => {
          return {
            ...item,
            files: [],
          };
        })
      );

      setValues(newDirStructure);
    } else {
      toast.error('Request errored out...');
      //setValues({ ...values, editorCodeData: '' });
    }
  };

  const TreeRender = (data, parrent = { path: '.', name: 'root' }) => {
    const hasFiles = data.files.length !== 0;
    if (hasFiles) {
      return (
        <TreeItem key={data.path} nodeId={data.path} label={data.name}>
          {data.files.map((node, idx) => {
            const newPath = parrent.path + '/' + node.name;
            console.log(newPath);
            return TreeRender(
              { ...node, path: newPath },
              { ...node, path: newPath }
            );
          })}
        </TreeItem>
      );
    }
    if (data.type === 'directory') {
      return (
        <TreeItem key={data.path} nodeId={data.path} label={data.name}>
          <TreeItem
            key={data.path + '-empty'}
            nodeId={data.path + '-empty'}
            label={''}
          />
        </TreeItem>
      );
    }
    return (
      <TreeItem
        key={data.path}
        nodeId={data.path}
        onClick={() => {
          setValuesParrent({
            ...valuesParrent,
            path: data.path,
          });
        }}
        label={data.name}
      ></TreeItem>
    );
  };

  return (
    <>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        onNodeSelect={handleSelect}
      >
        {loading && <CircularProgress size={10} />}
        {TreeRender(values.root)}
      </TreeView>
    </>
  );
}
