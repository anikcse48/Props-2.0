import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Button } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { fetchAllFormData, updateFormData, deleteFormData,exportDatabaseAsExcel } from './database';
import { EventEmitter } from 'expo-modules-core';
import { Ionicons, Feather  } from '@expo/vector-icons';

// Global Event Emitter
export const DataRefreshEmitter = new EventEmitter();

export default function DatabaseView() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllFormData();
      setFormData(data);
    } catch (error) {
      console.error('Failed to fetch form data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
    }

    const subscription = DataRefreshEmitter.addListener('refreshData', loadData);

    return () => subscription.remove();
  }, [isFocused]);


  /*const handleUpdate = (item) => {
    const updatedData = { ...item, womanName: 'Updated Name' }; // Example update
    updateFormData(item.id, updatedData);
    loadData();
  };*/

  const handleDelete = (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this record?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: async () => { await deleteFormData(id); loadData(); } }
    ]);
  };



  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={[styles.headerRow, styles.stickyHeader]}>
            <Text style={styles.headerCell}>SWMCH</Text>
            <Text style={styles.headerCell}>SOMCH</Text>
            <Text style={styles.headerCell}>Real-Time Data Collection</Text>
            <Text style={styles.headerCell}>Extraction from Hospital</Text>
            <Text style={styles.headerCell}>Date of Collection</Text>
             <Text style={styles.headerCell}>Time of Collection</Text>
             <Text style={styles.headerCell}>Hospital Admission Date</Text>
             <Text style={styles.headerCell}>Hospital Admission Time</Text>
             <Text style={styles.headerCell}>Hospital Registration Number</Text>
            <Text style={styles.headerCell}>Woman Name</Text>
            <Text style={styles.headerCell}>Husband Name</Text>
            <Text style={styles.headerCell}>District</Text>
            <Text style={styles.headerCell}>Upazila</Text>
             <Text style={styles.headerCell}>Union</Text>
            <Text style={styles.headerCell}>Village</Text>
            <Text style={styles.headerCell}>Landmark</Text>
            <Text style={styles.headerCell}>Mobile Number(self)</Text>
           <Text style={styles.headerCell}>Mobile(Home)</Text>
           <Text style={styles.headerCell}>Mobile (Emergency)</Text>
           <Text style={styles.headerCell}>LMP Available</Text>
           <Text style={styles.headerCell}>USG Available</Text>
           <Text style={styles.headerCell}>Date of LMP for this women</Text>
           <Text style={styles.headerCell}>Date of earliest USG report</Text>
           <Text style={styles.headerCell}>GA on earliest USG report</Text>
           <Text style={styles.headerCell}>EDD on earliest USG report</Text>
           <Text style={styles.headerCell}>Mode of Delivery</Text>
           <Text style={styles.headerCell}>Delivery Date</Text>
           <Text style={styles.headerCell}>Delivery Time </Text>
           <Text style={styles.headerCell}>GA of the mother on the date of delivery</Text>
           <Text style={styles.headerCell}>Outcome of Delivery</Text>
           <Text style={styles.headerCell}>Birth Order 1</Text>
           <Text style={styles.headerCell}>Sex of the baby</Text>
           <Text style={styles.headerCell}>Weight of the baby</Text>
           <Text style={styles.headerCell}>Did the child diagnosed as neonatal sepsis after birth?</Text>
           <Text style={styles.headerCell}>Did the child had Perinatal asphyxia</Text>
           <Text style={styles.headerCell}>Did the child admitted in NICU/SCANU</Text>
           <Text style={styles.headerCell}>Did the child required ventilator/CPAP</Text>
           <Text style={styles.headerCell}>Did the child had any convulsion?</Text>
           <Text style={styles.headerCell}>Birth Order 2</Text>
           <Text style={styles.headerCell}>Sex of the baby</Text>
           <Text style={styles.headerCell}>Weight of the baby</Text>
           <Text style={styles.headerCell}>Did the child diagnosed as neonatal sepsis after birth?</Text>
           <Text style={styles.headerCell}>Did the child had Perinatal asphyxia</Text>
           <Text style={styles.headerCell}>Did the child admitted in NICU/SCANU</Text>
           <Text style={styles.headerCell}>Did the child required ventilator/CPAP</Text>
           <Text style={styles.headerCell}>Did the child had any convulsion?</Text>
           <Text style={styles.headerCell}>End Interview Time</Text>
           <Text style={styles.headerCell}>End Interview Time</Text>
           <Text style={styles.headerCell}>End Interview Time</Text>
           <Text style={styles.headerCell}>Paramedic Name</Text>
           <Text style={styles.headerCell}>Actions</Text>

           </View>
          <ScrollView style={styles.dataScroll}>
            {formData.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{item.swmchChecked}</Text>
                <Text style={styles.cell}>{item.somchChecked}</Text>
                <Text style={styles.cell}>{item.somchChecked1}</Text>
                <Text style={styles.cell}>{item.swmchChecked1 }</Text>
                <Text style={styles.cell}>{item.dateOfCollection}</Text>
                <Text style={styles.cell}>{item.timeOfCollection}</Text>
                <Text style={styles.cell}>{item.hospitalAdmissionDate}</Text>
                <Text style={styles.cell}>{item.hospitalAdmissionTime}</Text>
                <Text style={styles.cell}>{item.hospitalRegistrationNumber}</Text>
                <Text style={styles.cell}>{item.womanName}</Text>
                <Text style={styles.cell}>{item.husbandName}</Text>
                <Text style={styles.cell}>{item.district}</Text>
                <Text style={styles.cell}>{item.upazila}</Text>
                <Text style={styles.cell}>{item.union1}</Text>
                <Text style={styles.cell}>{item.village}</Text>
                <Text style={styles.cell}>{item.landmark}</Text>
                <Text style={styles.cell}>{item.mobile1}</Text>
                <Text style={styles.cell}>{item.mobile2}</Text>
                <Text style={styles.cell}>{item.mobile3}</Text>
                <Text style={styles.cell}>{item.usgAvailable}</Text>
                <Text style={styles.cell}>{item.usgDate }</Text>
                <Text style={styles.cell}>{item.lmpDate}</Text>
                <Text style={styles.cell}>{item.lmpDate1}</Text>
                <Text style={styles.cell}>{item.lmpDate2}</Text>
                <Text style={styles.cell}>{item.lmpDate3}</Text>
                <Text style={styles.cell}>{item.modeOfDelivery  }</Text>
                <Text style={styles.cell}>{item.deliveryDate}</Text>
                <Text style={styles.cell}>{item.deliveryTime}</Text>
                <Text style={styles.cell}>{item.gaResult}</Text>
                <Text style={styles.cell}>{item.outcome }</Text>
                <Text style={styles.cell}>{item.birthOrder1 }</Text>
               <Text style={styles.cell}>{item.isSex }</Text>
               <Text style={styles.cell}>{item.endInterviewTime3}</Text>
               <Text style={styles.cell}>{item.isDiagnosed}</Text>
               <Text style={styles.cell}>{item.isPerinatal }</Text>
              <Text style={styles.cell}>{item.isAdmitted }</Text>
              <Text style={styles.cell}>{item.isVentilator}</Text>
             <Text style={styles.cell}>{item.isConvulsion }</Text>
              <Text style={styles.cell}>{item.birthOrder2 }</Text>
               <Text style={styles.cell}>{item.isSex1 }</Text>
               <Text style={styles.cell}>{item.endInterviewTime4}</Text>
               <Text style={styles.cell}>{item.isDiagnosed1 }</Text>
               <Text style={styles.cell}>{item.isPerinatal1 }</Text>
              <Text style={styles.cell}>{item.isAdmitted1 }</Text>
              <Text style={styles.cell}>{item.isVentilator1 }</Text>
             <Text style={styles.cell}>{item.isConvulsion1 }</Text>
             <Text style={styles.cell}>{item.endInterviewTime}</Text>
              <Text style={styles.cell}>{item.endInterviewTime1}</Text>
             <Text style={styles.cell}>{item.endInterviewTime2}</Text>
             <Text style={styles.cell}>{item.paramedicName}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionText}>
                  <Ionicons name="trash" size={24} color="black" />
                </TouchableOpacity>

              </View>
            ))}
          </ScrollView>
        </View>
       

      </ScrollView>
        <Button title="Export as Excel" onPress={exportDatabaseAsExcel} />
      
    </View>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  tableContainer: { minWidth: 800 },
  headerRow: { flexDirection: 'row', backgroundColor: '#48494a' },
  headerCell: { width: 150, fontWeight: 'bold', color: '#fff', textAlign: 'center', padding: 8, borderWidth: 1, borderColor: '#ddd' },
  row: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderBottomWidth: 1, borderColor: '#ddd' },
  cell: { width: 150, textAlign: 'center', padding: 8, borderWidth: 1, borderColor: '#ddd' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  actionText: { alignItems: 'center', justifyContent: 'center' }
});