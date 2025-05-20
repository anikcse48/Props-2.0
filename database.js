import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as SecureStore from 'expo-secure-store';
import XLSX from 'xlsx'

let dbInstance = null;

// Open or reuse database connection
export const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('projahnmo.db');
  }
  return dbInstance;
};

// Initialize database with tables
export const initDatabase = async () => {
  const db = await getDatabase();

  /*await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
);
  `);*/

  

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS form_data1 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT ,
      password TEXT,
      dateOfCollection TEXT, timeOfCollection TEXT, hospitalAdmissionDate TEXT, hospitalAdmissionTime TEXT,
      hospitalRegistrationNumber TEXT, womanName TEXT, husbandName TEXT, district TEXT, upazila TEXT,  village TEXT, landmark TEXT,
      mobile1 TEXT, mobile2 TEXT, mobile3 TEXT, usgAvailable TEXT, usgDate TEXT,  lmpDate TEXT, lmpDate1 TEXT,  lmpDate2 TEXT, lmpDate3 TEXT,
      modeOfDelivery TEXT, deliveryDate TEXT, deliveryTime TEXT, deliveryTime1 TEXT,
      outcome TEXT, birthOrder1 TEXT,  isSex TEXT, endInterviewTime3 TEXT,  isDiagnosed TEXT, isPerinatal TEXT, isAdmitted TEXT,  isVentilator TEXT, isConvulsion TEXT, birthOrder2 TEXT, 
      isSex1 TEXT, endInterviewTime4 TEXT, isDiagnosed1 TEXT, isPerinatal1 TEXT, isAdmitted1 TEXT, isConvulsion1 TEXT,
      isVentilator1 TEXT,  endInterviewTime TEXT, endInterviewTime1 TEXT, endInterviewTime2 TEXT, paramedicName TEXT,
      somchChecked TEXT, swmchChecked TEXT, somchChecked1 TEXT, swmchChecked1 TEXT
        
      
    );
  `);

  //await upgradeDatabase();



 // ✅ Add gaResult column if it doesn't exist
  try {
    await db.execAsync(`ALTER TABLE form_data1 ADD COLUMN gaResult TEXT`);
    console.log("Added gaResult column");
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('gaResult column already exists');
    } else {
      console.error('Error adding gaResult column:', error.message);
    }
  }

  // ✅ Add union1 column if it doesn't exist
  try {
    await db.execAsync(`ALTER TABLE form_data1 ADD COLUMN union1 TEXT`);
    console.log("Added union1 column");
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('union1 column already exists');
    } else {
      console.error('Error adding union1 column:', error.message);
    }
  }
};

// Improved upgradeDatabase with column existence check
// Improved upgradeDatabase with column existence check
/*const upgradeDatabase = async () => {
  const db = await getDatabase();
  const columnsToAdd = [
    "endInterviewTime1 TEXT",
    "endInterviewTime2 TEXT",
    "endInterviewTime3 TEXT",
    "endInterviewTime4 TEXT"
  ];

  try {
    // Fetch existing columns
    const existingColumns = await db.getAllAsync(`PRAGMA table_info(form_data);`);

    for (const column of columnsToAdd) {
      const columnName = column.split(" ")[0];
      const exists = existingColumns?.some(col => col.name === columnName);

      if (!exists) {
        await db.execAsync(`ALTER TABLE form_data ADD COLUMN ${column};`);
        console.log(`Added column: ${columnName}`);
      } else {
        console.log(`Column ${columnName} already exists`);
      }
    }
  } catch (error) {
    console.error("Error upgrading database:", error.message);
  }
};*/
// // Register a new user
export const registerUser = async (email, password) => {
  const db = await getDatabase();
  try {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        is_logged_in INTEGER DEFAULT 0
      );
    `);

    await db.runAsync(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email.trim(), password.trim()]
    );
    
    return { success: true };
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return { success: false, message: 'Email already exists' };
    }
    return { success: false, message: error.message };
  }
};


