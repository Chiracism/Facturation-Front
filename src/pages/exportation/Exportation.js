import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

// Material UI Component
import { Card, Stack, Container, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import PropTypes, { number } from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { lighten } from '@material-ui/core/styles';

// Import Component for Material DataTable
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

// Import Component for Material Roulant Card
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ReactToPrint from 'react-to-print';
import ComponentToPrintNote from './ComponentToPrintNote';
import ComponentToPrintBill from './ComponentToPrintBill';

import './Exportation.css';

// components
import Page from '../../components/Page';

import { numberValidation } from '../../utils/validate';

// ----------------------------------------------------------------------

// Type of materiels
const typeDatas = [
  { id: 1, name: 'Matériel Roulant' },
  { id: 2, name: 'Marchandise Dangereuse' },
  { id: 3, name: 'Marchandise Non Dangereuse' },
  { id: 4, name: 'Containeur' }
];

export default function Exportation() {
  // Counter for ID in table
  const [counter, setCounter] = useState(1);
  const [totalCart, setTotalCart] = useState(0);
  const componentNoteRef = useRef();
  const componentBillRef = useRef();
  const rowsRef = useRef();
  const serieRef = useRef();

  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  const [serie, setSerie] = useState('');
  const [user, setUser] = useState(null);

  const reloadPage = () => {
    window.location.reload();
  };

  function diplayPrintAction() {
    if (
      client !== '' &&
      client !== null &&
      consignee !== '' &&
      consignee !== null &&
      consigneeAddress !== '' &&
      consigneeAddress !== null &&
      vessel !== '' &&
      vessel !== null
    )
      return false;
    return true;
  }

  function RandomSerieNumber() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().substr(-2);
    const month = currentDate.getMonth() + 1;
    let monthSaved = 0;
    let numberSaved = 0;

    const number = Math.floor(Math.random() * 10000);

    // Concat Month
    if (month < 10) {
      monthSaved = `0${month}`;
    } else {
      monthSaved = month;
    }

    // Concat Number
    if (number < 10) {
      numberSaved = `000${number}`;
    } else if (number < 100 && number >= 10) {
      numberSaved = `00${number}`;
    } else if (number < 1000 && number >= 100) {
      numberSaved = `0${number}`;
    } else {
      numberSaved = number;
    }

    setSerie(`P${monthSaved}${year}BC${numberSaved}`);

    serieRef.current = serie;
  }

  function displayMaterielRoulantCart() {
    if (
      client !== '' &&
      client !== null &&
      quantity !== '' &&
      quantity !== null &&
      description !== '' &&
      description !== null &&
      vessel !== '' &&
      vessel !== null
    )
      return false;
    return true;
  }

  function displayMarchandiseCart() {
    if (
      client !== '' &&
      client !== null &&
      quantity !== '' &&
      quantity !== null &&
      vessel !== '' &&
      vessel !== null
    )
      return false;
    return true;
  }

  // Print Facture
  function printFacture() {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/historic/`,
        {
          rows,
          client: client.name,
          consignee,
          user: user.name,
          serie,
          freight,
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

  useEffect(() => {
    // Initial Number Serie
    RandomSerieNumber();
  }, []);

  useEffect(() => {
    // Get User Auth
    const tokenData = localStorage.getItem('lmc_token');

    if (tokenData) {
      const user = jwt.verify(JSON.parse(tokenData), process.env.REACT_APP_JWT_KEY);

      setUser(user);
    }
  }, []);

  /**
   * Informations for Client
   */
  const [clientTab, setClientTab] = useState([]);
  const [client, setClient] = useState(null);
  const [consignee, setConsignee] = useState(null);
  const [consigneeAddress, setConsigneeAddress] = useState(null);
  const [feriNumber, setFeriNumber] = useState('');
  const [freight, setFreight] = useState('Payé');

  useEffect(() => {
    axios(`${process.env.REACT_APP_BASE_URL}/client/`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then((value) => {
        setClientTab(value.data);
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
   * Informations for POL
   */
  const [polTab, setPolTab] = useState([]);
  const [pol, setPol] = useState(null);

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
   * Informations for POD
   */
  const [podTab, setPodTab] = useState([]);
  const [pod, setPod] = useState(null);

  useEffect(() => {
    axios(`${process.env.REACT_APP_BASE_URL}/pol/`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then((value) => {
        setPodTab(value.data);
      })
      .catch(() => {});
  }, []);

  /**
   * Informations for Materiel Roulant Table
   */
  const [state, setState] = useState({
    checkedA: false,
    checkedB: false,
    checkedC: false,
    checkedD: false
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [cubage, setCubage] = useState(0);
  const [fret, setFret] = useState(0);
  const [pc, setPC] = useState(0);
  const [pltc, setPLTC] = useState(0);
  const [soute, setSoute] = useState(0);
  const [dossier, setDossier] = useState(0);
  const [montantMaterielRoulant, setMontantMaterielRoulant] = useState(0);

  function validateCubage() {
    if (cubage > 100) {
      const diffCubageValue = (cubage - 100) * 100;
      setFret(8600 + diffCubageValue);
      setPC(150);
      setPLTC(11.85);
      setSoute(440);
      setDossier(80);
    } else {
      axios(`${process.env.REACT_APP_BASE_URL}/materielroulant/${cubage}`, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
        }
      })
        .then((value) => {
          setFret(value.data.fret);
          setPC(value.data.pc);
          setPLTC(value.data.pltc);
          setSoute(value.data.sout);
          setDossier(value.data.dossier);
        })
        .catch(() => {});
    }
  }

  function AddToCartMaterielRoulant() {
    setCounter(counter + 1);
    setRows([
      ...rows,
      {
        id: counter,
        description,
        quantity,
        unit: 'm3',
        price: fret,
        total: montantMaterielRoulant,
        commission: (fret * client.commission) / 100,
        extra: (fret * client.extra_fac) / 100,
        solde:
          montantMaterielRoulant -
          (fret * client.commission) / 100 -
          (fret * client.extra_fac) / 100
      }
    ]);
    setTotalCart(totalCart + montantMaterielRoulant);
  }

  useEffect(() => {
    let totalFret = 0;
    const tabCheckBox = [state.checkedA, state.checkedB, state.checkedC, state.checkedD];

    tabCheckBox.forEach((item, index) => {
      if (index === 0 && item) {
        totalFret += 0.25 * fret;
      }
      if (index === 1 && item) {
        totalFret += 0.1 * fret;
      }
      if (index === 2 && item) {
        totalFret += 0.2 * fret;
      }
      if (index === 3 && item) {
        totalFret += 930 + 51 + 70 + 6.2 + 80;
      }
    });

    setMontantMaterielRoulant((fret + totalFret + pc + pltc + soute + dossier) * quantity);
  }, [
    fret,
    pc,
    pltc,
    soute,
    dossier,
    state.checkedA,
    state.checkedB,
    state.checkedC,
    state.checkedD,
    quantity
  ]);

  /**
   * Informations for Marchandises dangereuses
   */
  const [marchandiseDangereuse, setMarchandiseDangereuse] = useState([]);
  const [marchandiseDangereuseData, setMarchandiseDangereuseData] = useState(null);

  const [fretMarchandiseDangereuse, setFretMarchandiseDangereuse] = useState(0);
  const [souteMarchandiseDangereuse, setSouteMarchandiseDangereuse] = useState(0);
  const [pcMarchandiseDangereuse, setPcMarchandiseDangereuse] = useState(0);
  const [pltcMarchandiseDangereuse, setPltcMarchandiseDangereuse] = useState(0);

  const [volumeMarchandiseDangereuse, setVolumeMarchandiseDangereuse] = useState(null);
  const [montantMarchandiseDangereuse, setMontantMarchandiseDangereuse] = useState(0);

  useEffect(() => {
    axios(`${process.env.REACT_APP_BASE_URL}/marchandisedangereuse/`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then((value) => {
        setMarchandiseDangereuse(value.data);
      })
      .catch(() => {});
  }, []);

  const addToCartMarchandiseDangereuse = () => {
    setCounter(counter + 1);
    setRows([
      ...rows,
      {
        id: counter,
        description: marchandiseDangereuseData.name,
        quantity,
        unit: 'tonne',
        price: fretMarchandiseDangereuse,
        total: montantMarchandiseDangereuse,
        commission: (fretMarchandiseDangereuse * client.commission) / 100,
        extra: (fretMarchandiseDangereuse * client.extra_fac) / 100,
        solde:
          montantMarchandiseDangereuse -
          (fretMarchandiseDangereuse * client.commission) / 100 -
          (fretMarchandiseDangereuse * client.extra_fac) / 100
      }
    ]);

    setTotalCart(totalCart + montantMarchandiseDangereuse);
  };

  const validateWeightOrVolumeMarchandiseDangereuse = () => {
    setMontantMarchandiseDangereuse(
      (volumeMarchandiseDangereuse * fretMarchandiseDangereuse +
        souteMarchandiseDangereuse +
        pcMarchandiseDangereuse +
        pltcMarchandiseDangereuse) *
        quantity
    );
  };

  /**
   * Informations for Marchandises non dangereuses
   */
  const [marchandiseNonDangereuse, setMarchandiseNonDangereuse] = useState([]);
  const [marchandiseNonDangereuseData, setMarchandiseNonDangereuseData] = useState(null);

  const [fretMarchandiseNonDangereuse, setFretMarchandiseNonDangereuse] = useState(0);
  const [souteMarchandiseNonDangereuse, setSouteMarchandiseNonDangereuse] = useState(0);
  const [pcMarchandiseNonDangereuse, setPcMarchandiseNonDangereuse] = useState(0);
  const [pltcMarchandiseNonDangereuse, setPltcMarchandiseNonDangereuse] = useState(0);

  const [volumeMarchandiseNonDangereuse, setVolumeMarchandiseNonDangereuse] = useState(null);
  const [montantMarchandiseNonDangereuse, setMontantMarchandiseNonDangereuse] = useState(0);

  useEffect(() => {
    axios(`${process.env.REACT_APP_BASE_URL}/marchandisenondangereuse/`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then((value) => {
        setMarchandiseNonDangereuse(value.data);
      })
      .catch(() => {});
  }, []);

  const addToCartMarchandiseNonDangereuse = () => {
    setCounter(counter + 1);
    setRows([
      ...rows,
      {
        id: counter,
        description: marchandiseNonDangereuseData.name,
        quantity,
        unit: 'tonne',
        price: fretMarchandiseNonDangereuse,
        total: montantMarchandiseNonDangereuse,
        commission: (fretMarchandiseNonDangereuse * client.commission) / 100,
        extra: (fretMarchandiseNonDangereuse * client.extra_fac) / 100,
        solde:
          montantMarchandiseNonDangereuse -
          (fretMarchandiseNonDangereuse * client.commission) / 100 -
          (fretMarchandiseNonDangereuse * client.extra_fac) / 100
      }
    ]);

    setTotalCart(totalCart + montantMarchandiseNonDangereuse);
  };

  const validateWeightOrVolumeMarchandiseNonDangereuse = () => {
    setMontantMarchandiseNonDangereuse(
      (fretMarchandiseNonDangereuse * volumeMarchandiseNonDangereuse +
        souteMarchandiseNonDangereuse +
        pcMarchandiseNonDangereuse +
        pltcMarchandiseNonDangereuse) *
        quantity
    );
  };

  /**
   * Informations for Containers
   */
  const [fretContainer, setFretContainer] = useState(0);
  const [soutesContainer, setSoutesContainer] = useState(0);
  const [portSurchargeContainer, setPortSurchargeContainer] = useState(0);
  const [terminalContainer, setTerminalContainer] = useState(0);
  const [emergencyContainer, setEmergencyContainer] = useState(0);
  const [montantContainer, setMontantContainer] = useState(0);

  const [typeContainer, setTypeContainer] = useState([]);
  const [container, setContainer] = useState([]);
  const [singleContainer, setSingleContainer] = useState({});
  const [singleTypeContainer, setSingleTypeContainer] = useState({});

  useEffect(() => {
    axios(`${process.env.REACT_APP_BASE_URL}/container/`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then((value) => {
        setContainer(value.data);
      })
      .catch(() => {});

    axios(`${process.env.REACT_APP_BASE_URL}/typecontainer/`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then((value) => {
        setTypeContainer(value.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMontantContainer(
      (fretContainer +
        soutesContainer +
        portSurchargeContainer +
        terminalContainer +
        emergencyContainer) *
        quantity
    );
  }, [
    fretContainer,
    soutesContainer,
    portSurchargeContainer,
    terminalContainer,
    emergencyContainer,
    quantity
  ]);

  const getAllContainerDatas = () => {
    axios(
      `${process.env.REACT_APP_BASE_URL}/fullcontainer/${singleTypeContainer.id}/${singleContainer.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
        }
      }
    )
      .then((value) => {
        setFretContainer(value.data.fret);
        setSoutesContainer(value.data.soute);
        setPortSurchargeContainer(value.data.port_surcharge);
        setTerminalContainer(value.data.terminal_charge);
        setEmergencyContainer(value.data.emergency);
      })
      .catch(() => {});
  };

  function addToCartContainer() {
    setCounter(counter + 1);
    setRows([
      ...rows,
      {
        id: counter,
        description,
        quantity,
        unit: 'box',
        price: fretContainer,
        total: montantContainer,
        commission: (fretContainer * client.commission) / 100,
        extra: (fretContainer * client.extra_fac) / 100,
        solde:
          montantContainer -
          (fretContainer * client.commission) / 100 -
          (fretContainer * client.extra_fac) / 100
      }
    ]);

    setTotalCart(totalCart + montantContainer);
  }

  /**
   * Methodes for Material DataTable
   */
  const [type, setType] = useState(0);
  const [rows, setRows] = useState([]);

  rowsRef.current = rows;

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    { id: 'id', numeric: true, disablePadding: true, label: 'ID' },
    { id: 'description', numeric: false, disablePadding: true, label: 'Description' },
    { id: 'quantity', numeric: true, disablePadding: true, label: 'Quantité' },
    { id: 'unit', numeric: false, disablePadding: true, label: 'Unité Payante' },
    { id: 'price', numeric: true, disablePadding: true, label: 'Prix' },
    { id: 'total', numeric: true, disablePadding: true, label: 'Total' },
    { id: 'commission', numeric: true, disablePadding: true, label: 'Commission' },
    { id: 'extra', numeric: true, disablePadding: true, label: 'Extra Fac' },
    { id: 'solde', numeric: true, disablePadding: true, label: 'Solde' }
  ];

  function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align="left"
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  function printDeleteArray(selectedId) {
    let newTab = null;
    let sum = 0;
    newTab = [];

    rows.forEach((item) => {
      if (!selectedId.includes(item.id)) {
        newTab.push(item);
        sum += item.solde;
      }
    });

    // setRows(rows.filter((item) => !selectedId.includes(item.id)));

    setRows(newTab);
    setTotalCart(sum);
  }

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      flex: '1 1 100%'
    }
  }));

  const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected, selectedId } = props;

    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            LISTE DES ACHATS
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteIcon onClick={() => printDeleteArray(selectedId)} />
            </IconButton>
          </Tooltip>
        ) : null}
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%'
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1
    }
  }));

  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('produit');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <Page title="Exportation | LMC App">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Exportation
          </Typography>
          <Box>
            <Button variant="contained" color="primary" onClick={() => reloadPage()}>
              Rafraîchir
            </Button>
          </Box>
        </Stack>

        <Card className="card-wrapper">
          <Box className="box-wrapper">
            <div className="input-label-wrapper">
              Chargeur :{' '}
              <Autocomplete
                className="combo-box-completion"
                options={clientTab}
                value={clientTab.id}
                onChange={(event, newType) => {
                  if (newType) {
                    setClient(newType);
                  } else {
                    setClient(null);
                  }
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner le chargeur" variant="outlined" />
                )}
              />
            </div>
            <div className="input-label-wrapper">
              Consignee :{' '}
              <TextField
                className="basic-input"
                label="Saisissez la consignée"
                variant="outlined"
                value={consignee}
                onChange={(e) => setConsignee(e.target.value)}
              />
            </div>
            <div className="input-label-wrapper">
              Adresse Consignée :{' '}
              <TextField
                className="basic-input"
                label="Saisissez l'adresse du consignée"
                variant="outlined"
                value={consigneeAddress}
                onChange={(e) => setConsigneeAddress(e.target.value)}
              />
            </div>
            <div className="input-label-wrapper">
              N° Féri :{' '}
              <TextField
                className="basic-input"
                label="Saisissez le numéro Féri"
                variant="outlined"
                value={feriNumber}
                onChange={(e) => {
                  setFeriNumber(e.target.value);
                }}
              />
            </div>
          </Box>
          <Box className="box-wrapper">
            <div className="input-label-wrapper">
              Vessel :{' '}
              <Autocomplete
                className="combo-box-completion"
                options={vesselTab}
                value={vesselTab.id}
                onChange={(event, newType) => {
                  if (newType) {
                    setVessel(newType);
                  } else {
                    setVessel(null);
                  }
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner le vessel" variant="outlined" />
                )}
              />
            </div>
            <div className="input-label-wrapper">
              POL :{' '}
              <Autocomplete
                className="combo-box-completion"
                options={polTab}
                value={polTab.id}
                onChange={(event, newType) => {
                  if (newType) {
                    setPol(newType);
                  } else {
                    setPol(null);
                  }
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner un POL" variant="outlined" />
                )}
              />
            </div>
            <div className="input-label-wrapper">
              POD :{' '}
              <Autocomplete
                className="combo-box-completion"
                options={podTab}
                value={podTab.id}
                onChange={(event, newType) => {
                  if (newType) {
                    setPod(newType);
                  } else {
                    setPod(null);
                  }
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner un POD" variant="outlined" />
                )}
              />
            </div>
            <div className="input-label-wrapper">
              Freight :{' '}
              <FormControl className="combo-box-completion">
                <InputLabel id="demo-simple-select-label">Freight</InputLabel>
                <Select
                  value={freight}
                  label="Freight"
                  onChange={(e) => setFreight(e.target.value)}
                >
                  <MenuItem value="Payé">Payé</MenuItem>
                  <MenuItem value="Non Payé">Non Payé</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Box>
        </Card>

        <Card className="card-middle-wrapper">
          <Box className="box-middle-wrapper">
            <div className="input-label-wrapper">
              Type :{' '}
              <Autocomplete
                className="combo-box-completion"
                options={typeDatas}
                value={typeDatas.id}
                onChange={(event, newType) => {
                  if (newType) {
                    setType(newType.id);
                  } else {
                    setType(0);
                  }
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sélectionner le type de matériel"
                    variant="outlined"
                  />
                )}
              />
            </div>
          </Box>
        </Card>

        {type === 1 ? (
          <Card className="card-materiel-roulant-wrapper">
            <Box className="header-card-type--wrapper">
              <div className="input-label-wrapper">
                Cubage :{' '}
                <TextField
                  className="basic-input-cubage"
                  label="Saisissez le cubage"
                  variant="outlined"
                  value={cubage}
                  onChange={(e) => setCubage(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={() => validateCubage()}>
                  VALIDER
                </Button>
              </div>
              <div className="input-label-wrapper">
                <TextField
                  className="basic-input-cubage"
                  placeholder="Saisissez la description du produit"
                  label="Description Produit"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                  className="basic-input-cubage"
                  placeholder="Saisissez la quantité"
                  label="Quantité"
                  variant="outlined"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </Box>
            <Box className="box-botton-wrapper">
              <div className="input-label-wrapper">
                <TextField
                  className="basic-bottom-input"
                  value={fret}
                  label="FRET"
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  value={soute}
                  label="SOUTES"
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  value={pc}
                  label="PC"
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  value={pltc}
                  label="PLTC"
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input-last"
                  value={dossier}
                  label="DOSSIER"
                  variant="outlined"
                />
              </div>
            </Box>
            <Box className="box-botton-wrapper">
              <FormGroup row className="checkbox-materiel-roulant-wrapper">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.checkedA}
                      onChange={handleChange}
                      name="checkedA"
                      color="primary"
                    />
                  }
                  label="VEHICULE NEUF"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.checkedB}
                      onChange={handleChange}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="COLIS CONTENU DANS LE VEHICULE"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.checkedC}
                      onChange={handleChange}
                      name="checkedC"
                      color="primary"
                    />
                  }
                  label="TRACTEUR"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.checkedD}
                      onChange={handleChange}
                      name="checkedD"
                      color="primary"
                    />
                  }
                  label="VOITURE DANS UN VEHICULE"
                />
              </FormGroup>
            </Box>
            <Box className="box-bottom-second-wrapper">
              <TextField
                className="basic-input-cubage"
                label="Montant"
                variant="outlined"
                value={montantMaterielRoulant}
              />
            </Box>
            <Box className="box-bottom-second-wrapper">
              <Button
                variant="contained"
                color="primary"
                disabled={displayMaterielRoulantCart()}
                onClick={() => AddToCartMaterielRoulant()}
              >
                AJOUTER AU PANIER
              </Button>
            </Box>
          </Card>
        ) : null}
        {type === 2 ? (
          <Card className="card-materiel-roulant-wrapper">
            <Box className="header-card-type--wrapper">
              <div className="input-label-wrapper">
                Poids ou Volume :{' '}
                <TextField
                  className="basic-input-cubage"
                  label="Saisissez le poids ou le volume"
                  variant="outlined"
                  onChange={(e) => {
                    setVolumeMarchandiseDangereuse(e.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => validateWeightOrVolumeMarchandiseDangereuse()}
                >
                  VALIDER
                </Button>
              </div>
              <div className="input-label-wrapper">
                <TextField
                  className="basic-input-cubage"
                  placeholder="Saisissez la quantité"
                  label="Quantité"
                  variant="outlined"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </Box>
            <Box className="box-botton-wrapper">
              <Autocomplete
                className="combo-box-completion-marcharchandise"
                options={marchandiseDangereuse}
                value={marchandiseDangereuse.id}
                onChange={(event, newType) => {
                  if (newType) {
                    setMarchandiseDangereuseData(newType.name);
                    setFretMarchandiseDangereuse(newType.fret);
                  } else {
                    setFretMarchandiseDangereuse(0);
                  }
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner une marchandise" variant="outlined" />
                )}
              />
            </Box>
            <Box className="box-botton-wrapper">
              <div className="input-label-wrapper">
                <TextField
                  className="basic-bottom-input"
                  label="Fret"
                  value={fretMarchandiseDangereuse}
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  label="Soute"
                  value={souteMarchandiseDangereuse}
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  label="Port Charge"
                  value={pcMarchandiseDangereuse}
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  label="PLTC"
                  value={pltcMarchandiseDangereuse}
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input-last"
                  label="Montant"
                  value={montantMarchandiseDangereuse}
                  variant="outlined"
                />
              </div>
            </Box>

            <Box className="box-bottom-second-wrapper">
              <Button
                variant="contained"
                color="primary"
                disabled={displayMarchandiseCart()}
                onClick={() => addToCartMarchandiseDangereuse()}
              >
                AJOUTER AU PANIER
              </Button>
            </Box>
          </Card>
        ) : null}
        {type === 3 ? (
          <Card className="card-materiel-roulant-wrapper">
            <Box className="header-card-type--wrapper">
              <div className="input-label-wrapper">
                Poids ou Volume :{' '}
                <TextField
                  className="basic-input-cubage"
                  label="Saisissez le poids ou le volume"
                  variant="outlined"
                  onChange={(e) => {
                    setVolumeMarchandiseNonDangereuse(e.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => validateWeightOrVolumeMarchandiseNonDangereuse()}
                >
                  VALIDER
                </Button>
              </div>
              <div className="input-label-wrapper">
                <TextField
                  className="basic-input-cubage"
                  placeholder="Saisissez la quantité"
                  label="Quantité"
                  variant="outlined"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </Box>
            <Box className="box-botton-wrapper">
              <Autocomplete
                className="combo-box-completion-marcharchandise"
                options={marchandiseNonDangereuse}
                value={marchandiseNonDangereuse.id}
                onChange={(event, newType) => {
                  if (newType) {
                    setMarchandiseNonDangereuseData(newType);

                    setFretMarchandiseNonDangereuse(newType.fret);
                    setSouteMarchandiseNonDangereuse(newType.soute);
                    setPcMarchandiseNonDangereuse(newType.port_charge);
                    setPltcMarchandiseNonDangereuse(newType.pltc);
                  } else {
                    setFretMarchandiseNonDangereuse(0);
                    setSouteMarchandiseNonDangereuse(0);
                    setPcMarchandiseNonDangereuse(0);
                    setPltcMarchandiseNonDangereuse(0);
                  }
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner une marchandise" variant="outlined" />
                )}
              />
            </Box>
            <Box className="box-botton-wrapper">
              <div className="input-label-wrapper">
                <TextField
                  className="basic-bottom-input"
                  label="Fret"
                  value={fretMarchandiseNonDangereuse}
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  label="Soute"
                  value={souteMarchandiseNonDangereuse}
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  label="Port Charge"
                  value={pcMarchandiseNonDangereuse}
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  label="PLTC"
                  value={pltcMarchandiseNonDangereuse}
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input-last"
                  label="Montant"
                  value={montantMarchandiseNonDangereuse}
                  variant="outlined"
                />
              </div>
            </Box>

            <Box className="box-bottom-second-wrapper">
              <Button
                variant="contained"
                color="primary"
                disabled={displayMarchandiseCart()}
                onClick={() => addToCartMarchandiseNonDangereuse()}
              >
                AJOUTER AU PANIER
              </Button>
            </Box>
          </Card>
        ) : null}
        {type === 4 ? (
          <Card className="card-materiel-roulant-wrapper">
            <Box className="header-card-type--wrapper">
              <div className="input-label-wrapper">
                Type :{' '}
                <Autocomplete
                  className="combo-box-completion-container"
                  options={typeContainer}
                  value={typeContainer.id}
                  onChange={(event, newType) => {
                    if (newType) {
                      setSingleTypeContainer(newType);
                    }
                  }}
                  getOptionLabel={(option) => option.name}
                  style={{ width: 400 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Sélectionner un type" variant="outlined" />
                  )}
                />
                <Button variant="contained" color="primary" onClick={() => getAllContainerDatas()}>
                  VALIDER
                </Button>
              </div>
              <div className="input-label-wrapper">
                <TextField
                  className="basic-input-cubage"
                  placeholder="Saisissez la description du produit"
                  label="Description Produit"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                  className="basic-input-cubage"
                  placeholder="Saisissez la quantité"
                  label="Quantité"
                  variant="outlined"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </Box>
            <Box className="box-botton-wrapper">
              <Autocomplete
                className="combo-box-completion-marcharchandise"
                options={container}
                value={container.id}
                onChange={(event, newType) => {
                  setSingleContainer(newType);
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sélectionner une marchandise" variant="outlined" />
                )}
              />
            </Box>
            <Box className="box-botton-wrapper">
              <div className="input-label-wrapper">
                <TextField
                  className="basic-bottom-input"
                  value={fretContainer}
                  label="Fret"
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  value={soutesContainer}
                  label="Soutes"
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  value={portSurchargeContainer}
                  label="Port Surcharge"
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  value={terminalContainer}
                  label="Terminal"
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input"
                  value={emergencyContainer}
                  label="Emergency"
                  variant="outlined"
                />
                <TextField
                  className="basic-bottom-input-last"
                  value={montantContainer}
                  label="Montant"
                  variant="outlined"
                />
              </div>
            </Box>

            <Box className="box-bottom-second-wrapper">
              <Button
                variant="contained"
                color="primary"
                disabled={displayMaterielRoulantCart()}
                onClick={() => addToCartContainer()}
              >
                AJOUTER AU PANIER
              </Button>
            </Box>
          </Card>
        ) : null}
        {rows.length > 0 ? (
          <Card className="table-card-wrapper">
            <div className={classes.root}>
              <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected.length} selectedId={selected} />
                <TableContainer>
                  <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                    aria-label="enhanced table"
                  >
                    <EnhancedTableHead
                      classes={classes}
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                    />
                    <TableBody>
                      {stableSort(rows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                          const isItemSelected = isSelected(row.id);
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              hover
                              onClick={(event) => handleClick(event, row.id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isItemSelected}
                                  inputProps={{ 'aria-labelledby': labelId }}
                                  onChange={(event) => handleClick(event, row.id)}
                                />
                              </TableCell>
                              <TableCell component="th" id={labelId} scope="row" padding="none">
                                {row.id}
                              </TableCell>
                              <TableCell padding="none">{row.description}</TableCell>
                              <TableCell padding="none">{row.quantity}</TableCell>
                              <TableCell padding="none">{row.unit}</TableCell>
                              <TableCell padding="none">{row.price}</TableCell>
                              <TableCell padding="none">{row.total}</TableCell>
                              <TableCell padding="none">{row.commission}</TableCell>
                              <TableCell padding="none">{row.extra}</TableCell>
                              <TableCell padding="none">{row.solde}</TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          </Card>
        ) : null}

        {rows.length > 0 ? (
          <Card className="card-botton-wrapper">
            <Box className="box-botton-wrapper">
              <TextField
                className="basic-bottom-input-last"
                label="TOTAL"
                variant="outlined"
                value={totalCart}
              />
            </Box>
            <div className="card-print-export-wrapper">
              <div className="card-print-export-first">
                <ReactToPrint
                  // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                  // to the root node of the returned component as it will be overwritten.
                  trigger={() => (
                    <Button variant="contained" color="primary" disabled={diplayPrintAction()}>
                      Imprimer Note
                    </Button>
                  )}
                  content={() => componentNoteRef.current}
                  suppressErrors
                />
                {client && client.name ? (
                  <ComponentToPrintNote
                    ref={componentNoteRef}
                    rows={rows}
                    client={client}
                    total={totalCart}
                    consignee={consignee}
                    consigneeAddress={consigneeAddress}
                    vessel={vessel}
                    pol={pol}
                    pod={pod}
                    serie={serie}
                    feri={feriNumber}
                    freight={freight}
                  />
                ) : null}
              </div>
              <div>
                <ReactToPrint
                  // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                  // to the root node of the returned component as it will be overwritten.
                  trigger={() => (
                    <Button variant="contained" color="primary" disabled={diplayPrintAction()}>
                      Imprimer BL
                    </Button>
                  )}
                  content={() => componentBillRef.current}
                  suppressErrors
                  onAfterPrint={() => printFacture()}
                />
                {client && client.name ? (
                  <ComponentToPrintBill
                    ref={componentBillRef}
                    rows={rows}
                    client={client}
                    total={totalCart}
                    consignee={consignee}
                    consigneeAddress={consigneeAddress}
                    vessel={vessel}
                    pol={pol}
                    pod={pod}
                    serie={serie}
                    feri={feriNumber}
                    freight={freight}
                  />
                ) : null}
              </div>
            </div>
          </Card>
        ) : null}
      </Container>
    </Page>
  );
}
