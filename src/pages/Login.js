// Material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Card, Stack, Container, Typography } from '@material-ui/core';

// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { LoginForm } from '../components/authentication/login';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <RootStyle title="Login | LMC App">
      <MHidden width="mdDown">
        <SectionStyle style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Bienvenue à Lignes Maritimes Congolaises
          </Typography>
          <img src="/static/logo_lmc.JPG" alt="login" style={{ width: 200 }} />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Entrez vos identifiants</Typography>
          </Stack>

          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
