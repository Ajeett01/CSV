import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Button,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { Parser } from '@json2csv/plainjs';
import jsonData from './test.json';
import { Table, Row } from 'react-native-table-component';

const Section = ({ children, title }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionDescription}>{children}</Text>
  </View>
);

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [csvData, setCsvData] = useState('');
  const [editingCsv, setEditingCsv] = useState(false);
  const [csvRows, setCsvRows] = useState([]);

  const convertJsonToCsv = async () => {
    try {
      const parser = new Parser();
      const csv = parser.parse(jsonData);
      setCsvData(csv);
      console.log(csv);

      const rows = csv.split('\n').map(row => row.split(','));
      setCsvRows(rows);
      setEditingCsv(true);
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCsvCell = (rowIndex, columnIndex, value) => {
    const newRows = csvRows.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === columnIndex ? value : cell))
    );
    setCsvRows(newRows);
  };

  const saveCsv = () => {
    const csvString = csvRows.map(row => row.join(',')).join('\n');
    setCsvData(csvString);
    setEditingCsv(false);
  };

  const downloadCsv = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to save CSV files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Storage permission denied');
          return;
        }
      }

      const res = await DocumentPicker.pickDirectory();
      if (res) {
        const path = `${RNFS.DownloadDirectoryPath}/data.csv`;
        await RNFS.writeFile(path, csvData, 'utf8');
        alert(`CSV file has been saved to ${path}`);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Failed to save CSV file:', err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={styles.headerButton}>Export</Text>
          </Pressable>
        </View>
        <View style={styles.body}>
          <Section title="CSV Converter">
            <Text>Convert JSON data to CSV and edit it.</Text>
          </Section>
        </View>
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalView}>
          <Button title="Convert JSON to CSV" onPress={convertJsonToCsv} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <Modal visible={editingCsv} animationType="slide">
        <View style={styles.fullScreen}>
          <ScrollView horizontal>
            <View>
              {csvRows.length > 0 && (
                <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                  <Row data={csvRows[0]} style={styles.header} textStyle={styles.text} widthArr={Array(csvRows[0].length).fill(100)} />
                </Table>
              )}
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                  {csvRows.slice(1).map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                      textStyle={styles.text}
                      widthArr={Array(rowData.length).fill(100)}
                    />
                  ))}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
          <Button title="Save CSV" onPress={saveCsv} />
          <Button title="Download CSV" onPress={downloadCsv} />
          <Button title="Close" onPress={() => setEditingCsv(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerButton: {
    fontSize: 18,
    color: 'blue',
  },
  body: {
    padding: 20,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  dataWrapper: {
    marginTop: -1,
  },
  text: {
    textAlign: 'center',
    fontWeight: '100',
  },
  row: {
    height: 40,
    backgroundColor: '#E7E6E1',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    margin: 2,
  },
});

export default App;

// import React, { useState } from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
//   Pressable,
//   Modal,
//   Button,
//   FlatList,
//   TextInput,
// } from 'react-native';
// import RNFS from 'react-native-fs';
// import DocumentPicker from 'react-native-document-picker';
// import { Parser } from '@json2csv/plainjs';
// import jsonData from './test.json';
// import RNFetchBlob from 'react-native-fetch-blob';
// import { PermissionsAndroid, Platform } from 'react-native';

// const Section = ({ children, title }) => (
//   <View style={styles.sectionContainer}>
//     <Text style={styles.sectionTitle}>{title}</Text>
//     <Text style={styles.sectionDescription}>{children}</Text>
//   </View>
// );

// const App = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [csvData, setCsvData] = useState('');
//   const [editingCsv, setEditingCsv] = useState(false);
//   const [csvRows, setCsvRows] = useState([]);

//   const convertJsonToCsv = async () => {
//     try {
//       const parser = new Parser();
//       const csv = parser.parse(jsonData);
//       setCsvData(csv);
//       console.log(csv);
      

//       const rows = csv.split('\n').map(row => row.split(','));
//       setCsvRows(rows);
//       setEditingCsv(true);
//       setModalVisible(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateCsvCell = (rowIndex, columnIndex, value) => {
//     const newRows = csvRows.map((row, rIdx) =>
//       row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === columnIndex ? value : cell))
//     );
//     setCsvRows(newRows);
//   };

//   const saveCsv = () => {
//     const csvString = csvRows.map(row => row.join(',')).join('\n');
//     setCsvData(csvString);
//     setEditingCsv(false);
//   };

//   const downloadCsv = async () => {
//     try {
//       // Request storage permission for Android
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: 'Storage Permission Required',
//             message: 'This app needs access to your storage to save CSV files',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           console.error('Storage permission denied');
//           return;
//         }
//       }
  
//       // Pick a directory
//       const res = await DocumentPicker.pickDirectory();
//       if (res) {
//         // Create a file path for the CSV
//         const path = `${RNFS.DownloadDirectoryPath}/data.csv`; // Use DownloadDirectoryPath for simplicity
//         // Write the CSV data to the file
//         await RNFS.writeFile(path, csvData, 'utf8');
//         alert(`CSV file has been saved to ${path}`);
//       }
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log('User cancelled the picker');
//       } else {
//         console.error('Failed to save CSV file:', err);
//       }
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
//       <ScrollView contentInsetAdjustmentBehavior="automatic">
//         <View style={styles.header}>
//           <Pressable onPress={() => setModalVisible(true)}>
//             <Text style={styles.headerButton}>Export</Text>
//           </Pressable>
//         </View>
//         <View style={styles.body}>
//           <Section title="CSV Converter">
//             <Text>Convert JSON data to CSV and edit it.</Text>
//           </Section>
//         </View>
//       </ScrollView>
//       <Modal visible={modalVisible} animationType="slide">
//         <View style={styles.modalView}>
//           <Button title="Convert JSON to CSV" onPress={convertJsonToCsv} />
//           <Button title="Close" onPress={() => setModalVisible(false)} />
//         </View>
//       </Modal>
//       <Modal visible={editingCsv} animationType="slide">
//         <View style={styles.fullScreen}>
//           <ScrollView>
//             <View style={styles.editContainer}>
//               {csvRows.map((row, rowIndex) => (
//                 <View key={rowIndex} style={styles.row}>
//                   {row.map((cell, columnIndex) => (
//                     <TextInput
//                       key={columnIndex}
//                       style={styles.cell}
//                       value={cell}
//                       onChangeText={(text) => updateCsvCell(rowIndex, columnIndex, text)}
//                     />
//                   ))}
//                 </View>
//               ))}
//             </View>
//           </ScrollView>
//           <Button title="Save CSV" onPress={saveCsv} />
//           <Button title="Download CSV" onPress={downloadCsv} />
//           <Button title="Close" onPress={() => setEditingCsv(false)} />
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     padding: 20,
//     backgroundColor: '#f8f8f8',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   headerButton: {
//     fontSize: 18,
//     color: 'blue',
//   },
//   body: {
//     padding: 20,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   modalView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fullScreen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//   },
//   editContainer: {
//     width: '100%',
//     flex: 1,
//   },
//   row: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   cell: {
//     // flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     padding: 8,
//     margin: 2,
//   },
// });

// export default App;
