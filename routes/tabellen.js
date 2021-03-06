const q = require('../db/query');
// Gebuchte Zugänge
exports.abgaben = (req, res, next) => {
  const sql = 'SELECT AG_ID AS ID, DATE_FORMAT(AG_DatumBeginn, "%d.%m.%y") AS Anfangsdatum, DATE_FORMAT(AG_DatumEnde, "%d.%m.%y") AS Enddatum, AG_Menge AS Menge, B_Name As Abnehmer FROM Abgabe, Person  WHERE Person_P_ID = P_ID AND AG_Menge > 0 ORDER BY AG_DatumBeginn DESC ';
  const logText = "Abgaben";

  q.query(res, sql, logText)
};

exports.abnahmevertraege = (req, res, next) => {
  let jahr = req.query.jahr;

  const sql = "SELECT Person.B_Name, Soll, Ist, Soll - Ist AS Differenz FROM `Person`, (SELECT Person.B_Name, SUM(AV_Menge) AS Soll FROM `Abnahmevertrag`, `Person` WHERE AV_Jahr = " + jahr + " AND P_ID = Person_P_ID GROUP BY B_Name ORDER BY B_Name) av, (SELECT Person.B_Name, SUM(AG_Menge) AS Ist FROM `Abgabe`, `Person` WHERE YEAR(AG_DatumEnde) = " + jahr + " AND P_ID = Person_P_ID GROUP BY Person.B_Name ORDER BY Person.B_Name) ag WHERE  Person.B_Name = av.B_Name AND Person.B_Name = ag.B_Name GROUP BY Person.B_Name ORDER BY Person.B_Name";
  const logText = "Abnahmevertraege";

  q.query(res, sql, logText)
};
exports.abnahmevertraegedaten = (req, res, next) => {
  const sql = "SELECT AV_ID, B_Name, AV_Jahr, AV_Menge FROM Abnahmevertrag, Person WHERE Person_P_ID = P_ID ORDER BY AV_Jahr DESC, B_Name";
  const logText = "Abnahmevertraege";

  q.query(res, sql, logText)
};
exports.analysen = (req, res, next) => {
  const sql = 'SELECT A_ID AS ID, S_Bezeichnung AS Stoff, A_ExterneID AS ExterneID, DATE_FORMAT(A_Datum, "%d.%m.%y") AS Datum, DATE_FORMAT(A_DatumGueltigAb, "%d.%m.%y") AS Gueltigkeitsdatum, AT_Bezeichnung AS Analysetyp, SA_A_Wert AS Wert FROM `Stoff`, `Stoffanalyse`, `Analysetyp`, `Stoffanalyse_Analysetyp` WHERE A_ID = Stoffanalyse_A_ID AND Analysetyp_AT_ID = AT_ID AND S_ID = Stoff_S_ID ORDER BY A_Datum DESC, Stoff, Analysetyp ';
  const logText = "Analysen";

  q.query(res, sql, logText)
};
exports.betriebe = (req, res, next) => {
  const sql = "SELECT P_ID AS ID, B_Name AS Betrieb, B_Nummer AS Betriebsnummer, GPT_ID, AD_ID, AD_Strasse, AD_PLZ, AD_Ort FROM Person, Geschaeftsp_Typ,Person_Adresse, Adresse WHERE Personentyp = 'Betrieb' AND Geschaeftsp_Typ_GPT_ID = GPT_ID AND Person_P_ID = P_ID AND Adresse_AD_ID = AD_ID ORDER BY B_Name";
  const logText = "Betriebe";

  q.query(res, sql, logText)
};

