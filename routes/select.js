const q = require('../db/query');
// Optionen für Abnahmevertraege
exports.abnahmevertraege = (req, res, next) => {
  const sql = "SELECT DISTINCT AV_Jahr FROM  `Abnahmevertrag` ORDER BY AV_Jahr DESC";
  const logText = "Abnahmeverträge";

  q.query(res, sql, logText)
};

// Optionen für Abnehmer
exports.abnehmer = (req, res, next) => {
  const sql = "SELECT P_ID, B_Name FROM `Person` WHERE Geschaeftsp_Typ_GPT_ID = 1 OR Geschaeftsp_Typ_GPT_ID = 3 ORDER BY B_Name";
  const logText = "Abnehmer";

  q.query(res, sql, logText)
};

// Optionen für Analysen
exports.analysen = (req, res, next) => {
  const sql = "SELECT AT_ID, AT_Bezeichnung FROM `Analysetyp` ORDER BY AT_Bezeichnung";
  const logText = "Analysen";

  q.query(res, sql, logText)
};

// Optionen für Direktrohstoffe
exports.direktrohstoff = (req, res, next) => {
  const sql = "SELECT S_ID, S_Bezeichnung, ME_ID, ME_Bezeichnung FROM `Mengeneinheit`, `Stoff` WHERE Stofftyp = 'Direktrohstoff' AND Mengeneinheit_ME_ID = ME_ID  ORDER BY S_Bezeichnung ";
  const logText = "Direktrohstoffe";

  q.query(res, sql, logText)
};

// Optionen für Lager
exports.lager = (req, res, next) => {
  const sql = "SELECT L_ID, L_Name, ME_ID, ME_Bezeichnung FROM `Lager`, `Mengeneinheit`, `Stoff` WHERE Stoff_S_ID = S_ID AND Mengeneinheit_ME_ID = ME_ID  ORDER BY L_Name ";
  const logText = "Lager";

  q.query(res, sql, logText)
};

// Optionen für Lagerrohstoffe
exports.lagerrohstoff = (req, res, next) => {
  const sql = "SELECT S_ID, S_Bezeichnung, Mengeneinheit_ME_ID, ME_Bezeichnung FROM Stoff, Mengeneinheit WHERE Stofftyp = 'Lagerrohstoff' AND Mengeneinheit_ME_ID = ME_ID ORDER BY S_Bezeichnung";
  const logText = "Stoffe";

  q.query(res, sql, logText)
};

// Optionen für Lieferanten
exports.lieferant = (req, res, next) => {
  const sql = "SELECT P_ID, B_Name FROM `Person` WHERE Geschaeftsp_Typ_GPT_ID = 2 OR Geschaeftsp_Typ_GPT_ID = 3 ORDER BY B_Name";
  const logText = "Lieferanten";

  q.query(res, sql, logText)
};

// Optionen für Mengeneinheiten
exports.mengeneinheit = (req, res, next) => {
  const sql = "SELECT * FROM Mengeneinheit ORDER BY ME_Bezeichnung";
  const logText = "Mengeneinheiten";

  q.query(res, sql, logText)
};

// Optionen für Stoffe
exports.stoff = (req, res, next) => {
  const sql = "SELECT S_ID, S_Bezeichnung FROM Stoff ORDER BY S_Bezeichnung";
  const logText = "Stoffe";

  q.query(res, sql, logText)
};