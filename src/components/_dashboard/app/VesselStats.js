import { useState, useEffect } from 'react';
import axios from 'axios';

import { Icon } from '@iconify/react';
import aimOutlined from '@iconify/icons-ant-design/aim-outlined';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

export default function VesselStats() {
  const [vesselNumb, setVesselNumb] = useState(0);

  useEffect(() => {
    axios(`${process.env.REACT_APP_BASE_URL}/stat/`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then((value) => {
        setVesselNumb(value.data.vesselStat);
      })
      .catch(() => {});
  }, []);

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={aimOutlined} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(vesselNumb)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Vessels
      </Typography>
    </RootStyle>
  );
}