exports.bilanz = (req, res, next) => {
  let anfangsdatum = req.query.anfangsdatum;
  let enddatum = req.query.enddatum;

  const sql = "SELECT NS_Abgabe AS Naehrstoff, z.Zugangsmenge + f.Zugangsmenge AS Zugang, Abgabemenge AS Abgang, z.Zugangsmenge + f.Zugangsmenge - Abgabemenge AS Saldo FROM ( SELECT N_Bezeichnung AS NS_Zugang, SUM(N_Menge) AS Zugangsmenge  FROM `Naehrstoff`, `Naehrstoff_N_Eingang`, `N_Eingang`, `Zugang` WHERE Z_Datum <= '" + enddatum + "' AND Z_Datum >= '" + anfangsdatum + "' AND N_ID = Naehrstoff_N_ID	AND NE_ID = N_Eingang_NE_ID AND Z_ID = Zugang_Z_ID GROUP BY N_Bezeichnung ORDER BY N_Bezeichnung ) z, ( SELECT N_Bezeichnung AS NS_Zugang, SUM(N_Menge) AS Zugangsmenge FROM `Naehrstoff`, `Naehrstoff_N_Eingang`, `N_Eingang`, `Fuetterung` WHERE F_Datum <= '" + enddatum + "' 	AND F_Datum >= '" + anfangsdatum + "' AND N_ID = Naehrstoff_N_ID AND NE_ID = N_Eingang_NE_ID AND F_ID = Fuetterung_F_ID GROUP BY N_Bezeichnung ORDER BY N_Bezeichnung ) f, ( SELECT N_Bezeichnung AS NS_Abgabe, SUM(N_Menge) AS Abgabemenge        FROM `Naehrstoff`, `Naehrstoff_Abgabe`, `Abgabe` WHERE AG_DatumEnde <= '" + enddatum + "' AND AG_DatumEnde >= '" + anfangsdatum + "' AND N_ID = Naehrstoff_N_ID AND AG_ID = Abgabe_AG_ID GROUP BY N_Bezeichnung ORDER BY N_Bezeichnung ) a WHERE z.NS_Zugang = f.NS_Zugang AND z.NS_Zugang = NS_Abgabe ORDER BY NS_Abgabe";
  const logText = "Bilanzdaten";

  q.query(res, sql, logText)
};
exports.fuetterungenlager = (req, res, next) => {
  const sql = 'SELECT F_ID AS ID, DATE_FORMAT(F_Datum, "%d.%m.%y") AS Datum, S_Bezeichnung AS Stoff, F_BruttoMenge AS Menge, ME_Bezeichnung AS Einheit, L_Name AS Lager FROM Fuetterung, Stoff, Mengeneinheit, Lager WHERE Lager_L_ID = L_ID AND Mengeneinheit_ME_ID = ME_ID AND Lager.Stoff_S_ID = S_ID ORDER BY F_Datum DESC, Lager, Menge';
  const logText = "Fütterungen Lager";

  q.query(res, sql, logText)
};

exports.fuetterungendirekt = (req, res, next) => {
  const sql = 'SELECT F_ID AS ID, DATE_FORMAT(F_Datum, "%d.%m.%y") AS Datum, S_Bezeichnung AS Stoff, F_BruttoMenge AS Menge, ME_Bezeichnung AS Einheit FROM Fuetterung, Stoff, Mengeneinheit WHERE Lager_L_ID IS NULL AND Fuetterung.Stoff_S_ID = S_ID AND Mengeneinheit_ME_ID = ME_ID ORDER BY F_Datum DESC';
  const logText = "Fütterungen Direkt";

  q.query(res, sql, logText)
};

exports.lager = (req, res, next) => {
  const sql = 'SELECT L_ID AS ID, L_Name AS Lager, S_Bezeichnung AS Rohstoff, L_Bestand AS Bestand, ME_Bezeichnung AS Einheit FROM Lager, Stoff, Mengeneinheit WHERE Stoff_S_ID = S_ID AND Mengeneinheit_ME_ID = ME_ID ORDER BY L_Name';
  const logText = "Lager";

  q.query(res, sql, logText)
};

exports.stoffedirekt = (req, res, next) => {
  const sql = 'SELECT S_ID, P_ID, S_Bezeichnung AS Direktrohstoff, ME_Bezeichnung AS Einheit, B_Name AS Lieferant FROM Stoff, Mengeneinheit, Stoff_Person, Person WHERE Mengeneinheit_ME_ID = ME_ID AND Stofftyp = "Direktrohstoff" AND S_ID = Stoff_S_ID AND Person_P_ID = P_ID ORDER BY S_Bezeichnung';
  const logText = "Direktrohstoffe";

  q.query(res, sql, logText)
};

exports.stoffelager = (req, res, next) => {
  const sql = 'SELECT S_ID AS ID, S_Bezeichnung AS Lagerrohstoff, ME_Bezeichnung AS Einheit FROM Stoff, Mengeneinheit WHERE Mengeneinheit_ME_ID = ME_ID AND Stofftyp = "Lagerrohstoff" ORDER BY S_Bezeichnung';
  const logText = "Lagerrohstoffe";

  q.query(res, sql, logText)
};

exports.zugaenge = (req, res, next) => {
  const sql = 'SELECT Z_ID AS ID, DATE_FORMAT(Z_Datum, "%d.%m.%y") AS Datum, Z_BruttoMenge AS Menge, ME_Bezeichnung AS Einheit, L_Name AS Lager, B_Name As Lieferant FROM Zugang, Stoff, Mengeneinheit, Lager, Person  WHERE Lager_L_ID = L_ID AND Stoff_S_ID = S_ID AND Mengeneinheit_ME_ID = ME_ID AND Person_P_ID = P_ID  ORDER BY Z_Datum DESC ';
  const logText = "Zugänge";

  q.query(res, sql, logText)
};