// Login existing user
export const loginUser = async (email, password) => {
  const db = await getDatabase();
  try {
    // Debug: Check email and password before query
    console.log("Login Attempt: ", email, password);

    const result = await db.getFirstAsync(
      'SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ?',
      [email.trim(), password.trim()]
    );

    console.log("Login Result:", result);

    if (result) {
      return { success: true };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  } catch (error) {
    console.error('Login Error:', error);
    return { success: false, message: error.message || 'Login failed' };
  }
};




// Logout current user
export const logoutUser = async () => {
  const db = await getDatabase();
  await db.runAsync('UPDATE users SET is_logged_in = 0');
};

// Improved insertFormData with email check
// Improved insertFormData with email check
export const insertFormData = async (formData) => {
  const db = await getDatabase();
  //const gaResult = calculateGA(formData.lmpDate, formData.deliveryDate);

  try {
    // Check for duplicate email
   /* const existing = await db.getFirstAsync(
      "SELECT * FROM form_data WHERE email = ?",
      [formData.email]
    );

    if (existing) {
      return { success: false, message: "Email already exists." };
    }*/

      

    await db.runAsync(`
      INSERT  INTO form_data1 (
        email, password, womanName, husbandName, district, upazila, village, landmark,
        dateOfCollection, timeOfCollection, hospitalAdmissionDate, hospitalAdmissionTime,
        hospitalRegistrationNumber, lmpDate, lmpDate1, lmpDate2, lmpDate3, usgAvailable, usgDate,
        modeOfDelivery, deliveryDate, outcome, birthOrder1, birthOrder2, deliveryTime1, deliveryTime,
        isSex, isSex1, isDiagnosed, isDiagnosed1, isPerinatal, isPerinatal1, isAdmitted, isAdmitted1, isConvulsion,
        isConvulsion1, isVentilator, isVentilator1, paramedicName,
        somchChecked, swmchChecked, somchChecked1, swmchChecked1,
        mobile1, mobile2, mobile3, endInterviewTime,
        endInterviewTime1, endInterviewTime2, endInterviewTime3, endInterviewTime4, gaResult, union1
      ) VALUES ( ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      formData.email || '', formData.password || '',
      formData.womanName || '', formData.husbandName || '', formData.district || '',
      formData.upazila || '',   formData.village || '', formData.landmark || '',
      formData.dateOfCollection || '', formData.timeOfCollection || '',
      formData.hospitalAdmissionDate || '', formData.hospitalAdmissionTime || '',
      formData.hospitalRegistrationNumber || '', formData.lmpDate || '', formData.lmpDate1 || '', formData.lmpDate2 || '',  formData.lmpDate3 || '',
      formData.usgAvailable || '', formData.usgDate || '', formData.modeOfDelivery || '',
      formData.deliveryDate || '', formData.outcome || '', formData.birthOrder1 || '',
      formData.birthOrder2 || '', formData.deliveryTime1 || '', formData.deliveryTime || '', formData.isSex || '',formData.isSex1 || '',
      formData.isDiagnosed || '', formData.isDiagnosed1 || '', formData.isPerinatal || '',  formData.isPerinatal1 || '',
      formData.isAdmitted || '', formData.isAdmitted1 || '', formData.isConvulsion || '', formData.isConvulsion1 || '',
      formData.isVentilator || '', formData.isVentilator1 || '', formData.paramedicName || '',
      formData.somchChecked ? 1 : 0, formData.swmchChecked ? 1 : 0, formData.somchChecked1 ? 1 : 0,
      formData.swmchChecked1 ? 1 : 0, formData.mobile1 || '', formData.mobile2 || '',
      formData.mobile3 || '', formData.endInterviewTime || '',
      formData.endInterviewTime1 || '', formData.endInterviewTime2 || '',
      formData.endInterviewTime3 || '', formData.endInterviewTime4 || '',  formData.gaResult || ''
    ,formData.union1 || ''
    ]);

    return { success: true };
  } catch (error) {
    console.error('Insert failed:', error.message);
    return { success: false, message: error.message };
  }
};





// Update Form Data
/*export const updateFormData = async (id, formData) => {
  const db = await getDatabase();
  await db.runAsync(`
    UPDATE form_data1 SET
      email=?, password=?, womanName=?, husbandName=?, district=?, upazila=?, village=?, landmark=?,
        dateOfCollection=?, timeOfCollection=?, hospitalAdmissionDate=?, hospitalAdmissionTime=?,
        hospitalRegistrationNumber=?, lmpDate=?, lmpDate1=?, lmpDate2=?, lmpDate3=?, usgAvailable=?, usgDate=?,
        modeOfDelivery=?, deliveryDate=?, outcome=?, birthOrder1=?, birthOrder2=?, deliveryTime1=?, deliveryTime=?,
        isSex=?, isSex1=?, isDiagnosed=?, isDiagnosed1=?, isPerinatal=?, isPerinatal1=?, isAdmitted=?, isAdmitted1=?, isConvulsion=?,
        isConvulsion1=?, isVentilator=?, isVentilator1=?, paramedicName=?,
        somchChecked=?, swmchChecked=?, somchChecked1=?, swmchChecked1=?,
        mobile1=?, mobile2=?, mobile3=?, endInterviewTime=?,
        endInterviewTime1=?, endInterviewTime2=?, endInterviewTime3=?, endInterviewTime4=?, WHERE id = ?;
  `, [...Object.values(formData), id]);
};*/

// Delete Form Data
export const deleteFormData = async (id) => {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM form_data1 WHERE id = ?;`, [id]);
};


// Fetch all form data
export const fetchAllFormData = async () => {
  const db = await getDatabase();
  return await db.getAllAsync('SELECT * FROM form_data1');
};

// Fetch logged-in user data
export const getLoggedInUser = async () => {
  const db = await getDatabase();
  const result = await db.getFirstAsync('SELECT * FROM users WHERE is_logged_in = 1');
  return result;
};



// Export DB to file and share
export const exportDatabaseToStorage = async () => {
  try {
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/projahnmo.db`;
    const exportFileName = `projahnmo-backup-${Date.now()}.db`;
    const exportPath = `${FileSystem.documentDirectory}${exportFileName}`;

    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
    if (!fileInfo.exists) throw new Error('Database file not found');

    await FileSystem.copyAsync({ from: dbFilePath, to: exportPath });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(exportPath, {
        mimeType: 'application/octet-stream',
        dialogTitle: 'Share your database backup',
      });
    }

    return exportPath;
  } catch (error) {
    console.error('Export failed:', error.message);
    throw error;
  }
};


// ✅ Main Excel export function
export const exportDatabaseAsExcel = async () => {
  try {
    const data = await fetchAllFormData();

    // 🔁 Convert 1/0 to Yes/No if needed
    /*const formattedData = data.map(item => ({
      ...item,
     somchChecked: item.somchChecked ? 'Yes' : 'No',
     swmchChecked: item.swmchChecked ? 'Yes' : 'No',
     somchChecked1: item.somchChecked1 ? 'Yes' : 'No',
    swmchChecked1: item.swmchChecked1 ? 'Yes' : 'No',
      // Add all other boolean fields you want to format
    }));*/

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Form Data');

    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

    const fileName = `projahnmo-export-${Date.now()}.xlsx`;
    const uri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Share your Excel export',
      });
    }

    return uri;
  } catch (error) {
    console.error('Excel export failed:', error.message);
    throw error;
  }
};