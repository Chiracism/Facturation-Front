import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import jwt from 'jsonwebtoken';

// Material UI Component
import { Card, Stack, Container, Typography, Autocomplete } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import ReactToPrint from 'react-to-print';
import ComponentToPrint from './ComponentToPrint';

import './Importation.css';
import { numberValidation } from '../../utils/validate';

// components
import Page from '../../components/Page';
import { CheckUserAuth } from '../../utils/auth';

// ----------------------------------------------------------------------

export default function Importation() {
  const componentRef = useRef();
  const [user, setUser] = useState(null);
  const [blNumb, setBlNumb] = useState('');
  const [fileNumb, setFileNumb] = useState('');
  const [send, setSend] = useState('');

  function disabledPrint() {
    if (agency !== '' && agency !== null) return false;
    return true;
  }

  // Print Facture
  function printFacture() {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/historic2/`,
        {
          agence: agency,
          numero_fiche: fileNumb,
          serie: blNumb,
          envoi: send,
          pol,
          pod,
          vessel,
          dollar_taux: dollar,
          euro_taux: euro,
          tva: subTotal1,
          tva_dgrkc: subTotal2,
          total,
          qte_authentification_connaissement: authKnoledgeQuantity,
          qte_conventionnel_50t_consignation: firstConventionQuantity,
          qte_conventionnel_milieu_consignation: secondConventionQuantity,
          qte_conventionnel_500t_consignation: thirdConventionQuantity,
          qte_vehicule_consignation: firstVehiculeQuantity,
          qte_conteneur_20_consignation: firstContainer20Quantity,
          qte_conteneur_40_consignation: firstContainer40Quantity,
          qte_conteneur_20_tracking: secondContainer20Quantity,
          qte_conteneur_40_tracking: secondContainer40Quantity,
          qte_conteneur_20_equipement: thirdContainer20Quantity,
          qte_conteneur_40_equipement: thirdContainer40Quantity,
          qte_frais_correction_manifeste_equipement: manifestCorrectionQuantity,
          qte_frais_lettre_garantie_simple_equipement: letterGuaranteeQuantity,
          qte_conventionnel_navigation: redevanceConventionalQuantity,
          qte_vehicule_navigation: redevanceVehiculeQuantity,
          qte_conteneur_20_navigation: redevanceContainer20Quantity,
          qte_conteneur_40_navigation: redevanceContainer40Quantity,
          date: new Date()
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
          }
        }
      )
      .then(() => {})
      .catch(() => {});
  }

  /**
   * Quantities
   */
  const [authKnoledgeQuantity, setAuthKnoledgeQuantity] = useState('');
  const [firstConventionQuantity, setFirstConventionQuantity] = useState('');
  const [secondConventionQuantity, setSecondConventionQuantity] = useState('');
  const [thirdConventionQuantity, setThirdConventionQuantity] = useState('');
  const [firstVehiculeQuantity, setFirstVehiculeQuantity] = useState('');
  const [firstContainer20Quantity, setFirstContainer20Quantity] = useState('');
  const [firstContainer40Quantity, setFirstContainer40Quantity] = useState('');

  const [secondContainer20Quantity, setSecondContainer20Quantity] = useState('');
  const [secondContainer40Quantity, setSecondContainer40Quantity] = useState('');

  const [thirdContainer20Quantity, setThirdContainer20Quantity] = useState('');
  const [thirdContainer40Quantity, setThirdContainer40Quantity] = useState('');
  const [manifestCorrectionQuantity, setManifestCorrectionQuantity] = useState('');
  const [letterGuaranteeQuantity, setLetterGuaranteeQuantity] = useState('');

  const [redevanceConventionalQuantity, setRedevanceConventionalQuantity] = useState('');
  const [redevanceVehiculeQuantity, setRedevanceVehiculeQuantity] = useState('');
  const [redevanceContainer20Quantity, setRedevanceContainer20Quantity] = useState('');
  const [redevanceContainer40Quantity, setRedevanceContainer40Quantity] = useState('');

  /**
   * Currencies
   */
  const [dollar, setDollar] = useState(2000);
  const [euro, setEuro] = useState(2365);

  useEffect(() => {
    // Dollar

    setAuthKnoledge(authKnoledgeQuantity * 60 * dollar);
    setFirstConvention(firstConventionQuantity * 5 * dollar);
    setSecondConvention(secondConventionQuantity * 5 * dollar);
    setThirdConvention(thirdConventionQuantity * 5 * dollar);
    setFirstVehicule(firstVehiculeQuantity * 65 * dollar);
    setFirstContainer20(firstContainer20Quantity * 110 * dollar);
    setFirstContainer40(firstContainer40Quantity * 220 * dollar);

    setSecondContainer20(secondContainer20Quantity * 150 * dollar);
    setSecondContainer40(secondContainer40Quantity * 300 * dollar);

    setThirdContainer20(thirdContainer20Quantity * 90 * dollar);
    setThirdContainer40(thirdContainer40Quantity * 180 * dollar);
    setManifestCorrection(manifestCorrectionQuantity * 25 * dollar);
    setLetterGuarantee(letterGuaranteeQuantity * 50 * dollar);

    // Euro

    setRedevanceConventional(redevanceConventionalQuantity * 5 * euro);
    setRedevanceVehicule(redevanceVehiculeQuantity * 60 * euro);
    setRedevanceContainer20(redevanceContainer20Quantity * 70 * euro);
    setRedevanceContainer40(redevanceContainer40Quantity * 140 * euro);
  }, [
    authKnoledgeQuantity,
    firstConventionQuantity,
    secondConventionQuantity,
    thirdConventionQuantity,
    firstVehiculeQuantity,
    firstContainer20Quantity,
    firstContainer40Quantity,
    secondContainer20Quantity,
    secondContainer40Quantity,
    thirdContainer20Quantity,
    thirdContainer40Quantity,
    manifestCorrectionQuantity,
    letterGuaranteeQuantity,
    redevanceConventionalQuantity,
    redevanceVehiculeQuantity,
    redevanceContainer20Quantity,
    redevanceContainer40Quantity,
    dollar,
    euro
  ]);

  /**
   * Informations for Agency
   */
  const [agencyTab, setAgencyTab] = useState([]);
  const [agency, setAgency] = useState(null);

  useEffect(() => {
    axios(`${process.env.REACT_APP_BASE_URL}/agence/`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then((value) => {
        setAgencyTab(value.data);
      })
      .catch(() => {});
  }, []);

  /**
   * Informations for Beach
   */
  const [polTab, setPolTab] = useState([]);
  const [pol, setPol] = useState(null);
  const [pod, setPod] = useState(null);

  useEffect(() => {
    axios(`${process.env.REACT_APP_BASE_URL}/pol/`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then((value) => {
        setPolTab(value.data);
      })
      .catch(() => {});
  }, []);

  /**
   * Informations for Vessel
   */
  const [vesselTab, setVesselTab] = useState([]);
  const [vessel, setVessel] = useState(null);

  useEffect(() => {
    axios(`${process.env.REACT_APP_BASE_URL}/vessel/`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then((value) => {
        setVesselTab(value.data);
      })
      .catch(() => {});
  }, []);

  /**
   * Informations for Table
   */
  const [authKnoledge, setAuthKnoledge] = useState(0);
  const [firstConvention, setFirstConvention] = useState(0);
  const [secondConvention, setSecondConvention] = useState(0);
  const [thirdConvention, setThirdConvention] = useState(0);
  const [firstVehicule, setFirstVehicule] = useState(0);
  const [firstContainer20, setFirstContainer20] = useState(0);
  const [firstContainer40, setFirstContainer40] = useState(0);

  const [secondContainer20, setSecondContainer20] = useState(0);
  const [secondContainer40, setSecondContainer40] = useState(0);
  const [thirdContainer20, setThirdContainer20] = useState(0);
  const [thirdContainer40, setThirdContainer40] = useState(0);
  const [manifestCorrection, setManifestCorrection] = useState(0);
  const [letterGuarantee, setLetterGuarantee] = useState(0);

  const [subTotal1, setSubTotal1] = useState(0);
  const [subTotal2, setSubTotal2] = useState(0);
  const [subTotal3, setSubTotal3] = useState(0);
  const [total, setTotal] = useState(0);

  const [redevanceConventional, setRedevanceConventional] = useState(0);
  const [redevanceVehicule, setRedevanceVehicule] = useState(0);
  const [redevanceContainer20, setRedevanceContainer20] = useState(0);
  const [redevanceContainer40, setRedevanceContainer40] = useState(0);

  useEffect(() => {
    setSubTotal1(
      (authKnoledge +
        firstConvention +
        secondConvention +
        thirdConvention +
        firstVehicule +
        firstContainer20 +
        firstContainer40 +
        secondContainer20 +
        secondContainer40 +
        thirdContainer20 +
        thirdContainer40 +
        manifestCorrection +
        letterGuarantee) *
        0.16
    );
    setSubTotal2(
      (authKnoledge +
        firstConvention +
        secondConvention +
        thirdConvention +
        firstVehicule +
        firstContainer20 +
        firstContainer40 +
        secondContainer20 +
        secondContainer40 +
        thirdContainer20 +
        thirdContainer40 +
        manifestCorrection +
        letterGuarantee) *
        0.1
    );
  }, [
    authKnoledge,
    firstConvention,
    secondConvention,
    thirdConvention,
    firstVehicule,
    firstContainer20,
    firstContainer40,
    secondContainer20,
    secondContainer40,
    thirdContainer20,
    thirdContainer40,
    manifestCorrection,
    letterGuarantee
  ]);

  useEffect(() => {
    setSubTotal3(
      redevanceConventional + redevanceVehicule + redevanceContainer20 + redevanceContainer40
    );
  }, [redevanceConventional, redevanceVehicule, redevanceContainer20, redevanceContainer40]);

  useEffect(() => {
    setTotal(Math.round((subTotal1 + subTotal2 + subTotal3) * 10) / 10);
  }, [subTotal1, subTotal2, subTotal3]);

  useEffect(() => {
    // Get User Auth
    const tokenData = localStorage.getItem('lmc_token');

    if (tokenData) {
      const user = jwt.verify(JSON.parse(tokenData), process.env.REACT_APP_JWT_KEY);

      setUser(user);
    }
  }, []);

  function renderText(number) {
    if (number === 1) {
      return 'CONVENTIONNEL < 50 T :';
    }

    if (number === 2) {
      return 'CONVENTIONNEL > 50 T < 500 T :';
    }

    if (number === 3) {
      return '16%';
    }

    if (number === 4) {
      return '10%';
    }

    return '';
  }

  return (
    <Page title="Importation | LMC App">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Importation
          </Typography>
        </Stack>

        <CheckUserAuth />

        <Card className="card-wrapper">
          <Box className="box-wrapper">
            <div className="input-label-wrapper">
              Ag. Douane :{' '}
              <Autocomplete
                className="combo-box-completion"
                options={agencyTab}
                onChange={(event, newType) => {
                  if (newType) {
                    setAgency(newType.name);
                  } else {
                    setAgency(null);
                  }
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner l'agence" variant="outlined" />
                )}
              />
            </div>
            <div className="input-label-wrapper">
              P/O :{' '}
              <Autocomplete
                className="combo-box-completion"
                options={polTab}
                onChange={(event, newType) => {
                  if (newType) {
                    setPol(newType.name);
                  } else {
                    setPol(null);
                  }
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner un P/O" variant="outlined" />
                )}
              />
            </div>
            <div className="input-label-wrapper">
              Navire :{' '}
              <Autocomplete
                className="combo-box-completion"
                options={vesselTab}
                onChange={(event, newType) => {
                  if (newType) {
                    setVessel(newType.name);
                  } else {
                    setVessel(null);
                  }
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner le navire" variant="outlined" />
                )}
              />
            </div>
            <div className="input-label-wrapper">
              B/L N° :{' '}
              <TextField
                className="basic-input"
                label="Saisissez le numéro"
                variant="outlined"
                value={blNumb}
                onChange={(e) => {
                  setBlNumb(e.target.value);
                }}
              />
            </div>
          </Box>
          <Box className="box-2-wrapper">
            <div className="input-label-3-wrapper">
              N° Fiche :{' '}
              <TextField
                className="basic-input"
                label="Saisissez le numéro de fiche"
                variant="outlined"
                value={fileNumb}
                onChange={(e) => {
                  setFileNumb(e.target.value);
                }}
              />
            </div>
            <div className="input-label-3-wrapper">
              Envoi :{' '}
              <TextField
                className="basic-input"
                label="Saisissez ce champ"
                variant="outlined"
                value={send}
                onChange={(e) => setSend(e.target.value)}
              />
            </div>
            <div className="input-label-3-wrapper">
              POD :{' '}
              <Autocomplete
                className="combo-box-completion"
                options={polTab}
                value={polTab.id}
                onChange={(event, newType) => {
                  if (newType) {
                    setPod(newType.name);
                  } else {
                    setPod(null);
                  }
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner un P/O" variant="outlined" />
                )}
              />
            </div>
          </Box>
        </Card>

        <Card className="import-card-wrapper">
          <Box className="import-box-wrapper">
            <div className="input-label-2-wrapper">
              <Typography variant="h6" gutterBottom>
                1 dollar =
              </Typography>
              <TextField
                className="basic-input"
                label="Franc Congolais"
                variant="outlined"
                value={dollar}
                onChange={(e) => {
                  setDollar(e.target.value);
                }}
              />
            </div>
          </Box>
          {/* Bloc 1 - Knowledge Authentication */}
          <Box className="box-3-wrapper">
            <div>AUTHENTIFICATION CONNAISSEMENT :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={authKnoledgeQuantity}
                  onChange={(e) => {
                    setAuthKnoledgeQuantity(e.target.value);
                  }}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={60} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={authKnoledge}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>

          {/* Bloc 2 - Consignment Processing Costs */}
          <Box className="import-box-wrapper">
            <Typography variant="h5" gutterBottom>
              FRAIS TRAITEMENT CONSIGNATION
            </Typography>
          </Box>
          <Box className="box-3-wrapper">
            <div>{renderText(1)}</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={firstConventionQuantity}
                  onChange={(e) => setFirstConventionQuantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={5} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={firstConvention}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>{renderText(2)}</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={secondConventionQuantity}
                  onChange={(e) => setSecondConventionQuantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={5} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={secondConvention}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>CONVENTION => 500 T :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={thirdConventionQuantity}
                  onChange={(e) => setThirdConventionQuantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={5} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={thirdConvention}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>VEHICULE :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={firstVehiculeQuantity}
                  onChange={(e) => setFirstVehiculeQuantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={65} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={firstVehicule}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>CONTENEUR 20' :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={firstContainer20Quantity}
                  onChange={(e) => setFirstContainer20Quantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={110} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={firstContainer20}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>CONTENEUR 40' :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={firstContainer40Quantity}
                  onChange={(e) => setFirstContainer40Quantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={220} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={firstContainer40}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="import-box-wrapper">
            <Typography variant="h5" gutterBottom>
              SOUS-TOTAL 1
            </Typography>
          </Box>
          <Box className="import-box-wrapper">
            <Typography variant="h5" gutterBottom>
              FRAIS TRACKING STRUCTUREL
            </Typography>
          </Box>
          <Box className="box-3-wrapper">
            <div>CONTENEUR 20' :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={secondContainer20Quantity}
                  onChange={(e) => setSecondContainer20Quantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={150} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={secondContainer20}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>CONTENEUR 40' :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={secondContainer40Quantity}
                  onChange={(e) => setSecondContainer40Quantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={300} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={secondContainer40}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="import-box-wrapper">
            <Typography variant="h5" gutterBottom>
              FRAIS GESTION EQUIPEMENT
            </Typography>
          </Box>
          <Box className="box-3-wrapper">
            <div>CONTENEUR 20' :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={thirdContainer20Quantity}
                  onChange={(e) => setThirdContainer20Quantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={90} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={thirdContainer20}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>CONTENEUR 40' :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={thirdContainer40Quantity}
                  onChange={(e) => setThirdContainer40Quantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={180} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={thirdContainer40}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>FRAIS CORRECTION MANIFESTE :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={manifestCorrectionQuantity}
                  onChange={(e) => setManifestCorrectionQuantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={25} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={manifestCorrection}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>FRAIS LETTRE GARANTIE SIMPLE :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={letterGuaranteeQuantity}
                  onChange={(e) => setLetterGuaranteeQuantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={50} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={letterGuarantee}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="import-box-wrapper">
            <Typography variant="h5" gutterBottom>
              SOUS-TOTAL 2
            </Typography>
          </Box>
          <Box className="import-box-wrapper">
            <Typography variant="h5" gutterBottom>
              SOUS-TOTAL 1 + SOUS-TOTAL 2
            </Typography>
          </Box>
          <Box className="box-3-wrapper">
            <div>TVA</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">(SOUS-TOTAL 1 + SOUS-TOTAL 2) X 0,16</div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Prix"
                  variant="outlined"
                  value={renderText(3)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" variant="outlined" value={subTotal1} />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>TAXE DGRKC</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">(SOUS-TOTAL 1 + SOUS-TOTAL 2) X 0,10</div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Prix"
                  variant="outlined"
                  value={renderText(4)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" variant="outlined" value={subTotal2} />
              </div>
            </div>
          </Box>
          <Box className="import-box-wrapper">
            <Typography variant="h5" gutterBottom>
              REDEVANCE DE NAVIGATION
            </Typography>
          </Box>
          <Box className="import-box-wrapper">
            <div className="input-label-2-wrapper">
              <Typography variant="h6" gutterBottom>
                1 euro =
              </Typography>
              <TextField
                className="basic-input"
                label="Franc Congolais"
                variant="outlined"
                value={euro}
                onChange={(e) => {
                  setEuro(e.target.value);
                }}
              />
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>CONVENTIONNEL :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={redevanceConventionalQuantity}
                  onChange={(e) => setRedevanceConventionalQuantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={5} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={redevanceConventional}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>VEHICULE :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={redevanceVehiculeQuantity}
                  onChange={(e) => setRedevanceVehiculeQuantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={60} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={redevanceVehicule}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>CONTENEUR 20' :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={redevanceContainer20Quantity}
                  onChange={(e) => setRedevanceContainer20Quantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={70} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={redevanceContainer20}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="box-3-wrapper">
            <div>CONTENEUR 40' :</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  label="Quantité"
                  variant="outlined"
                  value={redevanceContainer40Quantity}
                  onChange={(e) => setRedevanceContainer40Quantity(e.target.value)}
                />
              </div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" label="Prix" variant="outlined" value={140} />
              </div>
              <div className="input-label-2-wrapper">
                <TextField
                  className="basic-input"
                  variant="outlined"
                  value={redevanceContainer40}
                  label="Total [Fc]"
                />
              </div>
            </div>
          </Box>
          <Box className="import-box-wrapper">
            <Typography variant="h5" gutterBottom>
              SOUS-TOTAL
            </Typography>
          </Box>
          <Box className="box-3-wrapper">
            <div>{renderText(0)}</div>
            <div className="input-calcul-wrapper">
              <div className="input-label-2-wrapper">SOUS-TOTAL</div>
              <div className="input-label-2-wrapper">
                <TextField className="basic-input" variant="outlined" value={subTotal3} />
              </div>
            </div>
          </Box>
        </Card>

        <Card className="card-botton-2-wrapper">
          <div>
            <TextField label="Montant Total [Fc]" variant="outlined" value={total} />
          </div>
          <div>
            <ReactToPrint
              trigger={() => (
                <Button variant="contained" color="primary" disabled={disabledPrint()}>
                  Imprimer
                </Button>
              )}
              content={() => componentRef.current}
              suppressErrors
              onAfterPrint={() => printFacture()}
            />
            <ComponentToPrint
              ref={componentRef}
              client={agency}
              total={total}
              rows={[
                {
                  number: 0,
                  description: 'Authentification Connaissement',
                  weight: authKnoledgeQuantity,
                  price: authKnoledge
                },
                {
                  number: 1,
                  description: 'Conventionnel < 50 T',
                  weight: firstConventionQuantity,
                  price: firstConvention
                },
                {
                  number: 2,
                  description: 'Conventionnel > 50 T < 500 T',
                  weight: secondConventionQuantity,
                  price: secondConvention
                },
                {
                  number: 3,
                  description: 'Convention => 500 T',
                  weight: thirdConventionQuantity,
                  price: thirdConvention
                },
                {
                  number: 4,
                  description: 'Véhicule (Frais Traitement Consignation)',
                  weight: firstVehiculeQuantity,
                  price: firstVehicule
                },
                {
                  number: 5,
                  description: "Conteneur 20' (Frais Traitement Consignation)",
                  weight: firstContainer20Quantity,
                  price: firstContainer20
                },
                {
                  number: 6,
                  description: "Conteneur 40' (Frais Traitement Consignation)",
                  weight: firstContainer40Quantity,
                  price: firstContainer40
                },
                {
                  number: 7,
                  description: "Conteneur 20' (Frais Tracking Structurel)",
                  weight: secondContainer20Quantity,
                  price: secondContainer20
                },
                {
                  number: 8,
                  description: "Conteneur 40' (Frais Tracking Structurel)",
                  weight: secondContainer40Quantity,
                  price: secondContainer40
                },
                {
                  number: 9,
                  description: "Conteneur 20' (Frais Gestion Equipement)",
                  weight: thirdContainer20Quantity,
                  price: thirdContainer20
                },
                {
                  number: 10,
                  description: "Conteneur 40' (Frais Gestion Equipement)",
                  weight: thirdContainer40Quantity,
                  price: thirdContainer40
                },
                {
                  number: 11,
                  description: 'Frais Correction Manifeste',
                  weight: manifestCorrectionQuantity,
                  price: manifestCorrection
                },
                {
                  number: 12,
                  description: 'Frais Lettre Garantie Simple',
                  weight: letterGuaranteeQuantity,
                  price: letterGuarantee
                },
                {
                  number: 13,
                  description: 'Conventionnel (Redevance De Navigation)',
                  weight: redevanceConventionalQuantity,
                  price: redevanceConventional
                },
                {
                  number: 14,
                  description: 'Vehicule (Redevance De Navigation)',
                  weight: redevanceVehiculeQuantity,
                  price: redevanceVehicule
                },
                {
                  number: 15,
                  description: "Conteneur 20' (Redevance De Navigation)",
                  weight: redevanceContainer20Quantity,
                  price: redevanceContainer20
                },
                {
                  number: 16,
                  description: "Conteneur 40' (Redevance De Navigation)",
                  weight: redevanceContainer40Quantity,
                  price: redevanceContainer40
                }
              ]}
            />
          </div>
        </Card>
      </Container>
    </Page>
  );
}
