import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  CardContent,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
  Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdArrowBackIosNew } from 'react-icons/md';
import { FiEye, FiEdit2, FiTrash } from 'react-icons/fi';
import { FaRegClone } from 'react-icons/fa';

import { BACKEND_URL } from '../../services/api';
import { apiResource } from '../../services/models/resourceModal';
import { apiUser } from '../../services/models/userModal';
import { apiProject } from '../../services/models/projectModel';

import ResourceModal from './components/ResourceModal';
import EndpointModal from './components/EndpointModal';
import EditResourceModal from './components/EditResourceModal';
import ResultModal from './components/ResultModal';
import ViewAnalytics from './components/ViewAnalytics';
import CloneModal from './components/CloneModal';
import DeleteResourceModal from './components/DeleteResourceModal';

import { CustomTooltip } from '../../components/CustomTooltip';
import CustomCheckbox from '../../components/CustomCheckbox';
import { CopyButton } from '../../components/CustomButtons';
import { copyTextToClipboard } from '../../utils/utils';
import type { ApiStringResponse } from '../../types';

type RouteParams = {
  projectId?: string;
};

type ResourceModel = {
  _id: string;
  name: string;
};

type ApiResponse<T> = {
  status: string;
  message: T;
};

type ResultRow = Record<string, unknown>;

