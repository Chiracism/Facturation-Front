// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import { VesselStats, AgenceStats, PortStats, ClientStats } from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Dashboard | LMC App">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Bienvenu !</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <ClientStats />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <VesselStats />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <PortStats />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AgenceStats />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
