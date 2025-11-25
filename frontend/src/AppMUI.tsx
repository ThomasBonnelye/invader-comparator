// ========================================
// APP AVEC MATERIAL-UI + CONTEXT API
// ========================================
// NIVEAU : ⭐⭐⭐⭐ EXPERT
// CONCEPTS : MUI, Context API, TypeScript
// ========================================

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Drawer,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { AppProvider, useAppContext } from './contexts/AppContext';

/**
 * CONCEPT : Material-UI (MUI)
 * 
 * MUI fournit des composants React pré-stylés selon Material Design
 * 
 * AVANTAGES vs composants custom :
 * - Design professionnel out-of-the-box
 * - Accessibilité intégrée
 * - Responsive automatique
 * - Thème personnalisable
 * - Documentation complète
 * 
 * ÉQUIVALENT VUE.JS : Vuetify, Quasar
 */

// ========================================
// HEADER COMPONENT
// ========================================

function Header() {
  /**
   * CONCEPT : useAppContext()
   * 
   * Accède directement au Context sans props drilling
   * Plus besoin de passer authenticated, user, etc. via props
   * 
   * ÉQUIVALENT VUE.JS : inject('appState')
   */
  const { authenticated, user, loginWithGoogle, logout, showSettings, setShowSettings } = useAppContext();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Invader Comparator
        </Typography>

        {!authenticated ? (
          <Button color="inherit" onClick={loginWithGoogle}>
            Sign in with Google
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography>{user?.name}</Typography>
            <IconButton color="inherit" onClick={() => setShowSettings(true)}>
              <SettingsIcon />
            </IconButton>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

// ========================================
// SETTINGS DRAWER
// ========================================

function SettingsDrawer() {
  const {
    showSettings,
    setShowSettings,
    myUid,
    setMyUid,
    othersUids,
    newUid,
    setNewUid,
    updateMyUid,
    addOtherUid,
    removeOtherUid,
  } = useAppContext();

  /**
   * CONCEPT MUI : Drawer
   * 
   * Modal latéral pour les paramètres
   * MUI gère l'animation, l'overlay, et l'accessibilité
   * 
   * ÉQUIVALENT VUE.JS : v-navigation-drawer (Vuetify)
   */

  return (
    <Drawer
      anchor="right"
      open={showSettings}
      onClose={() => setShowSettings(false)}
    >
      <Box sx={{ width: 400, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">UID Settings</Typography>
          <IconButton onClick={() => setShowSettings(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* My UID Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            My UID
          </Typography>
          <TextField
            fullWidth
            value={myUid}
            onChange={(e) => setMyUid(e.target.value)}
            placeholder="627F176F-54C3-4D32-90EF-C4C80462A2C3"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={updateMyUid}>
            Save my UID
          </Button>
        </Box>

        {/* Others UIDs Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Other players UIDs
          </Typography>

          <List>
            {othersUids.map((uid) => (
              <ListItem
                key={uid}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeOtherUid(uid)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={uid} primaryTypographyProps={{ fontFamily: 'monospace' }} />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <TextField
              fullWidth
              value={newUid}
              onChange={(e) => setNewUid(e.target.value)}
              placeholder="FAFDC163-BD97-4372-A647-1A063028E579"
              onKeyPress={(e) => e.key === 'Enter' && addOtherUid()}
            />
            <Button variant="contained" onClick={addOtherUid}>
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

// ========================================
// FILTER PANEL WITH MUI
// ========================================

function FilterPanel() {
  const {
    firstOptions,
    secondOptions,
    selectedFirst,
    selectedSeconds,
    search,
    setSelectedFirst,
    setSelectedSeconds,
    setSearch,
  } = useAppContext();

  /**
   * CONCEPT MUI : Select avec multiple
   * 
   * MUI gère automatiquement :
   * - L'affichage des valeurs multiples (Chips)
   * - Le menu déroulant
   * - L'accessibilité
   * 
   * Plus besoin de BaseDropdown custom !
   */

  const handleSecondsChange = (event: SelectChangeEvent<typeof selectedSeconds>) => {
    const value = event.target.value;
    setSelectedSeconds(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Reference Player</InputLabel>
          <Select
            value={selectedFirst}
            onChange={(e) => {
              setSelectedFirst(e.target.value);
              setSelectedSeconds([]); // Reset
            }}
            label="Reference Player"
          >
            {firstOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 300 }} disabled={!selectedFirst}>
          <InputLabel>Compare with</InputLabel>
          <Select
            multiple
            value={selectedSeconds}
            onChange={handleSecondsChange}
            label="Compare with"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const opt = secondOptions.find((o) => o.value === value);
                  return <Chip key={value} label={opt?.label || value} size="small" />;
                })}
              </Box>
            )}
          >
            {secondOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search invaders"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Box>
    </Paper>
  );
}

// ========================================
// DATA TABLE WITH MUI
// ========================================

function DataTable() {
  const { selectedFirst, selectedSeconds, search, playersMap } = useAppContext();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<Record<string, string[]>>({});

  /**
   * CONCEPT : useEffect pour charger les données
   * 
   * Même logique que la version custom, mais avec MUI pour l'affichage
   */
  React.useEffect(() => {
    if (!selectedFirst || selectedSeconds.length === 0) {
      setData({});
      return;
    }

    setLoading(true);
    // Simulation de chargement avec données du Context
    setTimeout(() => {
      // Logique de comparaison ici
      setData({});
      setLoading(false);
    }, 500);
  }, [selectedFirst, selectedSeconds]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (Object.keys(data).length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Select players to compare their invaders
        </Typography>
      </Paper>
    );
  }

  /**
   * CONCEPT MUI : TableContainer
   * 
   * Tableaux stylés et responsives automatiquement
   * Bien mieux que <table> HTML brut
   */
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(data).map((player) => (
              <TableCell key={player}>{player}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render rows here */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ========================================
// MAIN APP COMPONENT
// ========================================

function AppContent() {
  const { message, messageType } = useAppContext();

  /**
   * CONCEPT MUI : Snackbar pour les notifications
   * 
   * Remplace les <div class="message"> custom
   * Animation, positionnement, et accessibilité automatiques
   */

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <SettingsDrawer />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <FilterPanel />
        <DataTable />
      </Container>

      <Snackbar open={!!message} autoHideDuration={5000}>
        <Alert severity={messageType} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/**
 * CONCEPT : Composition Provider + App
 * 
 * L'App est enveloppée dans AppProvider
 * Tous les composants enfants peuvent accéder au Context
 * 
 * ARCHITECTURE :
 * <AppProvider>
 *   <AppContent>
 *     <Header /> → useAppContext()
 *     <SettingsDrawer /> → useAppContext()
 *     <FilterPanel /> → useAppContext()
 *     <DataTable /> → useAppContext()
 *   </AppContent>
 * </AppProvider>
 */
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

/**
 * NOTES PÉDAGOGIQUES :
 * 
 * 1. MUI vs Custom Components :
 *    ✅ MUI : Design cohérent, accessibilité, responsive
 *    ❌ Custom : Plus de travail, bugs potentiels
 * 
 * 2. Context API vs Props :
 *    Sans Context : App → FilterPanel → Dropdown (props drilling)
 *    Avec Context : Dropdown → useAppContext() (accès direct)
 * 
 * 3. Composants MUI utilisés :
 *    - AppBar, Toolbar : Header
 *    - Drawer : Settings panel
 *    - Select, MenuItem : Dropdowns
 *    - TextField : Inputs
 *    - Button, IconButton : Boutons
 *    - Snackbar, Alert : Notifications
 *    - Table, TableContainer : Tableaux
 *    - CircularProgress : Loading
 * 
 * 4. Avantages de cette approche :
 *    - Code plus concis
 *    - Maintenance facilitée
 *    - Design professionnel
 *    - Accessibilité out-of-the-box
 *    - Performance optimisée (React.memo automatique)
 */
