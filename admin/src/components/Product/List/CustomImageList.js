import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  IconButton,
  Stack,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Tooltip
} from '@material-ui/core';
import {
  AddAPhoto as UploadIcon,
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon
} from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchGetProductImages,
  fetchDeleteProductImage,
  selectCurrentProuctImages,
  clearMsg as clearProductImageMsg
} from 'src/features/product/image/productImageSlice';
import { MESSAGES, CRUD_ACTIONS } from 'src/configs/constants';
import AddImageDialog from './AddImageDialog';
import EditImageDialog from './AddImageDialog';
import ConfirmDeleteDialog from 'src/components/CustomDialog';
import displayToast from 'src/utils/quickDisplayToast';

export default function CustomImageList({ productId }) {
  const dispatch = useDispatch();

  // global state
  const productImages = useSelector(selectCurrentProuctImages);
  const isFetchingGetProductImages = useSelector(
    (state) => state.productImageSlice.isFetchingGetProductImages
  );
  const isFetchingDeleteProductImage = useSelector(
    (state) => state.productImageSlice.isFetchingDeleteProductImage
  );
  const fetchDeleteProductImageMsg = useSelector(
    (state) => state.productImageSlice.fetchDeleteProductImageMsg
  );

  // local state
  const [openAddImageDialog, setOpenAddImageDialog] = useState(false);
  const [productImageFocus, setProductImageFocus] = useState(null);
  const [openDeleteImageDialog, setOpenDeleteImageDialog] = useState(false);
  const [openEditImageDialog, setOpenEditImageDialog] = useState(false);

  const handleButtonDelete = (productImageId) => {
    setProductImageFocus({ id: productImageId });
    setOpenDeleteImageDialog(true);
  };

  const handleButtonEdit = (productImageId) => {
    setProductImageFocus({ id: productImageId });
    setOpenEditImageDialog(true);
  };

  useEffect(() => {
    dispatch(fetchGetProductImages({ productId }));
  }, [dispatch, productId]);

  useEffect(() => {
    !isFetchingDeleteProductImage &&
      fetchDeleteProductImageMsg &&
      displayToast(fetchDeleteProductImageMsg, MESSAGES.DELETE_SUCCESS, null, () => {
        dispatch(clearProductImageMsg(`fetchDeleteProductImageMsg`));
      });
  }, [dispatch, fetchDeleteProductImageMsg, isFetchingDeleteProductImage]);

  return (
    <>
      <AddImageDialog
        needOpen={openAddImageDialog}
        action={CRUD_ACTIONS.create}
        handleClose={() => setOpenAddImageDialog(false)}
        productId={productId}
      />

      {openEditImageDialog && (
        <EditImageDialog
          needOpen={openEditImageDialog}
          action={CRUD_ACTIONS.update}
          handleClose={() => setOpenEditImageDialog(false)}
          productId={productId}
          productImageId={productImageFocus?.id}
        />
      )}

      <ConfirmDeleteDialog
        needOpen={openDeleteImageDialog}
        setNeedOpen={setOpenDeleteImageDialog}
        title="X??a ???nh s???n ph???m"
        content="B???n c?? ch???c mu???n x??a ???nh c???a s???n ph???m kh??ng?"
        button1={{ title: 'H???y', action: () => setOpenDeleteImageDialog(false) }}
        button2={{
          title: 'C??',
          action: () => {
            dispatch(fetchDeleteProductImage({ productImageId: productImageFocus.id }));
            setOpenDeleteImageDialog(false);
          }
        }}
      />

      <ImageList cols={4}>
        <ImageListItem key="Subheader" cols={4}>
          <ListSubheader component="div" sx={{ mb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={3}>
              <Typography>H??nh ???nh</Typography>
              <Button endIcon={<UploadIcon />} onClick={() => setOpenAddImageDialog(true)}>
                Th??m ???nh
              </Button>
            </Stack>
          </ListSubheader>
        </ImageListItem>
        {!isFetchingGetProductImages &&
          productImages?.length > 0 &&
          productImages.map((item, index) => (
            <ImageListItem key={index}>
              <img srcSet={item.url} alt={item.title} loading="lazy" />
              <ImageListItemBar
                title={item.title}
                actionIcon={
                  <Stack direction="row">
                    <Tooltip title="S???a">
                      <IconButton color="warning" onClick={() => handleButtonEdit(item.id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="X??a">
                      <IconButton color="error" onClick={() => handleButtonDelete(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              />
            </ImageListItem>
          ))}
      </ImageList>
    </>
  );
}
