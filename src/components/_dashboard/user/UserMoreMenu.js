import { useRef, useState } from 'react';
import axios from 'axios';

import { Icon } from '@iconify/react';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function UserMoreMenu({ idUser, sendInformation }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const deleteUser = () => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/user/${idUser}`, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
        }
      })
      .then((value) => {
        console.log('Delete User success !');
        sendInformation(value);
      })
      .catch(() => {});
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={() => deleteUser()}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
