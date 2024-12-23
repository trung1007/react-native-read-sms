// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
// import io, { Socket } from 'socket.io-client';

// const SOCKET_SERVER_URL = 'http://10.0.2.2:5000';


// const SocketTestScreen = () => {
//     const [socket, setSocket] = useState(null); // Socket instance
//     const [logs, setLogs] = useState([]); // Lưu log cho giao diện
  
//     // Hàm connect tới server
//     const handleConnect = () => {
//       if (socket) {
//         addLog("Already connected to the server");
//         return;
//       }
  
//       const newSocket = io(SOCKET_SERVER_URL);
  
//       newSocket.on("connect", () => {
//         addLog("Connected to server");
//       });
  
//       newSocket.on("audio_frame", (data) => {
//         const { frame } = data;
//         addLog(`Received audio frame: ${frame}`);
//       });
  
//       newSocket.on("disconnect", () => {
//         addLog("Disconnected from server");
//       });
//         // @ts-ignore
//       setSocket(newSocket); // Lưu socket instance
//     };
  
//     // Hàm disconnect khỏi server
//     const handleDisconnect = () => {
//       if (socket) {
//         // @ts-ignore
//         socket.disconnect();
//         setSocket(null);
//         addLog("Disconnected from server manually");
//       } else {
//         addLog("No active connection to disconnect");
//       }
//     };
  
//     // Thêm log vào màn hình
//     // @ts-ignore
//     const addLog = (message) => {
//         // @ts-ignore
//       setLogs((prevLogs) => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
//     };
  
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Audio Stream Client</Text>
//         <View style={styles.buttonContainer}>
//           <Button title="Connect to Server" onPress={handleConnect} />
//           <Button title="Disconnect from Server" onPress={handleDisconnect} color="red" />
//         </View>
//         <ScrollView style={styles.logContainer}>
//           {logs.map((log, index) => (
//             <Text key={index} style={styles.log}>
//               {log}
//             </Text>
//           ))}
//         </ScrollView>
//       </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 20,
//       backgroundColor: "#f5f5f5",
//     },
//     title: {
//       fontSize: 20,
//       fontWeight: "bold",
//       marginBottom: 20,
//       textAlign: "center",
//     },
//     buttonContainer: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       marginBottom: 20,
//     },
//     logContainer: {
//       flex: 1,
//       marginTop: 10,
//       padding: 10,
//       backgroundColor: "#fff",
//       borderRadius: 5,
//       borderWidth: 1,
//       borderColor: "#ddd",
//     },
//     log: {
//       fontSize: 14,
//       color: "#333",
//       marginBottom: 5,
//     },
//   });

// export default SocketTestScreen;