const Collection = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [projectName, setProjectName] = useState<string>('');
  const [resources, setResources] = useState<ResourceModel[]>([]);

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const navigate = useNavigate();
  const { projectId } = useParams<RouteParams>();

  const fetchResource = (signal?: AbortSignal) => {
    if (!projectId) return;

    apiResource.getSingle(`project/${projectId}`, signal).then((res: any) => {
      if (res.status === '200') {
        setResources(Array.isArray(res.message) ? (res.message as ResourceModel[]) : []);
      }
    });

    apiProject.getSingle(`single/${projectId}`, signal).then((res: any) => {
      if (res.status === '200') {
        setProjectName(String(res.message?.name ?? ''));
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchResource(ac.signal);
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const delResource = (id: string) => {
    if (!id) return;

    toast('Deleting ...');
    apiResource.remove(id).then((res: ApiStringResponse) => {
      if (res.status === '200') {
        fetchResource();
      } else {
        toast.error('Error');
      }
    });
  };

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setCheckedList((prev) => (e.target.checked ? [...prev, id] : prev.filter((_id) => _id !== id)));
  };

  const delSelected = () => {
    const body = { resources: checkedList };

    toast.promise(
      new Promise<string>((resolve, reject) => {
        apiResource.removeAll(body).then((res: any) => {
          if (res.status === '200') {
            fetchResource();
            setCheckedList([]);
            resolve(String(res.message));
            return;
          }
          reject(String(res.message));
        });
      }),
      {
        loading: 'Deleting',
        success: (message) => message,
        error: (err) => String(err),
      },
    );
  };

  const handleCopyClick = async (data: string) => {
    try {
      await copyTextToClipboard(data);
      setIsCopied(true);
      toast.success('Copied !');
      setTimeout(() => setIsCopied(false), 5000);
    } catch (err) {
      toast.error("Couldn't copy !");
    }
  };

  return (
    <>
      <Button onClick={() => navigate(-1)}>
        <MdArrowBackIosNew />
        Back
      </Button>

      <CardContent>
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontFamily: 'CalSans' }}>
          {projectName}
        </Typography>

        <Alert sx={{ mb: 2 }}>
          <AlertTitle sx={{ fontWeight: 600 }}>API endpoint</AlertTitle>

          <code>{`${BACKEND_URL}/user/:endpoint`}</code>

          <CopyButton
            sx={{ ml: 1 }}
            disabled={isCopied}
            onClick={() => handleCopyClick(`${BACKEND_URL}/user/:endpoint`)}
          >
            {isCopied ? 'Done' : 'Copy'}
          </CopyButton>
        </Alert>

        <Typography component="p" variant="h6" sx={{ mb: 2 }}>
          <Link
            href="https://documenter.getpostman.com/view/21272376/2s8YmUMLP2#f02f8b5d-1988-4177-816a-6da7fcb47d88"
            target="_blank"
          >
            Test Postman Documentation
          </Link>
        </Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          New Resource
        </Button>

        <List sx={{ overflowX: 'auto' }}>
          {resources.map((resource) => (
            <Stack direction="row" key={resource._id}>
              <CustomCheckbox handleChecked={handleChecked} id={resource._id} />

              <Resource
                resource={resource}
                fetchResource={fetchResource}
                delResource={delResource}
              />
            </Stack>
          ))}
        </List>

        {checkedList.length !== 0 && (
          <Button variant="contained" color="error" onClick={delSelected}>
            Delete selected
          </Button>
        )}
      </CardContent>

      <ResourceModal
        open={open}
        setOpen={setOpen}
        fetchResource={fetchResource}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};

export default Collection;

// --------------------------
// Resource Row Component
// --------------------------

type ResourceProps = {
  resource: ResourceModel;
  fetchResource: (signal?: AbortSignal) => void;
  delResource: (id: string) => void;
};

const Resource = ({ resource, fetchResource, delResource }: ResourceProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [endModal, setEndModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [analyticsModal, setAnalyticsModal] = useState<boolean>(false);
  const [cloneModal, setCloneModal] = useState<boolean>(false);
  const [delResourceModal, setDelResourceModal] = useState<boolean>(false);

  const [result, setResult] = useState<ResultRow[]>([]);

  const fetchResult = (signal?: AbortSignal) => {
    setLoading(true);

    apiUser.getSingle(resource._id, signal).then((res: ApiResponse<ResultRow[]>) => {
      if (res.status === '200') {
        setResult(Array.isArray(res.message) ? res.message : []);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchResult(ac.signal);
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ListItem>
        <Grid container spacing={2}>
          <Grid sx={{ display: 'flex' }} alignItems="center">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[500] }}>{resource.name?.charAt(0)}</Avatar>
            </ListItemAvatar>

            <Typography
              sx={{ display: 'inline', mt: 1, fontSize: 16 }}
              component="h1"
              variant="h6"
              color="text.primary"
            >
              {resource.name}
            </Typography>
          </Grid>

          <Grid>
            <Stack spacing={2} direction="row" sx={{ justifyContent: { sm: 'left', md: 'right' } }}>
              <CustomTooltip title="View generated JSON data" arrow>
                <Button variant="contained" onClick={() => setOpenModal(true)}>
                  <FiEye />
                </Button>
              </CustomTooltip>

              <CustomTooltip title="Edit Resource" arrow>
                <Button variant="outlined" onClick={() => setEditModal(true)}>
                  <FiEdit2 />
                </Button>
              </CustomTooltip>

              <CustomTooltip title="Clone Resource" arrow>
                <Button variant="contained" color="success" onClick={() => setCloneModal(true)}>
                  <FaRegClone />
                </Button>
              </CustomTooltip>

              <CustomTooltip title="Delete Resource" arrow>
                <Button variant="contained" color="error" onClick={() => setDelResourceModal(true)}>
                  <FiTrash />
                </Button>
              </CustomTooltip>

              <CustomTooltip title="View generated API endpoints" arrow>
                <Button variant="contained" onClick={() => setEndModal(true)}>
                  View Endpoints
                </Button>
              </CustomTooltip>
            </Stack>
          </Grid>
        </Grid>
      </ListItem>

      <ResultModal open={openModal} setOpen={setOpenModal} result={result} loading={loading} />

      <EndpointModal open={endModal} setOpen={setEndModal} result={resource._id} />

      <EditResourceModal
        open={editModal}
        setOpen={setEditModal}
        result={resource._id}
        fetchResult={fetchResult}
      />

      {/* <ViewAnalytics
        open={analyticsModal}
        setOpen={setAnalyticsModal}
        result={resource._id}
        fetchResult={fetchResult}
      /> */}

      <CloneModal
        open={cloneModal}
        setOpen={setCloneModal}
        result={resource._id}
        fetchResources={fetchResource}
      />

      <DeleteResourceModal
        open={delResourceModal}
        setOpen={setDelResourceModal}
        result={resource._id}
        delResource={delResource}
      />
    </>
  );
};
